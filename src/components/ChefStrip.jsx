import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReveal } from '../hooks/useReveal'
import { useLangRoutes } from '../i18n/LangContext'

export default function ChefStrip() {
  const { t }    = useTranslation()
  const routes   = useLangRoutes()
  const textRef  = useReveal(0.15)
  const imgRef   = useReveal(0.08)

  return (
    <section className="chef-section">

      {/* Imatge — dreta */}
      <div className="chef-photo-wrap" ref={imgRef}>
        <img
          src="/images/cristina-albert-botic-emporda-michelin.webp"
          alt={t('soul.portraitAlt')}
          className="chef-photo-img"
        />
        <div className="chef-photo-overlay" aria-hidden="true" />
      </div>

      {/* Text — esquerra */}
      <div className="container-max chef-container">
        <div className="chef-content reveal" ref={textRef}>

          <span className="chef-eyebrow">{t('soul.eyebrow')}</span>

          <h2 className="chef-title">
            {t('soul.title').split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h2>

          <div className="chef-sep" aria-hidden="true" />

          <p className="chef-body">{t('soul.body')}</p>

          <Link to={routes.restaurant} className="chef-cta">
            {t('soul.cta')}
          </Link>

        </div>
      </div>

    </section>
  )
}
