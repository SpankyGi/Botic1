import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { useLang, useSwitchLang } from '../i18n/LangContext'
import { LANGS } from '../i18n/routes'

const LANGUAGE_LABELS = {
  ca: 'CA',
  es: 'ES',
  en: 'EN',
  fr: 'FR',
}

export default function TopBar() {
  const { t } = useTranslation()
  const lang = useLang()
  const switchLang = useSwitchLang()
  const { pathname } = useLocation()

  return (
    <div className="topbar">
      <div className="topbar-left">
        <a href="mailto:restaurant@bo-tic.com">restaurant@bo-tic.com</a>
      </div>
      <div className="topbar-right">
        <span className="award">
          <span className="award-icon">★★</span>Michelin
        </span>
        <span className="award">{t('topbar.repsol')}</span>
        <span className="award">{t('topbar.nacional')}</span>
        <span className="award">{t('topbar.premisG')}</span>
        <nav className="topbar-languages" aria-label={t('topbar.languageNav')}>
          {LANGS.map((targetLang) => (
            <Link
              key={targetLang}
              to={switchLang(targetLang, pathname)}
              className={targetLang === lang ? 'is-active' : ''}
              aria-current={targetLang === lang ? 'page' : undefined}
              lang={targetLang}
            >
              {LANGUAGE_LABELS[targetLang]}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
