import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Toast.module.css';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastInput {
  message: string;
  title?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends Required<Omit<ToastInput, 'title'>> {
  id: number;
  title?: string;
}

interface ToastApi {
  success(message: string, title?: string): void;
  error(message: string, title?: string): void;
  info(message: string, title?: string): void;
}

const ToastContext = createContext<ToastApi | null>(null);

const DEFAULT_DURATION_MS = 4200;

const variantIcons: Record<ToastVariant, typeof Info> = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (input: ToastInput) => {
      counterRef.current += 1;
      const id = counterRef.current;
      const toast: ToastItem = {
        id,
        message: input.message,
        title: input.title,
        variant: input.variant ?? 'info',
        duration: input.duration ?? DEFAULT_DURATION_MS,
      };
      setToasts((current) => [...current.slice(-3), toast]);
    },
    [],
  );

  const api = useMemo<ToastApi>(
    () => ({
      success: (message, title) => push({ message, title, variant: 'success' }),
      error: (message, title) => push({ message, title, variant: 'error', duration: 6000 }),
      info: (message, title) => push({ message, title, variant: 'info' }),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notificaciones"
        className={styles.viewport}
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const Icon = variantIcons[toast.variant];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role="status"
      className={cn(
        styles.toast,
        toast.variant === 'error' ? styles.toastError : styles.toastDefault,
      )}
    >
      <Icon aria-hidden="true" className={styles.icon} />
      <div className={styles.content}>
        {toast.title ? <p className={styles.title}>{toast.title}</p> : null}
        <p className={styles.message}>{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
        className={styles.closeButton}
      >
        <X aria-hidden="true" className="icon-md" />
      </button>
    </div>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe utilizarse dentro de <ToastProvider>');
  }
  return context;
}
