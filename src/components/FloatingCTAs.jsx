import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangRoutes } from '../i18n/LangContext'
import { useEffect, useState } from 'react'

export default function FloatingCTAs() {
  const { t } = useTranslation()
  const routes = useLangRoutes()
  const { pathname } = useLocation()
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    const targets = [...document.querySelectorAll('.home-reserva-cta, footer.botic-footer')]
    if (!targets.length) return undefined

    const visibleTargets = new Set()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleTargets.add(entry.target)
        else visibleTargets.delete(entry.target)
      })
      setIsHidden(visibleTargets.size > 0)
    }, { threshold: 0.08 })

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [pathname])

  return (
    <div className={`float-ctas${isHidden ? ' is-hidden' : ''}`}>
      <a href="tel:+34972630869" className="cta-circle small hover-trigger">
        <span className="cta-symbol" aria-hidden="true">↗</span>
        <span>{t('floating.call')}</span>
      </a>
      <Link to={routes.reserves} className="cta-circle hover-trigger">
        <span className="cta-symbol" aria-hidden="true">●</span>
        <span>{t('floating.book')}</span>
      </Link>
    </div>
  )
}
