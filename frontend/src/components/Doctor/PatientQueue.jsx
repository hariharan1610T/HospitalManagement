import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import { apiFetch } from '../../lib/api';

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

function NotesModal({ appointment, onClose, onSave }) {
  const [notes, setNotes] = useState(appointment.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSave(appointment.id, notes);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Consultation Notes for {appointment.patients?.users?.full_name}
        </h3>
        <textarea
          rows="6"
          className="w-full rounded-md border border-gray-300 p-2"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Enter diagnosis, prescription, and follow-up advice."
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Notes & Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientQueue() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchQueue = useCallback(async () => {
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User not logged in.');

      const data = await apiFetch('/api/appointments/doctor', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchQueue);
  }, [fetchQueue]);

  const handleSaveNotes = async (appointmentId, notes) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('User not logged in.');

      await apiFetch(`/api/appointments/${appointmentId}/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ notes }),
      });

      fetchQueue();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading your schedule...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="mt-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-semibold text-gray-900">Patient Queue</h3>

      {appointments.length === 0 ? (
        <p className="text-gray-500">You have no upcoming appointments scheduled.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Token</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {formatDate(appointment.appointment_date)}
                    <br />
                    <span className="text-blue-600">{appointment.slot_time?.slice(0, 5)}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {appointment.patients?.users?.full_name}
                    <br />
                    <span className="text-xs text-gray-500">{appointment.patients?.users?.phone}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    #{appointment.token_number || '-'}
                  </td>
                  <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">{appointment.reason}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => setSelectedAppointment(appointment)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {appointment.status === 'completed' ? 'View Notes' : 'Add Notes'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAppointment && (
        <NotesModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSave={handleSaveNotes}
        />
      )}
    </div>
  );
}
