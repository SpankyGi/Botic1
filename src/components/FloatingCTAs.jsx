import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang } from '../i18n/LangContext'
import { useEffect, useState } from 'react'

export default function FloatingCTAs() {
  const { t } = useTranslation()
  const lang = useLang()
  const { pathname } = useLocation()
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    const targets = [...document.querySelectorAll('.home-reserva-cta, .closing-cta, footer.botic-footer')]
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
      <a href={`https://bo-tic.myrestoo.net/${lang}/tienda`} className="cta-circle small hover-trigger">
        <span>{t('floating.gift')}</span>
      </a>
      <a href={`https://bo-tic.myrestoo.net/${lang}/reservar`} className="cta-circle hover-trigger">
        <span>{t('floating.book')}</span>
      </a>
    </div>
  )
}
