import { create } from 'zustand';
import { setAuthToken } from '@/services/api/tokenStore';
import { startRealtimeSession, stopRealtimeSession } from '@/services/socket/socketService';
import { login as loginRequest, register as registerRequest } from '../services/authService';
import { clearSession, readSession, saveSession } from '../services/sessionStorage';
import type { AuthSession, LoginPayload, RegisterPayload } from '../types/auth.types';

export type AuthStatus = 'checking' | 'authenticated' | 'guest';

interface AuthState {
  status: AuthStatus;
  session: AuthSession | null;

  restoreSession: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateSessionUser: (user: AuthSession['user']) => void;
}

function activateSession(session: AuthSession): void {
  setAuthToken(session.token);
  startRealtimeSession(session.token);
}

function deactivateSession(): void {
  setAuthToken(null);
  stopRealtimeSession();
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'checking',
  session: null,

  restoreSession: () => {
    const session = readSession();
    if (session) {
      activateSession(session);
      set({ status: 'authenticated', session });
    } else {
      set({ status: 'guest', session: null });
    }
  },

  login: async (payload) => {
    const session = await loginRequest(payload);
    saveSession(session);
    activateSession(session);
    set({ status: 'authenticated', session });
  },

  register: async (payload) => {
    await registerRequest(payload);
  },

  logout: () => {
    clearSession();
    deactivateSession();
    set({ status: 'guest', session: null });
  },

  updateSessionUser: (user) => {
    set((state) => {
      if (!state.session) return state;
      const session: AuthSession = { ...state.session, user };
      saveSession(session);
      return { session };
    });
  },
}));
