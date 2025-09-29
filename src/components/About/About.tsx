
import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="section-header">
          <p className="section-tagline">Sobre Nosotros</p>
          <h2 className="section-title">Dedicados a Tu Excelencia Financiera</h2>
        </div>
        
        <div className="about-content">
          <div className="about-text">
            <h3>Tu Profesional de Contabilidad de Confianza</h3>
            <p>
              [Nombre Profesional] aporta [X] años de experiencia en servicios contables integrales.
              Con un profundo entendimiento de las regulaciones financieras y un compromiso con el servicio personalizado,
              ayudamos a individuos y empresas a navegar paisajes financieros complejos con confianza.
            </p>
            <p>
              Nuestro enfoque combina principios contables tradicionales con tecnología moderna para ofrecer
              soluciones financieras eficientes, precisas y oportunas. Creemos en construir relaciones a largo
              plazo basadas en la confianza, integridad y servicio excepcional.
            </p>
            
            <div className="credentials">
              <div className="credential-item">
                <span className="credential-icon">✓</span>
                <div>
                  <h4>[Certificación 1]</h4>
                  <p>Detalles de certificación profesional</p>
                </div>
              </div>
              <div className="credential-item">
                <span className="credential-icon">✓</span>
                <div>
                  <h4>[Certificación 2]</h4>
                  <p>Detalles de certificación profesional</p>
                </div>
              </div>
              <div className="credential-item">
                <span className="credential-icon">✓</span>
                <div>
                  <h4>[Años] de Experiencia</h4>
                  <p>Historial comprobado de éxito</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-values">
            <h3>Nuestros Valores Fundamentales</h3>
            <div className="values-grid">
              <div className="value-card">
                <h4>Integridad</h4>
                <p>Manteniendo los más altos estándares éticos en todos nuestros servicios</p>
              </div>
              <div className="value-card">
                <h4>Excelencia</h4>
                <p>Entregando calidad superior en cada aspecto de nuestro trabajo</p>
              </div>
              <div className="value-card">
                <h4>Confianza</h4>
                <p>Construyendo relaciones duraderas a través del servicio confiable</p>
              </div>
              <div className="value-card">
                <h4>Innovación</h4>
                <p>Adoptando soluciones modernas para mejores resultados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
