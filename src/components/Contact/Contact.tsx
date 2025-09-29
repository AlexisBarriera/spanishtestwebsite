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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
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
        throw new Error(result.error || 'Failed to send message');
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
          <p className="section-tagline">Encuesta de contacto</p>
          <h2 className="section-title">Contáctenos para hablar sobre sus finanzas</h2>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <h3>Información adicional</h3>
            <p className="contact-intro">
             Estamos aquí para ayudarle a alcanzar el éxito financiero. Contáctenos para programar una consulta o para conocer más sobre nuestros servicios.
            </p>
            
            <div className="info-items">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <h4>Localización de oficina</h4>
                  <p>29 C. Cristina<br/>Ponce, Puerto Rico 00730</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-icon">📞</span>
                <div>
                  <h4>Número de teléfono</h4>
                  <p>+1 (939) 608-3732</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-icon">✉️</span>
                <div>
                  <h4>Email:</h4>
                  <p>shaddaietp@gmail.com</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="info-icon">🕒</span>
                <div>
                  <h4>Horas de oficina:</h4>
                  <p>Lunes - Viernes: 8:30 AM - 5:00 PM<br/>
                     Sábado (PHP solo): 10:00 AM - 1:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitStatus === 'success' && (
              <div className="form-message success">
                <span className="message-icon">✅</span>
                <div>
                  <strong>Mensaje fue enviado sucesivamente!</strong>
                  <p>Gracias por contactarnos. Nos pondremos en contacto con usted lo antes posible.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="form-message error">
                <span className="message-icon">❌</span>
                <div>
                  <strong>Mensaje no pudo ser enviado</strong>
                  <p>Por favor, intente de nuevo o contáctenos directamente por teléfono o correo electrónico.</p>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nombre completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nombre & Apellido"
                  disabled={isSubmitting}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@example.com"
                  disabled={isSubmitting}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Número de teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="service">Servicio de interés</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">Seleccione un servicio</option>
                  <option value="tax-preparation">Preparación de impuestos</option>
                  <option value="bookkeeping">Contabilidad</option>
                  <option value="financial-planning">Planificación financiera</option>
                  <option value="business-consulting">Consultoría empresarial</option>
                  <option value="audit-services">Servicios de auditoría</option>
                  <option value="payroll-services">Servicios de nómina</option>
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
                placeholder="Cuéntenos sobre sus necesidades contables"
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
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
