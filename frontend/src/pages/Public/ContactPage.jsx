import { useState } from 'react';
import { Mail, MapPin, Phone, PhoneCall } from 'lucide-react';
import PublicLayout from '../../components/PublicLayout';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useI18n } from '../../hooks/useI18n';

export default function ContactPage() {
  const { t } = useI18n();
  usePageMeta('Contact | CareOps Cloud', 'Contact the CareOps Cloud hospital management team.');

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PublicLayout>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">{t('contact.badge')}</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-950">{t('contact.heading')}</h1>
          <p className="mt-4 text-lg text-gray-600">{t('contact.subheading')}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">{t('contact.address')}</p>
                  <p className="text-gray-600">{t('contact.addressLine1')}</p>
                  <p className="text-gray-600">{t('contact.addressLine2')}</p>
                  <p className="text-gray-600">{t('contact.addressLine3')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">{t('contact.phone')}</p>
                  <p className="text-gray-600">{t('contact.phoneMain')}</p>
                  <p className="text-gray-600">{t('contact.phoneEmergency')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">{t('contact.email')}</p>
                  <p className="text-gray-600">{t('contact.emailAddress')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <PhoneCall className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-red-800">{t('contact.emergencyHotline')}</p>
                  <p className="text-2xl font-bold text-red-700">{t('contact.emergencyNumber')}</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                {t('contact.mapPlaceholder')}
              </div>
            </div>
          </div>

          <div>
            {sent ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
                <p className="text-lg font-semibold text-green-800">{t('contact.thankYou')}</p>
                <p className="mt-2 text-green-700">{t('contact.thankYouDesc')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-semibold text-gray-950">{t('contact.formTitle')}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('contact.formName')}</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder={t('contact.formNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('contact.formEmail')}</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder={t('contact.formEmailPlaceholder')}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">{t('contact.formPhone')}</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder={t('contact.formPhonePlaceholder')}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">{t('contact.formMessage')}</label>
                  <textarea
                    required
                    rows="5"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder={t('contact.formMessagePlaceholder')}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-5 rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  {t('contact.formSubmit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
