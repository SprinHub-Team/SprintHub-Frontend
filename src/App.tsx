import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { useSocket } from './hooks/useSocket'; // Mantenemos el test de socket si queremos
import './App.css';

function App() {
  // Inicializamos el socket globalmente (opcional)
  useSocket();

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
