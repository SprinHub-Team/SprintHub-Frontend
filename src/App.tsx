import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { useSocket } from './hooks/useSocket'; 
import { useInactivityTimeout } from './hooks/useInactivityTimeout';
import { useAuthStore } from './store/useAuthStore';
import { getUserProfile } from './services/sprintHubServices';
import './App.css';

function App() {
  useSocket();
  useInactivityTimeout();
  
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    if (token) {
      getUserProfile().catch(() => {
        // Interceptor clears session if 401 or 404
      });
    }
  }, [token]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
export default App;
