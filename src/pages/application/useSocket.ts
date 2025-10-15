import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const useWebSocket = (applicationId: string) => {
    const [loadingSocket, setLoadingSocket] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io("https://dev.api.allgoodnasiya.uz", {
            transports: ['websocket', 'polling'],
        });
        const socket = socketRef.current;

        socket.on("connect", () => {
            socket.emit("subscribeToApplication", applicationId);
            setLoadingSocket(true);
            console.log('socketga ulandi');

        });

        socket.on("update", (update: any) => {
            setLoadingSocket(false);
            console.log('malumot yangilanmoqda');

        });

        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket");
            console.log('socketdan uzildi');

        });

        return () => {
            socket.disconnect();
        };
    }, [applicationId]);

    return { socket: socketRef.current, loadingSocket };
};

export default useWebSocket;