import { useReveal } from '../hooks/useReveal'

export default function PhilosophyStrip() {
  const quoteRef  = useReveal()
  const authorRef = useReveal()

  return (
    <section className="philosophy">

      {/* Foto de fons — full bleed */}
      <div className="philo-photo-wrap" aria-hidden="true">
        {/* Desktop: nova foto horitzontal amb xef visible */}
        <img
          src="/images/albert-sastregener-cuina-emporda-girona.webp"
          alt=""
          className="philo-photo-img philo-photo-desktop"
        />
        {/* Mobile: foto original */}
        <img
          src="/images/albert-sastregener-cuina-emporda.webp"
          alt=""
          className="philo-photo-img philo-photo-mobile"
        />
        <div className="philo-overlay" />
      </div>

      {/* Contingut — per damunt de la foto */}
      <div className="philo-inner">
        <p className="philo-quote reveal" ref={quoteRef}>
          "La cocina es un viaje. Una manera de{' '}
          <span className="accent">emocionar</span>, de hacer sentir, de contar
          quiénes somos a través de un plato."
        </p>
        <div className="philo-sep" aria-hidden="true" />
        <div className="philo-author reveal" ref={authorRef}>
          — Albert Sastregener · Chef
        </div>
      </div>

    </section>
  )
}
