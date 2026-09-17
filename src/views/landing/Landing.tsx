import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-container">
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">SprintHub</div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Iniciar sesión</Link>
          <Link to="/register" className="nav-btn">Comenzar gratis</Link>
        </div>
      </nav>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title " style={{ animationDelay: '0.1s' }}>
              Gestión de proyectos, <br/>
              <span className="gradient-text">reimaginada.</span>
            </h1>
            <p className="hero-subtitle " style={{ animationDelay: '0.3s' }}>
              SprintHub trae el diseño minimalista y la fluidez de Apple a tu entorno de trabajo ágil. 
              Organiza tus ideas, colabora sin fricción y entrega resultados más rápido.
            </p>
            <div className="hero-actions " style={{ animationDelay: '0.5s' }}>
              <Link to="/register" className="btn-primary-large">Empieza ahora</Link>
              <Link to="/login" className="btn-secondary-large">Explorar</Link>
            </div>
          </div>
          
          <div className="hero-image-wrapper " style={{ animationDelay: '0.7s' }}>
            <div className="glass-panel mockup-panel">
              <div className="mockup-header">
                <span className="dot bg-red"></span>
                <span className="dot bg-yellow"></span>
                <span className="dot bg-green"></span>
              </div>
              <div className="mockup-body">
                <div className="mockup-sidebar">
                  <div className="mockup-side-item pulse-item"></div>
                  <div className="mockup-side-item pulse-item" style={{ width: '70%' }}></div>
                  <div className="mockup-side-item pulse-item" style={{ width: '50%' }}></div>
                </div>
                <div className="mockup-content">
                  <div className="mockup-header-bar">
                    <div className="mockup-title">SprintHub Project</div>
                  </div>
                  <div className="mockup-kanban">
                    <div className="m-column">
                      <div className="m-col-header">Por hacer</div>
                      <div className="m-task-card float-anim">
                        <div className="m-task-tag bg-blue">UX/UI</div>
                        <div className="m-task-title">Diseñar Landing Page</div>
                        <div className="m-task-footer"><div className="m-avatar bg-pink">E</div></div>
                      </div>
                      <div className="m-task-card float-anim" style={{ animationDelay: '0.5s' }}>
                        <div className="m-task-tag bg-purple">Backend</div>
                        <div className="m-task-title">Crear modelo Audit</div>
                        <div className="m-task-footer"><div className="m-avatar bg-blue">J</div></div>
                      </div>
                    </div>
                    <div className="m-column" style={{ animationDelay: '0.2s' }}>
                      <div className="m-col-header">En progreso</div>
                      <div className="m-task-card float-anim" style={{ animationDelay: '0.2s' }}>
                        <div className="m-task-tag bg-yellow">Animación</div>
                        <div className="m-task-title">Efecto tablero Login</div>
                        <div className="m-task-footer"><div className="m-avatar bg-pink">E</div></div>
                      </div>
                    </div>
                    <div className="m-column" style={{ animationDelay: '0.4s' }}>
                      <div className="m-col-header">Finalizado</div>
                      <div className="m-task-card float-anim" style={{ animationDelay: '0.7s' }}>
                        <div className="m-task-tag bg-green">Core</div>
                        <div className="m-task-title">Filtros de tarjetas</div>
                        <div className="m-task-footer"><div className="m-avatar bg-blue">J</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Minimalismo funcional</h2>
          <div className="features-grid">
            <div className="feature-card glass-panel">
              <div className="feature-icon">✨</div>
              <h3>Diseño Elegante</h3>
              <p>Inspirado en la simplicidad de Apple. Sin distracciones, solo lo que necesitas para trabajar.</p>
            </div>
            <div className="feature-card glass-panel">
              <div className="feature-icon">🚀</div>
              <h3>Flujos Ágiles</h3>
              <p>Mueve tarjetas con fluidez. Kanban hiper optimizado para que nada detenga a tu equipo.</p>
            </div>
            <div className="feature-card glass-panel">
              <div className="feature-icon">🤝</div>
              <h3>Colaboración</h3>
              <p>Comenta, asigna y avanza. Mantén a tu equipo sincronizado en tiempo real.</p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2 className="section-title">Creadores</h2>
          <div className="team-grid">
            <div className="team-member glass-panel ">
              <div className="member-avatar bg-blue">J</div>
              <h3 className="member-name">Jhon Ovallos</h3>
              <p className="member-role">Fullstack Developer</p>
            </div>
            <div className="team-member glass-panel " style={{ animationDelay: '0.2s' }}>
              <div className="member-avatar bg-pink">E</div>
              <h3 className="member-name">Eduar Zorro</h3>
              <p className="member-role">Fullstack Developer</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
