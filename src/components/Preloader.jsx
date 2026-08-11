import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const MIN_MS  = 2500   // temps mínim visible
const MAX_MS  = 5000   // seguretat: màxim d'espera del vídeo
const FADE_MS =  700   // durada del fade-out

const alreadySeen = () =>
  typeof sessionStorage !== 'undefined' &&
  sessionStorage.getItem('botic_preloader_done') === '1'

export default function Preloader() {
  const { t }   = useTranslation()
  const { pathname } = useLocation()
  const [phase, setPhase] = useState(() => alreadySeen() ? 'done' : 'visible')
  const startRef = useRef(Date.now())
  const isHome = /^\/(?:ca|es|en|fr)?\/?$/.test(pathname)

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

      <div className="pre-progress-seal">
        <div className="pre-bar-wrap">
          <div className="pre-bar" />
        </div>
        {isHome && (
          <div className="pre-michelin-stars" role="img" aria-label="Dues estrelles Michelin">
            <img src="/images/michelin-star-original.png" alt="" width="34" height="34" decoding="async" />
            <img src="/images/michelin-star-original.png" alt="" width="34" height="34" decoding="async" />
          </div>
        )}
      </div>

      <p className="pre-claim">{t('footer.tagline')}</p>
    </div>
  )
}
