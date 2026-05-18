import { Link } from 'react-router-dom'
import Hero            from '../components/Hero'
import MarqueeStrip    from '../components/MarqueeStrip'
import PhilosophyStrip from '../components/PhilosophyStrip'
import ChefStrip       from '../components/ChefStrip'
import SEO             from '../components/SEO'
import { useReveal }   from '../hooks/useReveal'

const FEATURES = [
  {
    tag:   'El Restaurant',
    title: 'Un espai pensat per a la taula',
    body:  'Una masia del segle XVIII al nucli de Corçà. Pedra, fusta i llum natural al servei de la gastronomia.',
    to:    '/restaurant',
    label: 'Descobrir',
  },
  {
    tag:   'Gastronomia',
    title: 'El producte és la primera decisió',
    body:  "La cuina de Bo.TiC neix de l'Empordà. Temporada, tècnica i memòria en cada plat.",
    to:    '/gastronomia',
    label: 'La cuina',
  },
  {
    tag:   "L'Experiència",
    title: 'Un ritme propi. Un relat complet.',
    body:  "Menú degustació, sala i hospitalitat. Una experiència que comença amb el primer aperitiu i no s'acaba fins al comiat.",
    to:    '/experiencia',
    label: "L'experiència",
  },
]

export default function Home() {
  const ctaRef      = useReveal(0.18)
  const featuresRef = useReveal(0.12)

  return (
    <>
      <SEO
        title="Bo.TiC · Restaurant Gastronòmic · Corçà · Empordà"
        description="Bo.TiC, restaurant gastronòmic de 2 estrelles Michelin a Corçà (Girona). Cuina d'arrel, producte local i experiència gastronòmica única a l'Empordà."
        canonical="https://www.bo-tic.com/"
      />

      <Hero />
      <MarqueeStrip />

      {/* ── Intro ── */}
      <section className="home-intro">

        {/* Foto — panel dret */}
        <div className="home-intro-photo" aria-hidden="true">
          <img
            src="/images/restaurant-emporda-michelin-girona.webp"
            alt=""
            className="home-intro-img"
          />
          <div className="home-intro-overlay" />
        </div>

        {/* Text — esquerra */}
        <div className="container-max home-intro-inner">
          <div className="home-intro-content">
            <span className="home-intro-label">Bo.TiC · Corçà · Empordà</span>
            <h2 className="font-serif font-light leading-tight tracking-tight home-intro-title">
              Cuina amb arrel.<br />Experiència sense igual.
            </h2>
            <p className="font-sans home-intro-body">
              Bo.TiC és un restaurant gastronòmic de referència a l'Empordà. Dos estels Michelin,
              una masia rehabilitada i una cuina que entén el territori com a primera matèria.
            </p>
          </div>
        </div>

      </section>

      {/* ── Feature cards ── */}
      <section className="features-section" ref={featuresRef} aria-label="Descobreix Bo.TiC">
        <div className="container-max">
          <div className="features-grid">
            {FEATURES.map(({ tag, title, body, to, label }, i) => (
              <Link key={to} to={to} className="feature-card" style={{ '--i': i }}>
                <span className="feature-tag">{tag}</span>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-body">{body}</p>
                <span className="feature-cta">{label} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PhilosophyStrip />
      <ChefStrip />

      {/* ── CTA Reserva ── */}
      <section className="home-reserva-cta">
        <div className="container-max reveal" ref={ctaRef}>
          <span className="label block">Reserva</span>
          <h2 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl
                         text-botic-cream leading-tight tracking-tight mt-4 mb-6">
            Assegureu la vostra taula
          </h2>
          <p className="font-sans text-sm md:text-base leading-relaxed
                        max-w-md mx-auto mb-10">
            L'aforament del restaurant és reduït. Us recomanem reservar amb antelació.
          </p>
          <Link to="/reserves" className="btn-gold">Reservar ara</Link>
        </div>
      </section>
    </>
  )
}
