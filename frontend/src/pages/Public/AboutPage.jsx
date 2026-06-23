import { Heart, Eye, Lightbulb, Shield, Users } from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useI18n } from '../../hooks/useI18n';

const values = [
  ['about.valueCompassion', Heart, 'about.valueCompassionDesc'],
  ['about.valueExcellence', Shield, 'about.valueExcellenceDesc'],
  ['about.valueInnovation', Lightbulb, 'about.valueInnovationDesc'],
  ['about.valueIntegrity', Eye, 'about.valueIntegrityDesc'],
  ['about.valueTeamwork', Users, 'about.valueTeamworkDesc'],
];

export default function AboutPage() {
  const { t } = useI18n();
  usePageMeta('About CareOps Cloud', 'About the CareOps Cloud hospital management platform and mission.');

  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">{t('about.badge')}</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-950">{t('about.heading')}</h1>
          <p className="mt-5 text-lg leading-8 text-gray-600">
            {t('about.subheading')}
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-950">{t('about.historyTitle')}</h2>
          <p className="mt-3 max-w-4xl text-lg leading-8 text-gray-600">{t('about.historyDesc')}</p>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <Heart className="h-7 w-7 text-blue-600" />
            <h2 className="mt-4 text-xl font-semibold text-gray-950">{t('about.mission')}</h2>
            <p className="mt-3 leading-7 text-gray-600">{t('about.missionDesc')}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <Eye className="h-7 w-7 text-blue-600" />
            <h2 className="mt-4 text-xl font-semibold text-gray-950">{t('about.vision')}</h2>
            <p className="mt-3 leading-7 text-gray-600">{t('about.visionDesc')}</p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-950">{t('about.values')}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {values.map(([titleKey, Icon, descKey]) => (
              <div key={titleKey} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
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
