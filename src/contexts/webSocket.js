'use client';
// WebSocketContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from '@/contexts/user'; // Ajusta la ruta según corresponda
import { toast } from 'react-toastify';
import Turno from '@/components/Turno'; // Ajusta la ruta según corresponda

const WebSocketContext = createContext([]);

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const { user } = useUserContext();
    const [socket, setSocket] = useState(null);

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
                        const toastComp = <Turno data={result.data} />

                        if (data.operation === 'create') {
                            toast(toastComp, { type: 'info' });
                        } else if (data.operation === 'update') {
                            const changes = data.changes;
                            let message = `Turno actualizado. Cambios: ${Object.keys(changes).map(key => `${key}: ${changes[key]}`).join(', ')}`;
                            if (changes.estado === 'Cancelado') {
                                toast(toastComp, { type: 'error' });
                            } else {
                                toast(toastComp, { type: 'info' });
                            }
                        }
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
