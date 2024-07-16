'use client';
// WebSocketContext.js
import {createContext, useContext, useEffect} from 'react'
import { useUserContext } from '@/contexts/user'; // Ajusta la ruta según corresponda
import { toast } from 'react-toastify';
import Turno from '@/components/Turno'; // Ajusta la ruta según corresponda


const WebSocketContext = createContext([])

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const { user } = useUserContext();

    useEffect(() => {
        if (user && user['ws-token']) {
            const socket = new WebSocket(`${process.env.WS_APP_BASE_URL}?token=${user['ws-token']}`);

            socket.onopen = () => {
                console.log('WebSocket connected');
            };

            socket.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                try {
                    const response = await fetch(`${process.env.SERVER_APP_BASE_URL ? process.env.SERVER_APP_BASE_URL : process.env.REACT_APP_BASE_URL}/turnos/${data.turnoId}`,
                        {
                            method: "GET",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                authorization: "Bearer "+ user.token,
                            }
                        }
                    );

                    const result = await response.json();

                    if (result.status === "SUCCESS") {
                        const turno = result.data;

                        if (data.operation === 'create') {
                            toast(<Turno data={turno} />, { type: 'info' });
                        } else if (data.operation === 'update') {
                            const changes = data.changes;
                            let message = `Turno actualizado. Cambios: ${Object.keys(changes).map(key => `${key}: ${changes[key]}`).join(', ')}`;
                            if (changes.estado === 'Cancelado') {
                                toast(<Turno data={turno} />, { type: 'error' });
                            } else {
                                toast(<Turno data={turno} />, { type: 'info' });
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching turno:', error);
                }
            };

            socket.onclose = () => {
                console.log('WebSocket disconnected');
            };

            return () => {
                socket.close();
            };
        }
    }, [user]);

    return (
        <WebSocketContext.Provider value={{}}>
            {children}
        </WebSocketContext.Provider>
    );
};

