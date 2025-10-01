
import React from 'react';
import './Services.css';

const Services: React.FC = () => {
  const services = [
    {
      title: '[Categoría de Servicio 1]',
      description: 'Servicios integrales de gestión y reporte financiero adaptados a tus necesidades',
      features: ['Característica 1', 'Característica 2', 'Característica 3', 'Característica 4']
    },
    {
      title: '[Categoría de Servicio 2]',
      description: 'Planificación estratégica y consultoría para el rendimiento financiero óptimo',
      features: ['Característica 1', 'Característica 2', 'Característica 3', 'Característica 4']
    },
    {
      title: '[Categoría de Servicio 3]',
      description: 'Servicios especializados para requisitos financieros complejos',
      features: ['Característica 1', 'Característica 2', 'Característica 3', 'Característica 4']
    }
  ];

  return (
    <section id="services" className="services">
      <div className="services-container">
        <div className="section-header">
          <p className="section-tagline">Nuestros Servicios</p>
          <h2 className="section-title">Soluciones Financieras Integrales</h2>
          <p className="section-description">
            Ofrecemos una gama completa de servicios contables diseñados para satisfacer tus necesidades únicas
            y ayudarte a alcanzar tus metas financieras.
          </p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-number">0{index + 1}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              
              <ul className="service-features">
                {service.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="feature-bullet">▪</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="service-btn">Saber Más</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
