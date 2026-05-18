import { useState, useEffect, useRef } from 'react'

const VIDEO_SRC     = 'https://res.cloudinary.com/dnij1yhdu/video/upload/v1778375551/loop_ps82z2.mp4'
const BG_VIDEO_SRC  = 'https://res.cloudinary.com/dnij1yhdu/video/upload/v1779093224/hero-botic_krjc0b.webm'
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

function VideoFrame() {
  const videoRef = useRef(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onCanPlay  = () => { setError(false); video.play().catch(() => {}) }
    const onLoaded   = () => setError(false)

    video.addEventListener('canplay',    onCanPlay)
    video.addEventListener('loadeddata', onLoaded)

    const timer = setTimeout(() => {
      if (video.readyState < 2) setError(true)
    }, 4500)

    return () => {
      video.removeEventListener('canplay',    onCanPlay)
      video.removeEventListener('loadeddata', onLoaded)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="hero-video-frame">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        crossOrigin="anonymous"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <div className={`video-error${error ? ' show' : ''}`}>
        <strong>· Vista previa limitada ·</strong>
        <em>El vídeo está disponible<br />en el sitio en producción.</em>
        <span style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', opacity: 0.5 }}>
          Bo.TiC · Empordà
        </span>
      </div>

      <div className="video-side-text left">Bo · TiC</div>
      <div className="video-side-text right">Empordà · 2007</div>
      <div className="video-vignette" />
      <div className="video-curtain top" />
      <div className="video-curtain bottom" />
      <div className="video-accent" />
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <BgVideo />
      <SteamBlobs />

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

        <VideoFrame />

        <div className="video-caption">
          <span className="live-dot" />
          <span>La cocina, en movimiento</span>
        </div>
      </div>

      <ScrollHint />
    </section>
  )
}
