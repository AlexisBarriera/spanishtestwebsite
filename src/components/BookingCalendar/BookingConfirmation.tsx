
import React from 'react';
import { Booking } from './BookingCalendar';
import './BookingConfirmation.css';

interface BookingConfirmationProps {
  booking: Booking;
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onClose }) => {
  const formatDate = (dateStr: string) => {
    // Parse the date string and ensure it's treated as local date (Puerto Rico timezone)
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="confirmation-overlay" onClick={onClose}>
      <div className="confirmation-modal" onClick={e => e.stopPropagation()}>
        <div className="confirmation-header">
          <div className="success-icon">✅</div>
          <h2>¡Reserva Confirmada!</h2>
          <p>Tu cita ha sido programada exitosamente</p>
        </div>

        <div className="confirmation-details">
          <div className="detail-row">
            <span className="detail-label">Fecha:</span>
            <span className="detail-value">{formatDate(booking.date)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Hora:</span>
            <span className="detail-value">{booking.time}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Servicio:</span>
            <span className="detail-value">{booking.service}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">ID de Reserva:</span>
            <span className="detail-value">{booking.id}</span>
          </div>
        </div>

        <div className="confirmation-notifications">
          <h3>¿Qué sigue después?</h3>
          <ul>
            <li>
              <span className="check">✓</span>
              <div>
                <strong>Confirmación por Correo</strong>
                <p>Recibirás un correo de confirmación en {booking.email}</p>
              </div>
            </li>
            <li>
              <span className="check">✓</span>
              <div>
                <strong>Sincronización de Calendario</strong>
                <p>Se ha notificado a nuestro equipo y la cita se agregó a nuestro calendario</p>
              </div>
            </li>
            <li>
              <span className="check">✓</span>
              <div>
                <strong>Recordatorio</strong>
                <p>Recibirás un recordatorio 24 horas antes de tu cita</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="confirmation-actions">
          <button className="btn-add-calendar">
            📅 Agregar a Mi Calendario
          </button>
          <button className="btn-done" onClick={onClose}>
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
