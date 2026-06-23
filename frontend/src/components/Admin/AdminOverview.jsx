import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { Users, Stethoscope, Calendar } from 'lucide-react';
import PatientList from './PatientList';
import DoctorList from './DoctorList';
import AppointmentList from './AppointmentList';

function MetricCard({ icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center">
      <div className={`p-3 rounded-full mr-4 ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const [metrics, setMetrics] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await apiFetch('/api/admin/metrics');
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (error) return <p className="text-red-500 p-4">Error loading metrics: {error}</p>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Hospital Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          icon={<Users className="w-8 h-8" />}
          label="Total Patients"
          value={loading ? '...' : metrics.patients}
          color="blue"
        />
        <MetricCard 
          icon={<Stethoscope className="w-8 h-8" />}
          label="Total Doctors"
          value={loading ? '...' : metrics.doctors}
          color="green"
        />
        <MetricCard 
          icon={<Calendar className="w-8 h-8" />}
          label="Total Appointments"
          value={loading ? '...' : metrics.appointments}
          color="purple"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <DoctorList />
        </div>
        <div className="lg:col-span-1">
          <PatientList />
        </div>
        <div className="lg:col-span-2">
          <AppointmentList />
        </div>
      </div>
    </div>
  );
}