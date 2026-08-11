import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangRoutes } from '../i18n/LangContext'
import ResponsiveImage from './ResponsiveImage'

const HERO_STILLS = [
  { src: '/images/home-hero/restaurant-botic-emporda-aperitiu-08.webp', mobileSrc: '/images/home-hero/restaurant-botic-emporda-aperitiu-08-mobile.webp', tone: 'dark' },
  { src: '/images/home-hero/restaurant-botic-emporda-hortalisses-02.webp', mobileSrc: '/images/home-hero/restaurant-botic-emporda-hortalisses-02-mobile.webp', tone: 'light' },
  { src: '/images/home-hero/restaurant-botic-emporda-plat-temporada-01.webp', mobileSrc: '/images/home-hero/restaurant-botic-emporda-plat-temporada-01-mobile.webp', tone: 'dark' },
  { src: '/images/home-hero/restaurant-botic-emporda-plat-signatura-01.webp', mobileSrc: '/images/home-hero/restaurant-botic-emporda-plat-signatura-01-mobile.webp', tone: 'dark' },
  { src: '/images/home-hero/restaurant-botic-emporda-plat-mar-02.webp', mobileSrc: '/images/home-hero/restaurant-botic-emporda-plat-mar-02-mobile.webp', tone: 'light' },
  { src: '/images/home-hero/restaurant-botic-emporda-postres-fruita-01.webp', mobileSrc: '/images/home-hero/restaurant-botic-emporda-postres-fruita-01-mobile.webp', tone: 'dark' },
  { src: '/images/home-hero/restaurant-botic-emporda-hortalisses-03.webp', mobileSrc: '/images/home-hero/restaurant-botic-emporda-hortalisses-03-mobile.webp', tone: 'light' },
  { src: '/images/home-hero/restaurant-botic-emporda-aperitiu-02.webp', mobileSrc: '/images/home-hero/restaurant-botic-emporda-aperitiu-02-mobile.webp', tone: 'light' },
]

function HeroBrand({ pulseKey, tone }) {
  return (
    <div className="hero-brand-stage" aria-hidden="true">
      <img
        key={pulseKey}
        className="hero-brand hero-brand--pulse"
        src={tone === 'dark' ? '/images/botic-hero-symbol-light.png' : '/images/botic-hero-symbol-dark.png'}
        alt=""
        decoding="async"
      />
    </div>
  )
}

function HeroGallery({ activeIndex }) {
  return (
    <div className="hero-gallery" aria-hidden="true">
      {HERO_STILLS.map((still, index) => (
        <ResponsiveImage
          className={index === activeIndex ? 'hero-gallery-image is-active' : 'hero-gallery-image'}
          src={still.src}
          mobileSrc={still.mobileSrc}
          alt=""
          key={still.src}
          decoding="async"
          fetchpriority={index === 0 ? 'high' : 'auto'}
        />
      ))}
      <div className="hero-gallery-shade" />
    </div>
  )
}

function ScrollHint({ t }) {
  return (
    <div className="scroll-hint">
      <div className="scroll-line" />
      <span className="scroll-text">{t('hero.scroll')}</span>
    </div>
  )
}

export default function Hero() {
  const { t }  = useTranslation()
  const routes = useLangRoutes()
  const heroRef = useRef(null)
  const brandRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeStill = HERO_STILLS[activeIndex]

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return undefined

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_STILLS.length)
    }, 4000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    const brand = brandRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!hero || !brand || reducedMotion.matches) return undefined

    let frame = 0
    const updateBrand = () => {
      frame = 0
      const progress = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.7)))
      brand.style.setProperty('--hero-brand-scale', String(1 - progress * 0.72))
      brand.style.setProperty('--hero-brand-shift', `${-40 * progress}vh`)
      brand.style.setProperty('--hero-brand-opacity', String(Math.max(0, 1 - progress * 1.22)))
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateBrand)
    }

    updateBrand()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section ref={heroRef} className={`hero hero--${activeStill.tone}`}>
      <HeroGallery activeIndex={activeIndex} />
      <div ref={brandRef} className="hero-brand-motion">
        <HeroBrand pulseKey={activeIndex} tone={activeStill.tone} />
      </div>

      <div className="hero-content-wrap">
        <div className="hero-text">
          <div className="hero-eyebrow">{t('hero.awardLine')}</div>
          <h1 className="hero-title">
            <span className="word"><span>{t('hero.word1')}</span></span>
            <span className="word"><span>{t('hero.word2')}</span></span>
          </h1>
          <p className="hero-sub">{t('hero.sub')}</p>
          <div className="hero-ctas">
            <Link to={routes.reserves} className="hero-btn-primary">{t('hero.btnPrimary')}</Link>
            <Link to={routes.menus} className="hero-btn-secondary">{t('hero.btnSecondary')}</Link>
          </div>
        </div>
      </div>

      <ScrollHint t={t} />
    </section>
  )
}
