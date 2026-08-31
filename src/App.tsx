import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { useSocket } from './hooks/useSocket'; // Mantenemos el test de socket si queremos
import { useInactivityTimeout } from './hooks/useInactivityTimeout';
import './App.css';

function App() {
  // Inicializamos el socket globalmente (opcional)
  useSocket();
  // Cierre de sesión automático tras 30 min sin actividad
  useInactivityTimeout();

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
