import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BookAppointment from '../../components/Patient/BookAppointment';
import PatientQueue from '../../components/Doctor/PatientQueue';
import AdminOverview from '../../components/Admin/AdminOverview';
import AppointmentHistory from '../../components/Patient/AppointmentHistory';
import NotificationInbox from '../../components/Patient/NotificationInbox';

export default function DashboardHub() {
  const { user, role, profileError, loading } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CareOps Cloud</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Logged in as: <span className="font-semibold uppercase text-gray-900">{user?.full_name || role || 'Loading...'}</span>
          </span>
          <button 
            onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-8">
        {/* PATIENT VIEW */}
        {role === 'patient' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Patient Dashboard</h2>
            <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500 mb-6">
              <p className="text-gray-700">Welcome{user?.email ? `, ${user.email}` : ''}. You can book appointments and view your history here.</p>
            </div>
            
            <BookAppointment onBooked={() => setRefreshKey((value) => value + 1)} />
            <AppointmentHistory refreshKey={refreshKey} />
            <NotificationInbox refreshKey={refreshKey} />
          </div>
        )}

        {/* DOCTOR VIEW */}
        {role === 'doctor' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Doctor Dashboard</h2>
            <div className="bg-white p-6 rounded shadow border-l-4 border-green-500 mb-6">
              <p className="text-gray-700">Welcome, Doctor. Your upcoming consultations will appear here.</p>
            </div>
            
            <PatientQueue />
          </div>
        )}

        {/* ADMIN VIEW */}
        {role === 'admin' && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Control Center</h2>
            <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500 mb-6">
              <p className="text-gray-700">System overview and hospital metrics.</p>
            </div>
            
            <AdminOverview />
          </div>
        )}

        {!loading && !role && profileError && (
          <div className="mx-auto max-w-2xl rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900">
            <h2 className="text-xl font-semibold">Profile role is missing</h2>
            <p className="mt-2">{profileError}</p>
            <p className="mt-4 text-sm">
              Register through this app, or contact support to assign a patient, doctor, or admin role for your account.
            </p>
            <button
              onClick={handleLogout}
              className="mt-5 rounded bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
            >
              Log out
            </button>
          </div>
        )}

        {loading && !role && (
          <div className="flex h-64 items-center justify-center text-gray-500">
            Loading your profile...
          </div>
        )}
      </main>
    </div>
  );
}
