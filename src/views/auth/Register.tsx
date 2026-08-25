import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../services/sprintHubServices';
import './Auth.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    documentId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Registro</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Documento de Identidad</label>
            <input type="text" name="documentId" value={formData.documentId} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
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
