import { useReveal } from '../hooks/useReveal'

export default function PhilosophyStrip() {
  const quoteRef  = useReveal()
  const authorRef = useReveal()

  return (
    <section className="philosophy">
      <p className="philo-quote reveal" ref={quoteRef}>
        "La cocina es un viaje. Una manera de{' '}
        <span className="accent">emocionar</span>, de hacer sentir, de contar
        quiénes somos a través de un plato."
      </p>
      <div className="philo-author reveal" ref={authorRef}>
        — Albert Sastregener · Chef
      </div>
    </section>
  )
}
