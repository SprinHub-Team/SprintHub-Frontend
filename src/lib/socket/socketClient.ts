import { io, type Socket } from 'socket.io-client';
import { env } from '@/config/env';
import type { SocketBroadcastEvent, SocketEmitEvent } from './socketEvents';

export type SocketConnectionStatus = 'disconnected' | 'connecting' | 'connected';

type StatusHandler = (status: SocketConnectionStatus) => void;
type BroadcastHandler = (payload: unknown) => void;

interface ConnectionImplementation {
  connect(token: string): void;
  disconnect(): void;
  emitWithAck(event: SocketEmitEvent, payload: unknown, timeoutMs: number): Promise<unknown>;
  on(event: SocketBroadcastEvent, handler: BroadcastHandler): () => void;
}

let implementation: ConnectionImplementation | null = null;
let status: SocketConnectionStatus = 'disconnected';
const statusHandlers = new Set<StatusHandler>();

function setStatus(next: SocketConnectionStatus): void {
  status = next;
  statusHandlers.forEach((handler) => handler(next));
}

function createRealImplementation(): ConnectionImplementation {
  let socket: Socket | null = null;

  return {
    connect(token: string) {
      if (socket) return;
      setStatus('connecting');
      socket = io(env.socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
      });
      socket.on('connect', () => setStatus('connected'));
      socket.on('disconnect', () => setStatus('disconnected'));
      socket.on('connect_error', () => setStatus('connecting'));
    },

    disconnect() {
      if (!socket) return;
      socket.removeAllListeners();
      socket.disconnect();
      socket = null;
      setStatus('disconnected');
    },

    emitWithAck(event: SocketEmitEvent, payload: unknown, timeoutMs: number) {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error('La conexión de sockets no está inicializada'));
          return;
        }
        const timer = setTimeout(() => {
          reject(new Error('Tiempo de espera agotado en la operación realtime'));
        }, timeoutMs);
        socket.emit(event, payload, (ack: unknown) => {
          clearTimeout(timer);
          resolve(ack);
        });
      });
    },

    on(event: SocketBroadcastEvent, handler: BroadcastHandler) {
      if (!socket) return () => undefined;
      const wrapped = handler as (...args: unknown[]) => void;
      socket.on(event, wrapped);
      return () => {
        socket?.off(event, wrapped);
      };
    },
  };
}

function ensureImplementation(): ConnectionImplementation {
  if (!implementation) {
    implementation = createRealImplementation();
  }
  return implementation;
}

export function connectSocket(token: string): void {
  ensureImplementation().connect(token);
}

export function disconnectSocket(): void {
  implementation?.disconnect();
  implementation = null;
  setStatus('disconnected');
}

export async function emitSocketAck(
  event: SocketEmitEvent,
  payload: unknown,
  timeoutMs = 10000,
): Promise<unknown> {
  return ensureImplementation().emitWithAck(event, payload, timeoutMs);
}

export function subscribeSocketEvent(
  event: SocketBroadcastEvent,
  handler: BroadcastHandler,
): () => void {
  return ensureImplementation().on(event, handler);
}

export function subscribeSocketStatus(handler: StatusHandler): () => void {
  statusHandlers.add(handler);
  handler(status);
  return () => {
    statusHandlers.delete(handler);
  };
}

export function getSocketStatus(): SocketConnectionStatus {
  return status;
}
