import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { supportedLanguages } from '../i18n/dictionaries';
import { Building2, Languages, Menu, X } from 'lucide-react';

const navItems = [
  ['/', 'nav.home'],
  ['/about', 'nav.about'],
  ['/doctors', 'nav.doctors'],
  ['/departments', 'nav.departments'],
  ['/services', 'nav.services'],
  ['/contact', 'nav.contact'],
];

export default function PublicLayout({ children }) {
  const { lang, setLang, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive ? 'text-blue-700 font-medium' : 'text-gray-600 hover:text-blue-700 font-medium';

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-white">
              <Building2 className="h-5 w-5" />
            </span>
              <span>
                <span className="block text-lg font-bold leading-5">CareOps Cloud</span>
              <span className="block text-xs text-gray-500">{t('layout.tagline')}</span>
              </span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navItems.map(([to, labelKey]) => (
              <NavLink key={to} to={to} className={linkClass}>
                {t(labelKey)}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 sm:flex lg:flex">
            <div className="flex items-center gap-1 rounded border border-slate-200 px-2 py-2 text-xs text-gray-600">
              <Languages className="h-4 w-4" />
              <select
                aria-label="Language"
                className="bg-transparent text-xs text-gray-600 outline-none"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                {supportedLanguages.map((language) => (
                  <option key={language.code} value={language.code}>{language.label}</option>
                ))}
              </select>
            </div>
            <Link to="/login" className="rounded border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">{t('layout.login')}</Link>
            <Link to="/register" className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">{t('layout.register')}</Link>
          </div>

          <button
            className="flex items-center p-2 text-gray-600 lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navItems.map(([to, labelKey]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="block rounded px-3 py-2 text-sm hover:bg-slate-100">{t(labelKey)}</span>
                </NavLink>
              ))}
              <hr className="my-2 border-slate-200" />
              <div className="flex items-center gap-2 px-3 py-2">
                <Languages className="h-4 w-4 text-gray-500" />
                <select
                  aria-label="Language"
                  className="bg-transparent text-sm text-gray-600 outline-none"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  {supportedLanguages.map((language) => (
                    <option key={language.code} value={language.code}>{language.label}</option>
                  ))}
                </select>
              </div>
              <Link
                to="/login"
                className="block rounded px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-slate-100"
                onClick={() => setMenuOpen(false)}
              >
                {t('layout.login')}
              </Link>
              <Link
                to="/register"
                className="block rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white text-center hover:bg-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                {t('layout.register')}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {children}

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-gray-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.tagline')}</p>
        </div>
      </footer>
    </div>
  );
}
