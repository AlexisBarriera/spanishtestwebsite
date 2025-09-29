
import React, { useState } from 'react';
import './BookingForm.css';

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  selectedDate, 
  selectedTime, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    notes: ''
  });

  const [errors, setErrors] = useState<any>({});

  const services = [
    'Preparación de Impuestos',
    'Contabilidad',
    'Planificación Financiera',
    'Consultoría Empresarial',
    'Servicios de Auditoría',
    'Servicios de Nómina',
    'Otro'
  ];

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
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo es inválido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    if (!formData.service) newErrors.service = 'Por favor selecciona un servicio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="booking-form">
      <div className="form-header">
        <h3>Completa Tu Reserva</h3>
        <div className="booking-details">
          <p className="detail-item">
            <span className="detail-icon">📅</span>
            {selectedDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="detail-item">
            <span className="detail-icon">🕐</span>
            {selectedTime}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre Completo *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ingresa tu nombre completo"
            className={errors.name ? 'error' : ''}
            disabled={isSubmitting}
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
            placeholder="tu@correo.com"
            className={errors.email ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Número de Teléfono *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(787) 123-4567"
            className={errors.phone ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="service">Servicio Requerido *</label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={errors.service ? 'error' : ''}
            disabled={isSubmitting}
          >
            <option value="">Selecciona un servicio</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          {errors.service && <span className="error-message">{errors.service}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notas Adicionales (Opcional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Requisitos específicos o preguntas..."
            disabled={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-confirm"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
          </button>
        </div>
      </form>

      <div className="form-notice">
        <p>
          <strong>📧 Notificaciones Automáticas:</strong> Al confirmar, recibirás un correo 
          con todos los detalles de la cita, y la cita se agregará automáticamente a nuestro calendario.
        </p>
      </div>
    </div>
  );
};

export default BookingForm;
