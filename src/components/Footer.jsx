import { useTranslation } from 'react-i18next'
import { useLangRoutes } from '../i18n/LangContext'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { t } = useTranslation()
  const routes = useLangRoutes()

  return (
    <footer className="botic-footer">
      <div className="foot-grid">
        <div>
          <div className="foot-logo">Bo<span className="dot">.</span>TiC</div>
          <div className="foot-tag">{t('footer.tagline')}</div>
        </div>

        <div className="foot-col">
          <h4>{t('footer.visitTitle')}</h4>
          <p>{t('footer.addressLine1')}</p>
          <p>{t('footer.addressLine2')}</p>
        </div>

        <div className="foot-col">
          <h4>{t('footer.contactTitle')}</h4>
          <a href="mailto:restaurant@bo-tic.com">restaurant@bo-tic.com</a>
          <a href="tel:+34972630869">+34 972 63 08 69</a>
        </div>

        <div className="foot-col">
          <h4>{t('footer.followTitle')}</h4>
          <a href="https://www.instagram.com/restaurantbotic" target="_blank" rel="noopener noreferrer">
            {t('common.instagram')}
          </a>
          <a href="https://www.facebook.com/restaurantbotic" target="_blank" rel="noopener noreferrer">
            {t('common.facebook')}
          </a>
        </div>
      </div>

      <div className="foot-bottom">
        <span>{t('footer.copyright')}</span>
        <span>
          <Link to={routes.home}>{t('footer.legal')}</Link>
          {' · '}
          <Link to={routes.home}>{t('footer.privacy')}</Link>
        </span>
      </div>
    </footer>
  )
}
