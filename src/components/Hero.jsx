import { useEffect, useRef } from 'react'
import AtmosphericParticles from './AtmosphericParticles'

const BG_VIDEO_SRC    = 'https://res.cloudinary.com/dnij1yhdu/video/upload/v1779093224/hero-botic_krjc0b.webm'
const BG_VIDEO_POSTER = '/images/hero-botic-poster.jpg'

function BgVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return
    video.play().catch(() => {})
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
          <div className="hero-eyebrow">★★ Michelin · Corçà · Empordà</div>
          <h1 className="hero-title">
            <span className="word"><span>Sentimiento</span></span>
            {' '}
            <span className="word"><span>y</span></span>
            {' '}
            <span className="word"><span>pasión</span></span>
          </h1>
        </div>
      </div>

      <ScrollHint />
    </section>
  )
}
