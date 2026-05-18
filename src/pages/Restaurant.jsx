import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CTA from '../components/CTA.jsx'

function PageHero({ img, alt, eyebrow, heading }) {
  return (
    <section
      className="relative flex items-end min-h-[60vh] md:min-h-[65vh] overflow-hidden bg-botic-dark pt-20"
      aria-label={eyebrow}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
        role="img"
        aria-label={alt}
      />
      <div className="absolute inset-0 bg-gradient-to-t
                      from-botic-black via-botic-black/60 to-botic-black/20" />
      <div className="relative z-10 container-max w-full pb-14 md:pb-20">
        <span className="label">{eyebrow}</span>
        <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl
                       text-botic-cream leading-[1.05] tracking-tight max-w-2xl">
          {heading}
        </h1>
      </div>
    </section>
  )
}

export default function Restaurant() {
  return (
    <>
      <SEO
        title="El Restaurant · Bo.TiC Corçà · Espai i Concepte"
        description="Bo.TiC és un restaurant gastronòmic a Corçà, Girona. Una masia del segle XVIII rehabilitada, amb una proposta culinària basada en el producte local de l'Empordà."
        canonical="https://www.bo-tic.com/restaurant"
      />

      <PageHero
        img="/images/restaurant-hero.jpg"
        alt="Façana del restaurant Bo.TiC a Corçà"
        eyebrow="El restaurant"
        heading="Un lloc on tot es cuida"
      />

      {/* ── El concepte ── */}
      <section className="bg-botic-ivory py-20 md:py-28 lg:py-32" aria-labelledby="concepte-heading">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionTitle
                theme="light"
                eyebrow="El concepte"
                as="h2"
                heading="Bo.TiC neix d'una premissa senzilla"
              />
              <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                              text-botic-text/70 leading-relaxed max-w-lg">
                <p>
                  Bo.TiC és, per damunt de tot, un lloc. Un espai on la cuina
                  pren forma de territori, de producte i de temps. Una proposta
                  gastronòmica que no renuncia a la memòria ni a la tècnica.
                </p>
                <p>
                  El xef Albert Sastregener ha construït al llarg dels anys una
                  cuina reconeixible, arrelada al paisatge de l'Empordà i oberta
                  als cicles naturals de cada temporada.
                </p>
                <p>
                  No es tracta de reinventar. Es tracta de cuinar amb criteri,
                  d'escollir bé i d'oferir a l'hoste una experiència que tingui
                  sentit des del primer plat fins a l'últim.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-96 md:h-[500px] overflow-hidden bg-botic-stone">
              <img
                src="/images/chef.jpg"
                alt="El xef Albert Sastregener a la cuina de Bo.TiC"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── L'espai ── */}
      <section className="bg-botic-black py-20 md:py-28" aria-labelledby="espai-heading">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image — esquerra en desktop */}
            <div className="order-2 lg:order-1 h-96 md:h-[520px] overflow-hidden bg-botic-surface">
              <img
                src="/images/sala-1.jpg"
                alt="Sala principal del restaurant Bo.TiC"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>

            <div className="order-1 lg:order-2">
              <SectionTitle
                theme="dark"
                eyebrow="L'espai"
                as="h2"
                heading="Pedra, fusta i llum natural"
              />
              <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                              text-botic-muted leading-relaxed max-w-lg">
                <p>
                  L'espai és una masia rehabilitada del segle XVIII, al nucli
                  antic de Corçà. La reforma ha respectat l'essència de la
                  construcció original: les pedres vistes, les bigues de fusta
                  i la relació de les estances amb la llum de l'Empordà.
                </p>
                <p>
                  Menjador petit, taules ben espaiades, ambient silenciós.
                  Un lloc preparat per a la concentració gastronòmica i per a
                  la conversa pausada.
                </p>
                <p>
                  L'atmosfera acompanya la cuina sense competir-hi.
                  Tot suma en la mateixa direcció.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Galeria d'espai ── */}
      <section className="bg-botic-dark" aria-label="Galeria del restaurant">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {[
            { src: '/images/sala-2.jpg',  alt: 'Detall de la sala de Bo.TiC' },
            { src: '/images/exterior.jpg', alt: 'Exterior del restaurant Bo.TiC a Corçà' },
            { src: '/images/detall.jpg',  alt: 'Detall decoratiu del restaurant Bo.TiC' },
          ].map(({ src, alt }) => (
            <div key={src} className="h-64 md:h-80 overflow-hidden bg-botic-surface">
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform
                           duration-700 hover:scale-105"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── El servei ── */}
      <section className="bg-botic-ivory py-20 md:py-28" aria-labelledby="servei-heading">
        <div className="container-max max-w-2xl mx-auto text-center">
          <span className="label-light text-center block">El servei</span>
          <h2
            id="servei-heading"
            className="font-serif font-light text-3xl md:text-4xl lg:text-5xl
                       text-botic-text leading-tight tracking-tight mt-4 mb-8"
          >
            L'hospitalitat és part del plat
          </h2>
          <p className="font-sans text-sm md:text-base text-botic-text/65 leading-relaxed mb-5">
            A Bo.TiC entenem el servei com una extensió natural de la cuina.
            L'equip de sala coneix cada ingredient, cada tècnica i cada decisió
            que hi ha darrere de cada plat.
          </p>
          <p className="font-sans text-sm md:text-base text-botic-text/65 leading-relaxed mb-10">
            La relació amb l'hoste és directa, propera i sense distàncies
            innecessàries. Volem que cada visita es recordi per allò que s'ha
            sentit, no només pel que s'ha menjat.
          </p>
          <Link to="/experiencia" className="btn-dark">
            L'experiència completa
          </Link>
        </div>
      </section>

      <CTA
        eyebrow="Reserva"
        heading="Assegureu la vostra taula"
        body="L'aforament del restaurant és reduït. Us recomanem reservar amb antelació."
        linkTo="/reserves"
        linkLabel="Reservar"
        theme="dark"
      />
    </>
  )
}
