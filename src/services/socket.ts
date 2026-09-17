import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'; // Corregido para desarrollo local sin /api

export const socket: Socket = io(URL, {
  autoConnect: false, // Conectaremos manualmente cuando sea necesario
});
