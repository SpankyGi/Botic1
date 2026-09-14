import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const MIN_MS  = 350   // temps mínim visible
const MAX_MS  = 1500   // seguretat: màxim d'espera de la primera imatge
const FADE_MS =  700   // durada del fade-out

const alreadySeen = () => {
  try { return typeof sessionStorage !== 'undefined' && sessionStorage.getItem('botic_preloader_done') === '1' } catch { return false }
}

export default function Preloader() {
  const { t }   = useTranslation()
  const { pathname } = useLocation()
  const isHome = /^\/(?:ca|es|en|fr)?\/?$/.test(pathname)
  const [phase, setPhase] = useState(() => !isHome || alreadySeen() ? 'done' : 'visible')
  const startRef = useRef(Date.now())

  useEffect(() => {
    if (phase !== 'visible') return

    let fading = false
    let fadeTimer
    let readyTimer

    const beginFade = () => {
      if (fading) return
      fading = true
      setPhase('fading')
      try { sessionStorage.setItem('botic_preloader_done', '1') } catch {}
      fadeTimer = setTimeout(() => setPhase('done'), FADE_MS)
    }

    const onImageReady = () => {
      const elapsed   = Date.now() - startRef.current
      const remaining = Math.max(0, MIN_MS - elapsed)
      readyTimer = setTimeout(beginFade, remaining)
    }

    const firstImage = document.querySelector('.hero-gallery-image')
    if (!firstImage || firstImage.complete) onImageReady()
    else {
      firstImage.addEventListener('load', onImageReady, { once: true })
      firstImage.addEventListener('error', onImageReady, { once: true })
    }
    const maxTimer = setTimeout(beginFade, MAX_MS)

    return () => {
      firstImage?.removeEventListener('load', onImageReady)
      firstImage?.removeEventListener('error', onImageReady)
      clearTimeout(readyTimer)
      clearTimeout(fadeTimer)
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
