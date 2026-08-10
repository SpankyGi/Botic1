import { useState, useEffect, useRef, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

const STEP = 0.55

function useFragReveal(threshold = 0.25, rootMargin = '0px') {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [active, setActive] = useState(reduced)
  const ref = useRef(null)
  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setActive(true); obs.disconnect() }
      },
      { threshold, rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, active]
}

export default function ChefSection() {
  const { t } = useTranslation()
  const [quoteRef, quoteActive] = useFragReveal(0.01, '0px 0px -76% 0px')
  const [sceneRef, sceneActive] = useFragReveal(0.01, '0px 0px -76% 0px')

  const frags = t('soul.frags', { returnObjects: true })

  return (
    <section
      ref={sceneRef}
      className={`mirada-xef-section chef-scene${sceneActive ? ' chef-scene-in' : ''}`}
      aria-label={t('soul.tab1')}
    >
      <div className="soul-photo-wrap">
        <img
          src="/images/albert-sastregener-cuina-emporda-girona.webp"
          alt=""
          className="soul-photo-img soul-img-1"
        />
        <div className="soul-overlay soul-overlay-1" aria-hidden="true" />
      </div>

      <div className="container-max soul-panel-inner">
        <div className="soul-panel-content">
          <span className="soul-eyebrow">{t('soul.tab1')}</span>
          <p className="soul-quote" ref={quoteRef}>
            {Array.isArray(frags) && frags.map((text, i) => (
              <Fragment key={i}>
                <span
                  className={`soul-frag${i === 1 ? ' accent' : ''}${quoteActive ? ' in' : ''}`}
                  style={{ '--d': `${(i * STEP).toFixed(2)}s` }}
                >{text}</span>{' '}
              </Fragment>
            ))}
          </p>
          <div className="soul-attribution">
            <div className="soul-sep" aria-hidden="true" />
            <span className="soul-author">{t('soul.attribution')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
