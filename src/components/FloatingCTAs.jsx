import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangRoutes } from '../i18n/LangContext'

export default function FloatingCTAs() {
  const { t } = useTranslation()
  const routes = useLangRoutes()

  return (
    <div className="float-ctas">
      <a href="tel:+34972630869" className="cta-circle small hover-trigger">
        <span>{t('floating.call')}</span>
      </a>
      <Link to={routes.reserves} className="cta-circle hover-trigger">
        <span>{t('floating.book')}</span>
      </Link>
    </div>
  )
}
