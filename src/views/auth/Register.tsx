import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/sprintHubServices';
import { useAuthStore } from '../../store/useAuthStore';
import './Auth.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state: any) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await registerUser({ name, email, documentId, password });
      login(data.user, data.token);
      navigate('/dashboard'); 
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const errorMsgs = Object.values(err.response.data.errors)
          .map((e: any) => e?._errors?.join(', '))
          .filter(Boolean)
          .join(' | ');
        setError(errorMsgs || err.response.data.message);
      } else {
        setError(err.response?.data?.message || 'Error al registrarse');
      }
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
        <h2>Registro</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nombre Completo</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Documento de Identidad</label>
            <input type="text" value={documentId} onChange={(e) => setDocumentId(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-button">Registrarme</button>
        </form>
        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
