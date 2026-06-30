import { useState, useEffect, useRef, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLangRoutes } from '../i18n/LangContext'

const STEP = 0.55

function useFragReveal(threshold = 0.25) {
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
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, active]
}

export default function SoulSection() {
  const { t }    = useTranslation()
  const routes   = useLangRoutes()
  const [activeTab, setActiveTab]   = useState(0)
  const [quoteRef, quoteActive]     = useFragReveal(0.22)

  const frags = t('soul.frags', { returnObjects: true })
  const TABS = [
    { num: '01', label: t('soul.tab1') },
    { num: '02', label: t('soul.tab2') },
  ]

  return (
    <section className="soul-section">

      {/* ── Tab selector ── */}
      <div className="soul-tabs-wrap">
        <div className="container-max">
          <div className="soul-tabs" role="tablist" aria-label={t('soul.tabAria')}>
            {TABS.map(({ num, label }, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={activeTab === i}
                className={`soul-tab${activeTab === i ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                <span className="soul-tab-num">{num}</span>
                <span className="soul-tab-label">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panels ── */}
      <div className="soul-panels">

        {/* Panel 01 — La mirada del xef (quote) */}
        <div
          className={`soul-panel soul-panel-1${activeTab === 0 ? ' active' : ''}`}
          role="tabpanel"
          aria-hidden={activeTab !== 0}
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
        </div>

        {/* Panel 02 — El projecte (Albert & Cristina) */}
        <div
          className={`soul-panel soul-panel-2${activeTab === 1 ? ' active' : ''}`}
          role="tabpanel"
          aria-hidden={activeTab !== 1}
        >
          <div className="soul-photo-wrap">
            <img
              src="/images/cristina-albert-botic-emporda-michelin.webp"
              alt={t('soul.portraitAlt')}
              className="soul-photo-img soul-img-2"
            />
            <div className="soul-overlay soul-overlay-2" aria-hidden="true" />
          </div>

          <div className="container-max soul-panel-inner">
            <div className="soul-panel-content">
              <span className="soul-eyebrow">{t('soul.eyebrow')}</span>
              <h2 className="soul-title">
                {t('soul.title').split('\n').map((line, i, arr) => (
                  <Fragment key={i}>{line}{i < arr.length - 1 && <br />}</Fragment>
                ))}
              </h2>
              <div className="soul-sep" aria-hidden="true" />
              <p className="soul-body">{t('soul.body')}</p>
              <Link to={routes.restaurant} className="soul-cta">
                {t('soul.cta')}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
