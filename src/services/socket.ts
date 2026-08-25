import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Asegúrate de que el puerto de tu backend coincida

export const socket: Socket = io(URL, {
  autoConnect: false, // Conectaremos manualmente cuando sea necesario
});
