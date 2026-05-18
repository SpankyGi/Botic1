import { useState, useEffect, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

// Cada paraula és una unitat d'animació independent
const WORDS = [
  { t: '"La' },      { t: 'cocina' },  { t: 'es' },      { t: 'un' },
  { t: 'viaje.' },   { t: 'Una' },     { t: 'manera' },  { t: 'de' },
  { t: 'emocionar,', accent: true },
  { t: 'de' },       { t: 'hacer' },   { t: 'sentir,' },
  { t: 'de' },       { t: 'contar' },  { t: 'quiénes' },
  { t: 'somos' },    { t: 'a' },       { t: 'través' },
  { t: 'de' },       { t: 'un' },      { t: 'plato."' },
]

const STEP = 0.11 // segons entre paraules

function useWordReveal(threshold = 0.30) {
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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, active]
}

export default function PhilosophyStrip() {
  const [quoteRef, quoteActive] = useWordReveal(0.30)
  const authorRef = useReveal()

  return (
    <section className="philosophy">

      {/* Foto de fons — full bleed */}
      <div className="philo-photo-wrap" aria-hidden="true">
        <img
          src="/images/albert-sastregener-cuina-emporda-girona.webp"
          alt=""
          className="philo-photo-img philo-photo-desktop"
        />
        <img
          src="/images/albert-sastregener-cuina-emporda.webp"
          alt=""
          className="philo-photo-img philo-photo-mobile"
        />
        <div className="philo-overlay" />
      </div>

      {/* Contingut */}
      <div className="container-max philo-container">
        <div className="philo-inner">

          {/* Cita amb reveal paraula per paraula */}
          <p className="philo-quote" ref={quoteRef}>
            {WORDS.map(({ t, accent }, i) => (
              <span
                key={i}
                className={`philo-word${accent ? ' accent' : ''}${quoteActive ? ' in' : ''}`}
                style={{ '--d': `${(i * STEP).toFixed(2)}s` }}
              >
                {t}{' '}
              </span>
            ))}
          </p>

          {/* Firma: apareix un cop la cita ha acabat */}
          <div className="philo-attribution reveal" ref={authorRef}>
            <div className="philo-sep" aria-hidden="true" />
            <div className="philo-author">— Albert Sastregener · Chef</div>
          </div>

        </div>
      </div>

    </section>
  )
}
