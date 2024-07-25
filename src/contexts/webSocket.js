'use client';
// WebSocketContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from '@/contexts/user'; // Ajusta la ruta según corresponda
import { useTurnoContext } from '@/contexts/turno'; // Ajusta la ruta según corresponda
import { toast } from 'react-toastify';

const WebSocketContext = createContext([]);

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const { user } = useUserContext();
    const { lenguaje,fechaFormateada,date, setTurnos, setDias } = useTurnoContext()
    const [socket, setSocket] = useState(null);
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    // Función para convertir una fecha formateada en un objeto Date
    const parseFechaFormateada = (fechaFormateada, lenguaje) => {
        const [diaSemana, diaMes, mes, anio] = fechaFormateada
            .replace(',', '')
            .split(/[\s-]+/);
        const mesesEspañol = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const mesesIngles = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const mesIndex = lenguaje === 'español' ? mesesEspañol.indexOf(mes) : mesesIngles.indexOf(mes);

        return new Date(anio, mesIndex, diaMes);
    };

    // Función para comparar solo día, mes y año de dos fechas usando la fecha formateada
    const isSameDay = (fecha1,fecha2) => {
        return (
            fecha1.getFullYear() === fecha2.getFullYear() &&
            fecha1.getMonth() === fecha2.getMonth() &&
            fecha1.getDate() === fecha2.getDate()
        );
    };

    function updateAgendaCalendar(turno, operation) {
        const turnoData = {
            ...turno,
            start: new Date(turno.fecha),
            end: new Date(new Date(turno.fecha).getTime() + turno.duracion * 60000),
            hora: turno.horario,
            tipo: "turno",
            text: `${turno.horario} - ${formatTime(new Date(new Date(turno.fecha).getTime() + turno.duracion * 60000))}`
        };
    
        // Update setDias
        setDias(prev => {
            if(!prev)
                return prev;
            return prev.map(dia => {
                if (new Date(dia.fecha).toDateString() === new Date(turno.fecha).toDateString()) {
                    let intervalos = dia.intervalos.filter(intervalo => intervalo.id !== turno.id && intervalo.hora!==turnoData.hora);
    
                    if (operation === 'create' || (operation === 'update' && turno.estado !== 'Cancelado')) {
                        intervalos.push(turnoData);
                    }
    
                    intervalos.sort((a, b) => new Date(a.start) - new Date(b.start));
    
                    return { ...dia, intervalos };
                }
                return dia;
            });
        });
     
        // Update setTurnos
        setTurnos(prev => {
            if(!prev)
                return prev;
            if (isSameDay(new Date(turno.fecha), parseFechaFormateada(fechaFormateada, lenguaje))) {
                let turnos = prev.filter(t => t.id !== turno.id);
                if (operation === 'create' || (operation === 'update' && turno.estado !== 'Cancelado')) {
                    turnos.push(turnoData);
                }
                //descendente
                turnos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                return turnos;
            }
            return prev;
        });
    }
    
    useEffect(() => {
        if (user && user['wsToken']) {
            const newSocket = new WebSocket(`${process.env.WS_APP_BASE_URL}?token=${user['wsToken']}`);

            newSocket.onopen = () => {
                console.log('WebSocket connected');
            };

            newSocket.onmessage = async (event) => {
                const {codigo,data }= JSON.parse(event.data); //por ahora el codigo es turno sino es el modulo que afecta ahr

                try {
                    const response = await fetch(`${process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL}/turnos/${data.turnoId}`, {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            authorization: "Bearer " + user.token,
                        }
                    });

                    const result = await response.json();

                    if (result.status === "SUCCESS") {
                        const turno = result.data;
                        const changes = data.changes;
                    
                        // Extract necessary information
                        const fecha = new Date(turno.fecha).toLocaleDateString('es-ES');
                        const hora = turno.horario;
                        const nombrePaciente = turno.nombre;
                        const doctor = user.rol !== 'profesional' ? `Doctor: ${turno.doctor}` : '';
                    
                        // Generate the message based on the operation
                        if (data.operation === 'create') {
                            let message = `Turno creado para ${nombrePaciente} el ${fecha} a las ${hora}. ${doctor}`;
                            toast(message, { type: 'info' });
                        } else if (data.operation === 'update') {
                            let message = `Turno actualizado para ${nombrePaciente} el ${fecha} a las ${hora}. ${doctor}. Cambios: `;
                            let changesMessages = [];
                    
                            if (changes.fecha_hora) {
                                const from = new Date(changes.fecha_hora.from).toLocaleString('es-ES');
                                const to = new Date(changes.fecha_hora.to).toLocaleString('es-ES');
                                toast(message+`
                                fecha y hora: de ${from} a ${to}`, { type: 'info' });
                                changesMessages.push(`fecha y hora: de ${from} a ${to}`);
                            }
                    
                            if (changes.estado) {
                                const from = changes.estado.from;
                                const to = changes.estado.to; 
                                if(changes.estado.to === 'Cancelado') {
                                    message = `Se canceló el turno para ${nombrePaciente} el ${fecha} a las ${hora}. ${doctor}`;
                                    toast(message, { type: 'error' });
                                }else{
                                    toast(message+`
                                    estado: de ${from} a ${to}`, { type: 'info' });
                                }
                            }
                    
                            if (changes.nota) {
                                const from = changes.nota.from;
                                const to = changes.nota.to;
                                toast(message+ `Se agregó la nota al turno: ${to}`, { type: 'info' }); 
                            }
                     
                        }
                        updateAgendaCalendar(turno,data.operation);

                    }
                                      
                } catch (error) {
                    console.error('Error fetching turno:', error);
                }
            };

            newSocket.onclose = () => {
                console.log('WebSocket disconnected');
            };

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        }
    }, [user]);

    const closeWebSocket = () => {
        if (socket) {
            socket.close();
            setSocket(null);
        }
    };

    return (
        <WebSocketContext.Provider value={{ closeWebSocket }}>
            {children}
        </WebSocketContext.Provider>
    );
};
