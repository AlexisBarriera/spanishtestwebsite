
import React, { useState, useEffect } from 'react';
import './BookingCalendar.css';
import CalendarView from './CalendarView';
import TimeSlotPicker from './TimeSlotPicker';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';
import { persistence } from '../../utils/persistence';

export interface Booking {
  id: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  notes: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  eventId?: string;
  isExternal?: boolean;
}

const BookingCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [externalBookings, setExternalBookings] = useState<Booking[]>([]);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);

  useEffect(() => {
    loadBookings();
    loadExternalBookings();
  }, []);

  useEffect(() => {
    // Reload external bookings when date changes to get current availability
    if (selectedDate) {
      loadExternalBookings();
    }
  }, [selectedDate]);

  const loadBookings = async () => {
    try {
      const stored = await persistence.getItem('bookings');
      if (stored) {
        setBookings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  const loadExternalBookings = async () => {
    setIsLoadingExternal(true);
    try {
      // Get current month date range for external bookings
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const response = await fetch(`/api/calendar-events?startDate=${startOfMonth}&endDate=${endOfMonth}`);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setExternalBookings(data.bookings);
        }
      } else {
        console.error('Failed to load external bookings');
      }
    } catch (error) {
      console.error('Error loading external bookings:', error);
    } finally {
      setIsLoadingExternal(false);
    }
  };
  
  const saveBookings = async (newBookings: Booking[]) => {
    try {
      await persistence.setItem('bookings', JSON.stringify(newBookings));
      setBookings(newBookings);
    } catch (error) {
      console.error('Failed to save bookings:', error);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookingSubmit = async (formData: any) => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);

    const booking: Booking = {
      id: `BK${Date.now()}`,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      notes: formData.notes,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    try {
      // Send to calendar API
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ booking }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync with calendar');
      }

      // Save locally
      const updatedBookings = [...bookings, booking];
      await saveBookings(updatedBookings);
      setConfirmedBooking(booking);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Hubo un error procesando tu reserva. Por favor intenta de nuevo o contáctanos directamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingCancel = () => {
    setSelectedTime('');
  };

  const handleConfirmationClose = () => {
    setConfirmedBooking(null);
    setSelectedDate(null);
    setSelectedTime('');
  };

  const dateStr = selectedDate?.toLocaleDateString('es-ES', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section id="booking" className="booking-calendar">
      <div className="booking-container">
        <div className="booking-header">
          <p className="booking-tagline">Programa una Cita</p>
          <h2 className="booking-title">Reserva Tu Consulta</h2>
          <p className="booking-subtitle">
            Elige una fecha y hora conveniente para tu cita. Recibirás confirmación instantánea
            por correo electrónico y la cita se sincronizará automáticamente con nuestro calendario.
          </p>
        </div>

        <div className="booking-content">
          <div className="calendar-section">
            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              bookings={bookings}
            />
            {selectedDate && (
              <div className="booking-info">
                <h3>Fecha Seleccionada</h3>
                <p>{dateStr}</p>
              </div>
            )}
          </div>

          <div className="selection-section">
            {!selectedDate && (
              <div className="selection-placeholder">
                <span className="placeholder-icon">📅</span>
                <h3>Selecciona una Fecha</h3>
                <p>Elige una fecha disponible del calendario para ver los horarios</p>
              </div>
            )}
            
            {selectedDate && !selectedTime && (
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
                bookings={[...bookings, ...externalBookings]}
              />
            )}

            {selectedDate && selectedTime && (
              <BookingForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSubmit={handleBookingSubmit}
                onCancel={handleBookingCancel}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>

      {confirmedBooking && (
        <BookingConfirmation
          booking={confirmedBooking}
          onClose={handleConfirmationClose}
        />
      )}
    </section>
  );
};

export default BookingCalendar;
