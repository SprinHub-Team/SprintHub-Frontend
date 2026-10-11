import { authSessionSchema } from '../schemas/sessionSchema';
import type { AuthSession } from '../types/auth.types';

const STORAGE_KEY = 'sprinthub_auth';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

export function saveSession(session: AuthSession): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function readSession(): AuthSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    const result = authSessionSchema.safeParse(parsed);
    if (!result.success) {
      clearSession();
      return null;
    }
    return result.data;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
