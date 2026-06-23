import { useState } from 'react';
import { supabase } from '../../config/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../../lib/api';
import { useI18n } from '../../hooks/useI18n';

const DOCTOR_SPECIALIZATIONS = [
  'General Medicine',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Gynecology',
  'Ophthalmology',
];

export default function Register() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          phone: role === 'patient' ? phone : undefined,
          role,
          specialization: role === 'doctor' ? specialization : undefined,
        }),
      });

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t('register.heading')}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleRegister}>
            {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}

            <div className="flex justify-center space-x-4 mb-6">
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-blue-600" value="patient" checked={role === 'patient'} onChange={(e) => setRole(e.target.value)} />
                <span className="ml-2">{t('register.patient')}</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-blue-600" value="doctor" checked={role === 'doctor'} onChange={(e) => setRole(e.target.value)} />
                <span className="ml-2">{t('register.doctor')}</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('register.fullName')}</label>
              <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('register.email')}</label>
              <input type="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('register.password')}</label>
              <input type="password" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {role === 'patient' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('register.phone')}</label>
                <input type="tel" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            )}

            {role === 'doctor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('register.specialization')}</label>
                <select
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="" disabled>{t('register.selectSpecialization')}</option>
                  {DOCTOR_SPECIALIZATIONS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {loading ? t('register.creating') : t('register.signUp')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">{t('register.haveAccount')} </span>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">{t('register.login')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
