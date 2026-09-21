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

// Original vector geometry: animate the two brand dots independently.
const BRAND_LETTER = 'M22 16H120C170 16 198 43 198 88C198 119 183 141 155 149C193 157 212 183 212 223C212 272 180 300 130 300H22Z M34 29V144H120C161 144 186 124 186 88C186 50 162 29 120 29Z M34 157V287H130C175 287 200 265 200 223C200 181 174 157 130 157Z'

function HeroBrand({ pulseKey, tone }) {
  return (
    <div className={`hero-brand-stage hero-brand-stage--${tone}`} aria-hidden="true">
      <svg key={pulseKey} className="hero-brand hero-brand--signature" viewBox="0 0 520 320" focusable="false">
        <path className="hero-brand-letter-echo" fill="currentColor" fillRule="evenodd" d={BRAND_LETTER} />
        <path className="hero-brand-letter-reveal" fill="currentColor" fillRule="evenodd" d={BRAND_LETTER} />
        <circle className="hero-brand-ripple" cx="343.268" cy="221.807" r="66.065" />
        <circle className="hero-brand-dot hero-brand-dot--large" cx="343.268" cy="221.807" r="66.065" />
        <circle className="hero-brand-dot hero-brand-dot--small" cx="466.106" cy="111.248" r="33.129" />
      </svg>
    </div>
  )
}

const SLIDE_MS = 6500

function HeroGallery({ activeIndex, previousIndex }) {
  const [readyNext, setReadyNext] = useState(null)
  useEffect(() => {
    const timer = setTimeout(() => setReadyNext((activeIndex + 1) % HERO_STILLS.length), 3000)
    return () => clearTimeout(timer)
  }, [activeIndex])
  return (
    <div className="hero-gallery" aria-hidden="true">
      {HERO_STILLS.map((still, index) => (index === activeIndex || index === previousIndex || index === readyNext) && (
        <div key={still.src} className={`hero-slide${index === activeIndex ? ' is-active' : ''}${index === previousIndex ? ' is-previous' : ''}${previousIndex === null ? ' is-initial' : ''}`}>
        <ResponsiveImage
          className="hero-gallery-image"
          src={still.src}
          mobileSrc={still.mobileSrc}
          alt=""
          decoding="async"
          fetchpriority={index === 0 ? 'high' : 'low'}
        />
        </div>
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
  const [previousIndex, setPreviousIndex] = useState(null)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [inView, setInView] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const touchStart = useRef(null)
  const lastChange = useRef(0)
  const activeStill = HERO_STILLS[activeIndex]
  const playing = !paused && !reducedMotion && inView && pageVisible

  const selectSlide = (next) => {
    if (next === activeIndex || Date.now() - lastChange.current < 1400) return
    lastChange.current = Date.now()
    setPreviousIndex(activeIndex)
    setActiveIndex(next)
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(media.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    updateMotion()
    updateVisibility()
    media.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(heroRef.current)
    return () => {
      media.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateVisibility)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!playing) return undefined
    const timer = window.setTimeout(() => {
      lastChange.current = Date.now()
      setPreviousIndex(activeIndex)
      setActiveIndex((activeIndex + 1) % HERO_STILLS.length)
    }, SLIDE_MS)
    return () => window.clearTimeout(timer)
  }, [activeIndex, playing])

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
    <section ref={heroRef} className={`hero hero--${activeStill.tone} hero--cinema${playing ? ' is-playing' : ''}`}
      aria-label={t('hero.galleryLabel')}
      onTouchStart={event => { const touch = event.touches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY } }}
      onTouchEnd={event => {
        if (!touchStart.current) return
        const dx = event.changedTouches[0].clientX - touchStart.current.x
        const dy = event.changedTouches[0].clientY - touchStart.current.y
        touchStart.current = null
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          setPaused(true)
          selectSlide((activeIndex + (dx < 0 ? 1 : -1) + HERO_STILLS.length) % HERO_STILLS.length)
        }
      }}>
      <HeroGallery activeIndex={activeIndex} previousIndex={previousIndex} />
      <div ref={brandRef} className="hero-brand-motion">
        <HeroBrand pulseKey={activeIndex} tone={activeStill.tone} />
      </div>

      <div className="hero-content-wrap">
        <div className="hero-text">
          <div className="hero-eyebrow">{t('hero.awardLine')}</div>
          <h1 className="hero-title">
            <span className="word"><span>{t('hero.word1')}</span></span>{' '}
            <span className="word"><span>{t('hero.word2')}</span></span>
          </h1>
          <p className="hero-sub">{t('hero.sub')}</p>
          <div className="hero-ctas">
            <Link to={routes.reserves} className="hero-btn-primary">{t('hero.btnPrimary')}</Link>
            <Link to={routes.menus} className="hero-btn-secondary">{t('hero.btnSecondary')}</Link>
          </div>
        </div>
      </div>

      <div className="hero-slider-controls" role="group" aria-label={t('hero.galleryLabel')}
        onFocus={event => { if (!event.target.classList.contains('hero-slider-play') && !event.currentTarget.contains(event.relatedTarget)) setPaused(true) }}>
        <button type="button" className="hero-slider-arrow" aria-label={t('hero.previousImage')} onClick={() => selectSlide((activeIndex - 1 + HERO_STILLS.length) % HERO_STILLS.length)}>←</button>
        <div className="hero-slider-dots">
          {HERO_STILLS.map((still, index) => <button key={still.src} type="button"
            className={`hero-slider-dot${index === activeIndex ? ' is-active' : ''}`}
            aria-label={t('hero.showImage', { number: index + 1 })} aria-pressed={index === activeIndex}
            onClick={() => selectSlide(index)}><span /></button>)}
        </div>
        <button type="button" className="hero-slider-arrow" aria-label={t('hero.nextImage')} onClick={() => selectSlide((activeIndex + 1) % HERO_STILLS.length)}>→</button>
        {!reducedMotion && <button type="button" className="hero-slider-play" aria-label={t(paused ? 'hero.playSlides' : 'hero.pauseSlides')} onClick={() => setPaused(value => !value)}>{paused ? '▷' : 'Ⅱ'}</button>}
        <span key={`${activeIndex}-${playing}`} className="hero-slider-progress" aria-hidden="true" style={{ '--slide-duration': `${SLIDE_MS}ms` }} />
      </div>
      <ScrollHint t={t} />
    </section>
  )
}
