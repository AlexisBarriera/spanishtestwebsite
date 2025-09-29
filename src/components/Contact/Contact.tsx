
import React, { useState } from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico es inválido';
    }
    if (!formData.message.trim()) newErrors.message = 'El mensaje es obligatorio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar el mensaje');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="section-header">
          <p className="section-tagline">Contáctanos</p>
          <h2 className="section-title">Hablemos de Tus Metas Financieras</h2>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <h3>Información de Contacto</h3>
            <p className="contact-intro">
              Estamos aquí para ayudarte a alcanzar el éxito financiero. Contáctanos para programar
              una consulta o para obtener más información sobre nuestros servicios.
            </p>
            
            <div className="info-items">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <h4>Ubicación de la Oficina</h4>
                  <p>[Tu Dirección]<br/>[Ciudad, Estado ZIP]</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <h4>Número de Teléfono</h4>
                  <p>[Número de Teléfono]</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-icon">✉️</span>
                <div>
                  <h4>Correo Electrónico</h4>
                  <p>alexisbarriera72@gmail.com</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-icon">🕒</span>
                <div>
                  <h4>Horario de Atención</h4>
                  <p>Lunes - Viernes: 9:00 AM - 6:00 PM<br/>
                     Sábado: Con Cita Previa</p>
                </div>
              </div>
            </div>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitStatus === 'success' && (
              <div className="form-message success">
                <span className="message-icon">✅</span>
                <div>
                  <strong>¡Mensaje Enviado Exitosamente!</strong>
                  <p>Gracias por contactarnos. Te responderemos dentro de 24 horas.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="form-message error">
                <span className="message-icon">❌</span>
                <div>
                  <strong>Error al Enviar el Mensaje</strong>
                  <p>Por favor intenta de nuevo o contáctanos directamente por teléfono o correo electrónico.</p>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nombre Completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Juan Pérez"
                  disabled={isSubmitting}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="juan@ejemplo.com"
                  disabled={isSubmitting}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Número de Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(787) 123-4567"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="service">Servicio de Interés</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">Selecciona un servicio</option>
                  <option value="tax-preparation">Preparación de Impuestos</option>
                  <option value="bookkeeping">Contabilidad</option>
                  <option value="financial-planning">Planificación Financiera</option>
                  <option value="business-consulting">Consultoría Empresarial</option>
                  <option value="audit-services">Servicios de Auditoría</option>
                  <option value="payroll-services">Servicios de Nómina</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Mensaje *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Cuéntanos sobre tus necesidades contables..."
                disabled={isSubmitting}
                className={errors.message ? 'error' : ''}
              />
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
