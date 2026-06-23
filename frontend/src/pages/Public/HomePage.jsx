import { Link } from 'react-router-dom';
import {
  Activity,
  Ambulance,
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Stethoscope,
  UserSearch,
} from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useI18n } from '../../hooks/useI18n';

const capabilities = [
  ['home.modulePatientPortal', CalendarCheck, 'home.modulePatientPortalDesc'],
  ['home.moduleDoctorPortal', Stethoscope, 'home.moduleDoctorPortalDesc'],
  ['home.moduleAdminDashboard', LayoutDashboard, 'home.moduleAdminDashboardDesc'],
  ['home.moduleNotifications', MessageCircle, 'home.moduleNotificationsDesc'],
  ['home.moduleEMR', ClipboardList, 'home.moduleEMRDesc'],
  ['home.moduleSecurity', ShieldCheck, 'home.moduleSecurityDesc'],
];

const quickLinks = [
  ['/contact', Ambulance, 'home.emergency', 'home.emergencyDesc'],
  ['/doctors', UserSearch, 'home.findDoctor', 'home.findDoctorDesc'],
  ['/services', Activity, 'home.healthPackages', 'home.healthPackagesDesc'],
];

export default function HomePage() {
  const { t } = useI18n();
  usePageMeta(
    'CareOps Cloud | Hospital Management Platform',
    'Hospital management platform with public website, patient booking, doctor dashboard, admin metrics, and notifications.'
  );

  return (
    <PublicLayout>
      <main>
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-200">{t('home.badge')}</p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
                {t('home.heading')}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
                {t('home.subheading')}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="rounded bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50"
                >
                  {t('home.bookAppointment')}
                </Link>
                <Link
                  to="/login"
                  className="rounded border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10"
                >
                  {t('home.staffLogin')}
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <div className="rounded border border-white/20 bg-white/10 p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-200">{new Date().toDateString()}</p>
                    <h2 className="text-2xl font-bold text-white">{t('home.snapshotTitle')}</h2>
                  </div>
                  <span className="rounded bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-300">
                    {t('home.snapshotLive')}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    [t('home.patients'), '248'],
                    [t('home.doctors'), '36'],
                    [t('home.appointments'), '92'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded border border-white/20 p-4">
                      <p className="text-sm text-blue-200">{label}</p>
                      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-3">
                  {[t('home.schedule1'), t('home.schedule2'), t('home.schedule3')].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded border border-white/20 p-3 text-sm text-blue-100"
                      >
                        <span className="h-2 w-2 rounded-full bg-blue-300" />
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">{t('home.quickLinks')}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {quickLinks.map(([to, Icon, titleKey, descKey]) => (
                <Link
                  key={titleKey}
                  to={to}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{t(titleKey)}</h3>
                    <p className="text-sm text-gray-500">{t(descKey)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-950">{t('home.modulesTitle')}</h2>
            <p className="mt-2 max-w-2xl text-gray-600">{t('home.modulesSubtitle')}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(([titleKey, Icon, descKey]) => (
              <div key={titleKey} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Icon className="h-7 w-7 text-blue-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-950">{t(titleKey)}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
