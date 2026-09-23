import { io, Socket } from 'socket.io-client';
import env from '@/config/env';
import { useAuthStore } from '@/features/auth/store/authStore';

class SocketClient {
    private socket: Socket | null = null;

    connect() {
        if (this.socket?.connected) return this.socket;

        const token = useAuthStore.getState().token;
        if (!token) return null;

        this.socket = io(env.socketUrl, {
            auth: { token },
            transports: ['websocket'],
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }
}

export const socketClient = new SocketClient();
