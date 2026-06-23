import { Activity, Ambulance, CalendarDays, FlaskConical, HeartPulse, MonitorSmartphone, Stethoscope, Syringe, UserCheck, Video } from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useI18n } from '../../hooks/useI18n';

const sections = [
  {
    titleKey: 'services.diagnosticTitle',
    descKey: 'services.diagnosticDesc',
    icon: Activity,
    items: [
      ['services.lab', FlaskConical, 'services.labDesc'],
      ['services.imaging', Syringe, 'services.imagingDesc'],
      ['services.ecg', HeartPulse, 'services.ecgDesc'],
    ],
  },
  {
    titleKey: 'services.outpatientTitle',
    descKey: 'services.outpatientDesc',
    icon: CalendarDays,
    items: [
      ['services.consultations', Stethoscope, 'services.consultationsDesc'],
      ['services.followup', UserCheck, 'services.followupDesc'],
      ['services.telemedicine', Video, 'services.telemedicineDesc'],
    ],
  },
  {
    titleKey: 'services.emergencyTitle',
    descKey: 'services.emergencyDesc',
    icon: Ambulance,
    items: [
      ['services.trauma', MonitorSmartphone, 'services.traumaDesc'],
      ['services.ambulance', Ambulance, 'services.ambulanceDesc'],
      ['services.icu', Activity, 'services.icuDesc'],
    ],
  },
];

export default function ServicesPage() {
  const { t } = useI18n();
  usePageMeta('Services | CareOps Cloud', 'Hospital services and care modules supported by CareOps Cloud.');

  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">{t('services.badge')}</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-950">{t('services.heading')}</h1>
        </div>

        <div className="space-y-14">
          {sections.map(({ titleKey, descKey, icon: SectionIcon, items }) => (
            <section key={titleKey}>
              <div className="mb-2 flex items-center gap-3">
                <SectionIcon className="h-7 w-7 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-950">{t(titleKey)}</h2>
              </div>
              <p className="mb-6 max-w-3xl text-gray-600">{t(descKey)}</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map(([itemTitleKey, ItemIcon, itemDescKey]) => (
                  <article key={itemTitleKey} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                    <ItemIcon className="h-7 w-7 text-blue-600" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-950">{t(itemTitleKey)}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{t(itemDescKey)}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}
