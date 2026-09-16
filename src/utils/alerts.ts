import Swal from 'sweetalert2';

// Diseño futurista/glassmorphism para SprintHub
const customSwal = Swal.mixin({
  background: '#0f1115',
  color: '#e2e8f0',
  customClass: {
    popup: 'glass-popup',
    title: 'glass-title',
    htmlContainer: 'glass-html',
    confirmButton: 'btn-primary glass-btn',
    cancelButton: 'btn-secondary glass-btn',
  },
  buttonsStyling: false,
});

export const showAlert = {
  success: (title: string, text?: string) => {
    return customSwal.fire({
      icon: 'success',
      title,
      text,
      iconColor: '#10b981', // Verde futurista
      confirmButtonText: 'Aceptar',
    });
  },
  error: (title: string, text?: string) => {
    return customSwal.fire({
      icon: 'error',
      title,
      text,
      iconColor: '#ef4444', // Rojo
      confirmButtonText: 'Entendido',
    });
  },
  confirm: (title: string, text?: string, confirmText = 'Confirmar', cancelText = 'Cancelar') => {
    return customSwal.fire({
      icon: 'warning',
      title,
      text,
      iconColor: '#f59e0b',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
    });
  }
};
