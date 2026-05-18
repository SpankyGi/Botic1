import { useState, useEffect, useRef, Fragment } from 'react'
import { Link } from 'react-router-dom'

// ── Fragment reveal (word-by-word quote animation) ────────────────────────────
const FRAGS = [
  { t: '"La cocina es un viaje.' },
  { t: 'Una manera de emocionar,', accent: true },
  { t: 'de hacer sentir,' },
  { t: 'de contar quiénes somos' },
  { t: 'a través de un plato."' },
]
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

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { num: '01', label: 'La mirada del xef' },
  { num: '02', label: 'El projecte' },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function SoulSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [quoteRef, quoteActive] = useFragReveal(0.22)

  return (
    <section className="soul-section">

      {/* ── Tab selector ── */}
      <div className="soul-tabs-wrap">
        <div className="container-max">
          <div className="soul-tabs" role="tablist" aria-label="Seccions de l'àrea">
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
                {FRAGS.map(({ t, accent }, i) => (
                  <Fragment key={i}>
                    <span
                      className={`soul-frag${accent ? ' accent' : ''}${quoteActive ? ' in' : ''}`}
                      style={{ '--d': `${(i * STEP).toFixed(2)}s` }}
                    >{t}</span>{' '}
                  </Fragment>
                ))}
              </p>
              <div className="soul-attribution">
                <div className="soul-sep" aria-hidden="true" />
                <span className="soul-author">— Albert Sastregener · Chef</span>
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
              alt="Albert Sastregener i Cristina Torrent, chef i sommelier de Bo.TiC"
              className="soul-photo-img soul-img-2"
            />
            <div className="soul-overlay soul-overlay-2" aria-hidden="true" />
          </div>

          <div className="container-max soul-panel-inner">
            <div className="soul-panel-content">
              <span className="soul-eyebrow">Dos Estrellas Michelin</span>
              <h2 className="soul-title">
                Nos apasiona<br />lo que hacemos
              </h2>
              <div className="soul-sep" aria-hidden="true" />
              <p className="soul-body">
                Albert Sastregener y Cristina Torrent, chef y sumiller respectivamente,
                ofrecen desde 2007 una propuesta gastronómica de autor y creativa,
                comprometida con la esencia de la cocina tradicional catalana.
              </p>
              <Link to="/restaurant" className="soul-cta">
                Saber más
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
