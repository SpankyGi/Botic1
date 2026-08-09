import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang, useLangRoutes } from '../i18n/LangContext'
import { useReveal } from '../hooks/useReveal'

const PASSION = {
  ca: 'Ens apassiona el que fem',
  es: 'Nos apasiona lo que hacemos',
  en: 'We are passionate about what we do',
  fr: 'Nous sommes passionnés par ce que nous faisons',
}

export default function ProjecteSection() {
  const { t }  = useTranslation()
  const lang   = useLang()
  const routes = useLangRoutes()
  const passionRef = useReveal(0.4)

  return (
    <section className="projecte-section" aria-label={t('soul.tab2')}>
      <div className="soul-photo-wrap">
        <img
          src="/images/cristina-albert-botic-emporda-michelin.webp"
          alt={t('soul.portraitAlt')}
          className="soul-photo-img soul-img-2"
        />
        <div className="soul-overlay soul-overlay-2" aria-hidden="true" />
      </div>

      <div className="container-max soul-panel-inner">
        <div className="soul-panel-content">
          <span className="soul-eyebrow soul-passion" ref={passionRef}>
            {Array.from(PASSION[lang] || PASSION.ca).map((letter, index) => (
              <span key={`${letter}-${index}`} className="soul-passion-letter" style={{ '--letter': index }}>
                {letter === ' ' ? '\u00a0' : letter}
              </span>
            ))}
          </span>
          <h2 className="soul-title">
            {t('soul.title').split('\n').map((line, i, arr) => (
              <Fragment key={i}>{line}{i < arr.length - 1 && <br />}</Fragment>
            ))}
          </h2>
          <div className="soul-sep" aria-hidden="true" />
          <p className="soul-body">{t('soul.body')}</p>
          <Link to={routes.restaurant} className="soul-cta">
            {t('soul.cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
