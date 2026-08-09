import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangRoutes } from '../i18n/LangContext'
import { useMagnetic } from '../hooks/useMagnetic'

function MagneticLink({ to, className, children }) {
  const ref = useMagnetic(0.4, 70)
  return (
    <Link ref={ref} to={to} className={`magnetic-btn ${className}`}>
      <span className="magnetic-btn-label">{children}</span>
    </Link>
    )
}

const BG_VIDEO_SRC    = 'https://res.cloudinary.com/dnij1yhdu/video/upload/v1779093224/hero-botic_krjc0b.webm'
const BG_VIDEO_POSTER = '/images/hero-botic-poster.jpg'

function BgVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const signalReady = () => {
      window.dispatchEvent(new Event('hero-video-ready'))
    }
    video.addEventListener('canplay', signalReady, { once: true })

    if (!mq.matches) video.play().catch(() => {})

    return () => video.removeEventListener('canplay', signalReady)
  }, [])

  return (
    <div className="hero-bg-video-wrap" aria-hidden="true">
      <video
        ref={videoRef}
        className="hero-bg-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={BG_VIDEO_POSTER}
        tabIndex="-1"
      >
        <source src={BG_VIDEO_SRC} type="video/webm" />
      </video>
      <div className="hero-bg-overlay" />
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

  return (
    <section className="hero">
      <div className="hero-bg" />
      <BgVideo />

      <div className="hero-content-wrap">
        <div className="hero-text">

          {/* Claim superior — càpsula champagne */}
          <div className="hero-eyebrow">{t('hero.awardLine')}</div>

          {/* Titular en dues línies */}
          <h1 className="hero-title">
            <span className="word"><span>{t('hero.word1')}</span></span>
            <span className="word"><span>{t('hero.word2')}</span></span>
          </h1>

          {/* Subtext molt curt */}
          <p className="hero-sub">
            {t('hero.sub')}
          </p>

          {/* CTA */}
          <div className="hero-ctas">
            <MagneticLink to={routes.reserves} className="hero-btn-primary">{t('hero.btnPrimary')}</MagneticLink>
          <MagneticLink to={routes.menus}    className="hero-btn-secondary">{t('hero.btnSecondary')}</MagneticLink>
          </div>

        </div>
      </div>

      <ScrollHint t={t} />
    </section>
  )
}
