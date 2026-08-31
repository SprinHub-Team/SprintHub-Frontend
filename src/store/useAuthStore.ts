import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: sessionStorage.getItem('token'),
  login: (user, token) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
