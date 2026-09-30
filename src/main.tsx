import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/globals.css';
import { App } from './app/App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('No se encontró el contenedor #root para montar la aplicación');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
