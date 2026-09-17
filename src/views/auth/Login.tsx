import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/sprintHubServices';
import { useAuthStore } from '../../store/useAuthStore';
import { OTPInput } from '../../components/OTPInput';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // OTP flow states
  const [showOtp, setShowOtp] = useState(false);
  const [tempAuthData, setTempAuthData] = useState<{user: any, token: string} | null>(null);

  const login = useAuthStore((state: any) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser({ email, password });
      setTempAuthData({ user: data.user, token: data.token });
      setShowOtp(true);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errorMsgs = Object.values(err.response.data.errors)
          .map((e: any) => e?._errors?.join(', '))
          .filter(Boolean)
          .join(' | ');
        setError(errorMsgs || err.response.data.message);
      } else {
        setError(err.response?.data?.message || 'Error al iniciar sesión');
      }
    }
  };

  const handleOtpSuccess = () => {
    if (tempAuthData) {
      login(tempAuthData.user, tempAuthData.token);
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      {/* Animated Kanban Background */}
      <div className="kanban-bg-animation">
        <div className="kb-col">
          <div className="kb-card"></div>
          <div className="kb-card"></div>
        </div>
        <div className="kb-col">
          <div className="kb-card"></div>
          <div className="kb-card"></div>
          <div className="kb-card"></div>
        </div>
        <div className="kb-col">
          <div className="kb-card"></div>
        </div>
      </div>

      <div className="auth-card">
        <h2>{showOtp ? 'Verificación de Seguridad' : 'Iniciar Sesión'}</h2>
        {error && <p className="auth-error">{error}</p>}
        
        {!showOtp ? (
          <>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="auth-button">Entrar</button>
            </form>
            <p className="auth-footer">
              ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
          </>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <OTPInput onSuccess={handleOtpSuccess} />
            <button 
              type="button" 
              onClick={() => setShowOtp(false)} 
              style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', marginTop: '15px', width: '100%', fontSize: '0.9rem' }}
            >
              Volver a iniciar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
