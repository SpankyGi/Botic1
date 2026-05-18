import { useState, useEffect, useRef } from 'react'

const MIN_MS  = 1800   // temps mínim visible
const MAX_MS  = 4000   // seguretat: màxim d'espera del vídeo
const FADE_MS =  650   // durada del fade-out

const alreadySeen = () =>
  typeof sessionStorage !== 'undefined' &&
  sessionStorage.getItem('botic_preloader_done') === '1'

export default function Preloader() {
  const [phase, setPhase] = useState(() => alreadySeen() ? 'done' : 'visible')
  const startRef = useRef(Date.now())

  useEffect(() => {
    if (phase !== 'visible') return

    let fading = false

    const beginFade = () => {
      if (fading) return
      fading = true
      setPhase('fading')
      sessionStorage.setItem('botic_preloader_done', '1')
      setTimeout(() => setPhase('done'), FADE_MS)
    }

    const onVideoReady = () => {
      const elapsed   = Date.now() - startRef.current
      const remaining = Math.max(0, MIN_MS - elapsed)
      setTimeout(beginFade, remaining)
    }

    window.addEventListener('hero-video-ready', onVideoReady)
    const maxTimer = setTimeout(beginFade, MAX_MS)

    return () => {
      window.removeEventListener('hero-video-ready', onVideoReady)
      clearTimeout(maxTimer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'done') return null

  return (
    <div
      id="preloader"
      className={phase === 'fading' ? 'fading' : ''}
      aria-hidden="true"
    >
      <div className="pre-logo">
        Bo<span className="pre-dot">.</span>TiC
      </div>

      <div className="pre-bar-wrap">
        <div className="pre-bar" />
      </div>

      <p className="pre-claim">Sentimiento y pasión</p>
    </div>
  )
}
