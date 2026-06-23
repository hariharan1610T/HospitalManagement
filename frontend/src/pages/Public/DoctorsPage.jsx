import { useEffect, useState } from 'react';
import PublicLayout from '../../components/PublicLayout';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useI18n } from '../../hooks/useI18n';
import { apiFetch } from '../../lib/api';

const FALLBACK_DOCTORS = [
  { id: 'demo-1', full_name: 'Asha Mehta', specialization: 'Cardiology', department: 'Cardiology' },
  { id: 'demo-2', full_name: 'Rohan Iyer', specialization: 'Orthopedics', department: 'Orthopedics' },
  { id: 'demo-3', full_name: 'Neha Rao', specialization: 'Pediatrics', department: 'Pediatrics' },
  { id: 'demo-4', full_name: 'Arun Kumar', specialization: 'Neurology', department: 'Neurology' },
  { id: 'demo-5', full_name: 'Priya Sharma', specialization: 'Dermatology', department: 'Dermatology' },
  { id: 'demo-6', full_name: 'Vikram Singh', specialization: 'General Medicine', department: 'General Medicine' },
];

export default function DoctorsPage() {
  const { t } = useI18n();
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');

  usePageMeta('Doctors | CareOps Cloud', 'Browse doctors available for appointments in CareOps Cloud.');

  useEffect(() => {
    apiFetch('/api/doctors')
      .then(setDoctors)
      .catch((err) => setError(err.message));
  }, []);

  const list = doctors.length ? doctors : FALLBACK_DOCTORS;

  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">{t('doctors.badge')}</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-950">{t('doctors.heading')}</h1>
          <p className="mt-4 text-gray-600">{t('doctors.subheading')}</p>
        </div>

        {error && (
          <div className="mb-6 rounded bg-red-50 p-4 text-red-700">
            {t('doctors.error')}: {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((doctor) => (
            <article
              key={doctor.id}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700 mx-auto">
                {doctor.full_name?.charAt(0) || 'D'}
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold text-gray-950">Dr. {doctor.full_name}</h2>
                <p className="mt-1 font-medium text-blue-700">
                  {doctor.specialization || doctor.department || 'General Physician'}
                </p>
                <p className="mt-3 text-sm text-gray-500">
                  {doctor.department || doctor.specialization || 'General Medicine'}
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}
