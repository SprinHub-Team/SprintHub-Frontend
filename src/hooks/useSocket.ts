import { useEffect } from 'react';
import { socket } from '../services/socket';

export const useSocket = () => {
  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Conectado al servidor de WebSockets', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del servidor de WebSockets');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
};
