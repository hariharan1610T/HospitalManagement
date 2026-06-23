import { useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import { apiFetch } from '../../lib/api';
import { formatNotificationSummary } from './notificationUtils';

const HOURLY_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
];

export default function BookAppointment({ onBooked }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await apiFetch('/api/doctors');
        setDoctors(data);
      } catch (err) {
        setMessage(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBooking = async (event) => {
    event.preventDefault();
    setSubmitLoading(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to book an appointment.');

      const result = await apiFetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          doctor_id: doctorId,
          appointment_date: date,
          slot_time: time,
          reason: symptoms,
        }),
      });

      const notificationSummary = formatNotificationSummary(result.notifications);
      setMessage(`Appointment booked successfully. ${notificationSummary}`);
      setDoctorId('');
      setDate('');
      setTime('');
      setSymptoms('');
      onBooked?.();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading available doctors...</div>;

  return (
    <div className="mt-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-semibold text-gray-900">Book a New Appointment</h3>

      {message && (
        <div className={`mb-4 rounded p-3 ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
          <select
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            value={doctorId}
            onChange={(event) => setDoctorId(event.target.value)}
          >
            <option value="" disabled>Choose a doctor...</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.full_name} ({doctor.specialization || doctor.departments?.name || 'General'})
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time (1-hour slots)</label>
            <select
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            >
              <option value="" disabled>Select a time...</option>
              {HOURLY_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Symptoms / Reason for Visit</label>
          <textarea
            rows="3"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            value={symptoms}
            onChange={(event) => setSymptoms(event.target.value)}
            placeholder="Briefly describe the reason for this visit."
          />
        </div>

        <button
          type="submit"
          disabled={submitLoading || doctors.length === 0}
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {submitLoading ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  );
}
