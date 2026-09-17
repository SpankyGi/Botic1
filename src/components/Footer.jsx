import legacyContent from '../data/legacyContent.json'
import { useState } from 'react'
import CareersDialog, { CAREERS_COPY } from './CareersDialog'
import { useLang } from '../i18n/LangContext'
import { ROUTE_SLUGS } from '../i18n/routes'
import { useTranslation } from 'react-i18next'
import { useLangRoutes } from '../i18n/LangContext'
import { Link } from 'react-router-dom'
import { BoticWordmark } from './Nav'
import { useReveal } from '../hooks/useReveal'

export default function Footer() {
  const { t } = useTranslation()
  const routes = useLangRoutes()
  const lang = useLang()
  const footerRef = useReveal(0.06)
  const [careersOpen, setCareersOpen] = useState(false)

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
            <Link to={routes.experiencia}>{t('footer.experiencia')}</Link>
            <Link to={routes.menus}>{t('footer.menus')}</Link>
            <Link to={`/${lang}/${ROUTE_SLUGS[lang].chefTable}/`}>{legacyContent.copy[lang].chefTable[0]}</Link>
            <a href={`${routes.restaurant}#team`}>{t('footer.team')}</a>
            <button type="button" className="footer-careers-link" onClick={() => setCareersOpen(true)}>{CAREERS_COPY[lang].title}</button>
            {["videos", "identity"].map(key => <Link key={key} to={`/${lang}/${ROUTE_SLUGS[lang][key]}/`}>{legacyContent.copy[lang][key][0]}</Link>)}
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
              href="https://maps.google.com/?q=Avinguda+Costa+Brava+6,+Cor%C3%A7%C3%A0,+Girona"
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
              <li><a href="https://guide.michelin.com/es/es/catalunya/corca/restaurante/bo-tic" target="_blank" rel="noopener noreferrer">{t('footer.michelin')}</a></li>
              <li><a href="https://www.guiarepsol.com/es/fichas/restaurante/botic-9041/" target="_blank" rel="noopener noreferrer">{t('footer.repsol')}</a></li>
              <li><a href="https://acgn.cat/premis-nacionals-de-gastronomia/" target="_blank" rel="noopener noreferrer">{t('footer.nationalGastronomy')}</a></li>
              <li><a href="https://b2b.costabrava.org/premi-g/premi-honorific-juli-soler-i-lobo/" target="_blank" rel="noopener noreferrer">{t('footer.premisG')}</a></li>
            </ul>
            <div className="footer-follow">
              <span>{t('footer.followTitle')}</span>
              <div>
                <a href="https://www.instagram.com/restaurantbo.tic/" target="_blank" rel="noopener noreferrer">
                  {t('common.instagram')}
                </a>
                <a href="https://www.facebook.com/RestaurantBo.TiC" target="_blank" rel="noopener noreferrer">
                  {t('common.facebook')}
                </a>
                <a href="https://x.com/restaurantBoTiC" target="_blank" rel="noopener noreferrer">X</a>
              </div>
            </div>
          </section>
        </div>

        <div className="footer-bottom">
          <span>{t('footer.copyright')}</span>
          <nav aria-label={t('footer.legalLinksLabel')}>
            <Link to={routes.legal}>{t('footer.legal')}</Link>
            <Link to={routes.privacy}>{t('footer.privacy')}</Link>
            <Link to={routes.cookies}>{t('footer.cookies')}</Link>
            <button type="button" className="footer-cookie-preferences" onClick={() => window.dispatchEvent(new Event('botic:cookie-preferences'))}>{t('footer.cookiePreferences')}</button>
            <span>{t('footer.credit')}</span>
            <a href="https://ovproduccions.com" target="_blank" rel="noopener noreferrer">OV Produccions</a>
          </nav>
        </div>
      </div>
      {careersOpen && <CareersDialog lang={lang} privacyUrl={routes.privacy} onClose={() => setCareersOpen(false)} />}
    </footer>
  )
}
