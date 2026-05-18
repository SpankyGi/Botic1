import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import AtmosphericParticles from './AtmosphericParticles'

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

function SteamBlobs() {
  return (
    <div className="steam">
      <div className="steam-blob" />
      <div className="steam-blob" />
      <div className="steam-blob" />
    </div>
  )
}

function ScrollHint() {
  return (
    <div className="scroll-hint">
      <div className="scroll-line" />
      <span className="scroll-text">Scroll</span>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <BgVideo />
      <SteamBlobs />
      <AtmosphericParticles />

      <div className="hero-content-wrap">
        <div className="hero-text">

          {/* Claim superior — càpsula champagne */}
          <div className="hero-eyebrow">
            ★★ Michelin · Corçà · Empordà
          </div>

          {/* Titular en dues línies */}
          <h1 className="hero-title">
            <span className="word"><span>Sentimiento</span></span>
            <span className="word"><span>y pasión</span></span>
          </h1>

          {/* Subtext molt curt */}
          <p className="hero-sub">
            Alta gastronomía en el corazón del Empordà.
          </p>

          {/* CTA */}
          <div className="hero-ctas">
            <Link to="/reserves" className="hero-btn-primary">Reservar</Link>
            <Link to="/menus"    className="hero-btn-secondary">Ver menús</Link>
          </div>

        </div>
      </div>

      <ScrollHint />
    </section>
  )
}
