import { Link } from 'react-router-dom'
import Hero            from '../components/Hero'
import MarqueeStrip    from '../components/MarqueeStrip'
import PhilosophyStrip from '../components/PhilosophyStrip'
import SEO             from '../components/SEO'

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
      <section className="bg-botic-ivory py-20 md:py-28 lg:py-32">
        <div className="container-max text-center" style={{ maxWidth: '640px' }}>
          <span className="label-light block">Bo.TiC · Corçà · Empordà</span>
          <h2 className="font-serif font-light text-3xl md:text-5xl text-botic-text
                         leading-tight tracking-tight mt-4">
            Cuina amb arrel.<br />Experiència sense igual.
          </h2>
          <p className="mt-6 font-sans text-sm md:text-base text-botic-text/65 leading-relaxed">
            Bo.TiC és un restaurant gastronòmic de referència a l'Empordà. Dos estels Michelin,
            una masia rehabilitada i una cuina que entén el territori com a primera matèria.
          </p>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="bg-botic-black" aria-label="Descobreix Bo.TiC">
        <div className="features-grid">
          {FEATURES.map(({ tag, title, body, to, label }) => (
            <Link key={to} to={to} className="feature-card">
              <span className="feature-tag">{tag}</span>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-body">{body}</p>
              <span className="feature-cta">{label} →</span>
            </Link>
          ))}
        </div>
      </section>

      <PhilosophyStrip />

      {/* ── CTA Reserva ── */}
      <section className="bg-botic-dark py-24 md:py-32 text-center">
        <div className="container-max">
          <span className="label block">Reserva</span>
          <h2 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl
                         text-botic-cream leading-tight tracking-tight mt-4 mb-6">
            Assegureu la vostra taula
          </h2>
          <p className="font-sans text-sm md:text-base text-botic-muted leading-relaxed
                        max-w-md mx-auto mb-10">
            L'aforament del restaurant és reduït. Us recomanem reservar amb antelació.
          </p>
          <Link to="/reserves" className="btn-gold">Reservar ara</Link>
        </div>
      </section>
    </>
  )
}
