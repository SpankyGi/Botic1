import { useTranslation } from 'react-i18next'
import { useLangRoutes } from '../i18n/LangContext'
import { Link } from 'react-router-dom'
import { BoticWordmark } from './Nav'
import { useReveal } from '../hooks/useReveal'

export default function Footer() {
  const { t } = useTranslation()
  const routes = useLangRoutes()
  const footerRef = useReveal(0.06)

  return (
    <footer className="botic-footer">
      <div className="footer-shell" ref={footerRef}>
        <div className="footer-grid">
          <section className="footer-brand" aria-label="Bo.TiC">
            <Link to={routes.home} className="footer-brand-logo" aria-label="Bo.TiC">
              <BoticWordmark />
            </Link>
            <p>{t('footer.tagline')}</p>
          </section>

          <nav className="footer-column footer-explore" aria-label={t('footer.exploreTitle')}>
            <h2>{t('footer.exploreTitle')}</h2>
            <Link to={routes.restaurant}>{t('footer.restaurant')}</Link>
            <Link to={routes.gastronomia}>{t('footer.gastronomia')}</Link>
            <Link to={routes.menus}>{t('footer.menus')}</Link>
            <Link to={routes.experiencia}>{t('footer.experiencia')}</Link>
            <Link to={routes.restaurant}>{t('footer.gallery')}</Link>
            <Link to={`${routes.restaurant}#team`}>{t('footer.team')}</Link>
          </nav>

          <section className="footer-column footer-visit">
            <h2>{t('footer.visitTitle')}</h2>
            <address>
              <span>{t('footer.addressLine1')}</span>
              <span>{t('footer.addressLine2')}</span>
            </address>
            <a href="tel:+34972630869">+34 972 63 08 69</a>
            <a href="mailto:restaurant@bo-tic.com">restaurant@bo-tic.com</a>
            <a
              href="https://maps.google.com/?q=Carrer+dels+Forns+7,+Cor%C3%A7%C3%A0,+Girona"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('footer.directions')}
            </a>
            <Link to={routes.reserves} className="footer-reserve-link">{t('footer.reserve')}</Link>
          </section>

          <section className="footer-column footer-recognitions">
            <h2>{t('footer.recognitionsTitle')}</h2>
            <ul aria-label={t('footer.recognitionsTitle')}>
              <li>{t('footer.michelin')}</li>
              <li>{t('footer.repsol')}</li>
              <li>{t('footer.nationalGastronomy')}</li>
              <li>{t('footer.premisG')}</li>
            </ul>
            <div className="footer-follow">
              <span>{t('footer.followTitle')}</span>
              <div>
                <a href="https://www.instagram.com/restaurantbotic" target="_blank" rel="noopener noreferrer">
                  {t('common.instagram')}
                </a>
                <a href="https://www.facebook.com/restaurantbotic" target="_blank" rel="noopener noreferrer">
                  {t('common.facebook')}
                </a>
              </div>
            </div>
          </section>
        </div>

        <div className="footer-bottom">
          <span>{t('footer.copyright')}</span>
          <nav aria-label={t('footer.legalLinksLabel')}>
            <Link to={routes.home}>{t('footer.legal')}</Link>
            <Link to={routes.home}>{t('footer.privacy')}</Link>
            <Link to={routes.home}>{t('footer.cookies')}</Link>
            <span>{t('footer.credit')}</span>
            <a href="https://ovproduccions.com" target="_blank" rel="noopener noreferrer">OV Produccions</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
