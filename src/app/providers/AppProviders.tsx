import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast/Toast';
import { ErrorState } from '@/components/ui/ErrorState/ErrorState';
import styles from './AppProviders.module.css';

interface BoundaryProps {
  children: ReactNode;
}

interface BoundaryState {
  hasError: boolean;
  message: string;
}

class AppErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): BoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[SprintHub] Error no controlado:', error, info.componentStack);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className={styles.boundaryFallback}>
          <ErrorState
            className={styles.boundaryCard}
            title="SprintHub no pudo continuar"
            message={this.state.message}
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppErrorBoundary>
      <ToastProvider>{children}</ToastProvider>
    </AppErrorBoundary>
  );
}
