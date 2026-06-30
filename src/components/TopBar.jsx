import { useTranslation } from 'react-i18next'

export default function TopBar() {
  const { t } = useTranslation()

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
      </div>
    </div>
  )
}
