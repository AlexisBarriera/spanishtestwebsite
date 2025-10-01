
import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-banner">
        <div className="banner-content">
          <p className="banner-tagline">Excelencia en Gestión Financiera</p>
          <h1 className="banner-title">Servicios Profesionales de Contabilidad</h1>
          <div className="banner-divider"></div>
        </div>
      </div>
      
      <div className="hero-content">
        <div className="hero-text">
          <h2 className="hero-subtitle">Experiencia Financiera de Confianza</h2>
          <h1 className="hero-title">
            Tu Socio en el<br/>
            <span className="hero-accent">Éxito Financiero</span>
          </h1>
          <p className="hero-description">
            Con más de [X] años de experiencia, ofrecemos soluciones contables integrales
            adaptadas para satisfacer tus necesidades financieras únicas. Nuestro compromiso con la excelencia y
            atención al detalle garantiza tu completa tranquilidad.
          </p>
          <div className="hero-cta">
            <button onClick={() => navigateToSection('contact')} className="btn-primary">Programar Consulta</button>
            <button className="btn-secondary">Saber Más</button>
          </div>
        </div>
        
        <div className="hero-features">
          <div className="feature-card">
            <span className="feature-icon">▪</span>
            <h3>[Área de Servicio 1]</h3>
            <p>Experiencia profesional en gestión financiera integral</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">▪</span>
            <h3>[Área de Servicio 2]</h3>
            <p>Planificación estratégica para el crecimiento empresarial sostenible</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">▪</span>
            <h3>[Área de Servicio 3]</h3>
            <p>Soluciones personalizadas para tus necesidades únicas</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
