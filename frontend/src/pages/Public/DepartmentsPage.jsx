import { useEffect, useState } from 'react';
import PublicLayout from '../../components/PublicLayout';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useI18n } from '../../hooks/useI18n';
import { apiFetch } from '../../lib/api';

const DEPARTMENT_KEYS = [
  { nameKey: 'departments.generalMedicine', descKey: 'departments.generalMedicineDesc' },
  { nameKey: 'departments.cardiology', descKey: 'departments.cardiologyDesc' },
  { nameKey: 'departments.neurology', descKey: 'departments.neurologyDesc' },
  { nameKey: 'departments.orthopedics', descKey: 'departments.orthopedicsDesc' },
  { nameKey: 'departments.pediatrics', descKey: 'departments.pediatricsDesc' },
  { nameKey: 'departments.dermatology', descKey: 'departments.dermatologyDesc' },
  { nameKey: 'departments.gynecology', descKey: 'departments.gynecologyDesc' },
  { nameKey: 'departments.ophthalmology', descKey: 'departments.ophthalmologyDesc' },
  { nameKey: 'departments.gastroenterology', descKey: 'departments.gastroenterologyDesc' },
  { nameKey: 'departments.pulmonology', descKey: 'departments.pulmonologyDesc' },
  { nameKey: 'departments.nephrology', descKey: 'departments.nephrologyDesc' },
  { nameKey: 'departments.endocrinology', descKey: 'departments.endocrinologyDesc' },
];

export default function DepartmentsPage() {
  const { t } = useI18n();
  usePageMeta('Departments | CareOps Cloud', 'Browse hospital departments and specialists for appointment booking.');

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/departments')
      .then((data) => setDepartments(data))
      .catch((err) => setError(err.message));
  }, []);

  const hasData = departments.length > 0;

  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">{t('departments.badge')}</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-950">{t('departments.heading')}</h1>
          <p className="mt-4 text-gray-600">{t('departments.subheading')}</p>
        </div>

        {error && (
          <div className="mb-6 rounded bg-red-50 p-4 text-red-700">
            {t('departments.error')}: {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(hasData ? departments : DEPARTMENT_KEYS).map((item) => {
            const name = hasData ? item.name : t(item.nameKey);
            const desc = hasData ? item.description : t(item.descKey);
            return (
              <article
                key={hasData ? item.id || item.name : item.nameKey}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 font-bold text-blue-700">
                    {name.charAt(0)}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-950">{name}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">{desc}</p>
              </article>
            );
          })}
        </div>
      </main>
    </PublicLayout>
  );
}
