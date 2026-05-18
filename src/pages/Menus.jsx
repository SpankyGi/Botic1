import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useReveal } from '../hooks/useReveal'
import { menus } from '../data/menus'

/* ── Descriptions editorials per a cada menú ── */
const DESCRIPTIONS = {
  esencia: "Una proposta concisa i directa. El millor del mercat, en format migdia: aperitius de barra i tres plats que expliquen la cuina de Bo.TiC sense excés ni artificis.",
  degustacion: "La proposta gastronòmica central de Bo.TiC. Una progressió de plats construïda al voltant del producte, la temporada i la memòria culinària de l'Empordà. El format que millor expressa la nostra cuina.",
  chef: "L'expressió màxima de la cuina de l'Albert Sastregener. Un recorregut complet per les elaboracions més representatives de Bo.TiC, pensat per als moments que mereixen ser recordats.",
}

/* ── Card editorial per a cada menú ── */
function MenuBlock({ menu, index }) {
  const { id, tag, title, price, aperitivoGroups, platos, postres } = menu
  const revealRef = useReveal()
  const isEven = index % 2 === 0

  return (
    <article
      ref={revealRef}
      className="reveal grid grid-cols-1 lg:grid-cols-2"
    >
      {/* Costat text */}
      <div
        className={[
          'flex flex-col justify-center p-10 md:p-16 lg:p-20',
          isEven ? 'bg-botic-dark' : 'bg-botic-surface',
          isEven ? 'lg:order-1' : 'lg:order-2',
        ].join(' ')}
      >
        <span className="label block mb-5">{tag}</span>

        <h2 className="font-serif font-light text-4xl md:text-5xl text-botic-cream
                       leading-[1.05] tracking-tight mb-6">
          Menú {title}
        </h2>

        <p className="font-sans text-sm md:text-base text-botic-muted leading-relaxed
                      mb-8 max-w-md">
          {DESCRIPTIONS[id]}
        </p>

        {/* Estructura del menú */}
        <div className="space-y-2.5 mb-10 border-l border-botic-border pl-5">
          {aperitivoGroups.map((g) => (
            <div key={g.cat} className="flex items-baseline gap-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-botic-gold
                               font-sans flex-shrink-0 w-20">
                {g.cat}
              </span>
              <span className="text-botic-muted text-xs font-sans">
                {g.items.length} elaboracions
              </span>
            </div>
          ))}
          <div className="flex items-baseline gap-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-botic-gold
                             font-sans flex-shrink-0 w-20">
              Plats
            </span>
            <span className="text-botic-muted text-xs font-sans">
              {platos.length} plats
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-botic-gold
                             font-sans flex-shrink-0 w-20">
              Postres
            </span>
            <span className="text-botic-muted text-xs font-sans">
              {postres.length} postres
            </span>
          </div>
        </div>

        {/* Peu: preu + CTA */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-botic-muted
                             font-sans block mb-1">
              Preu per persona
            </span>
            <span className="font-serif font-light text-4xl text-botic-gold leading-none">
              {price}
            </span>
          </div>
          <Link to="/reserves" className="btn-gold">
            Reservar
          </Link>
        </div>
      </div>

      {/* Costat decoratiu */}
      <div
        className={[
          'relative overflow-hidden min-h-[280px] lg:min-h-0 bg-botic-black',
          isEven ? 'lg:order-2' : 'lg:order-1',
        ].join(' ')}
        aria-hidden="true"
      >
        {/* Número decoratiu gran */}
        <div className="absolute inset-0 flex items-center justify-center select-none
                        pointer-events-none">
          <span className="font-serif font-light leading-none text-botic-surface"
                style={{ fontSize: 'clamp(140px, 20vw, 260px)' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Línia inferior amb nom del menú */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-botic-border
                        px-8 py-5 flex items-center justify-between">
          <span className="font-serif italic font-light text-lg text-botic-cream/50">
            {title}
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-botic-gold/60 font-sans">
            {tag}
          </span>
        </div>

        {/* Cantonades decoratives */}
        <span className="absolute top-4 left-4 w-8 h-8 border-t border-l border-botic-border/40" />
        <span className="absolute bottom-16 right-4 w-8 h-8 border-b border-r border-botic-border/40" />
      </div>
    </article>
  )
}

/* ── Bloc d'informació pràctica ── */
const PRACTICALS = [
  {
    icon: '◇',
    title: 'Reserva recomanada',
    text: "L'aforament de Bo.TiC és molt reduït. Recomanem reservar amb la màxima antelació possible, especialment per a caps de setmana i ocasions especials.",
  },
  {
    icon: '◈',
    title: 'Al·lèrgies i intoleràncies',
    text: "Indiqueu qualsevol al·lèrgia o intolerància alimentària en fer la reserva. L'equip s'adaptarà dins les possibilitats del menú i la disponibilitat de producte.",
  },
  {
    icon: '◉',
    title: 'Disponibilitat i temporada',
    text: "Els menús poden variar en funció de la disponibilitat del producte i de la temporada. La cuina de Bo.TiC és viva i es transforma amb el territori.",
  },
]

/* ── Pàgina ── */
export default function Menus() {
  const introRef     = useReveal()
  const maridatgeRef = useReveal()
  const infoRef      = useReveal()

  return (
    <>
      <SEO
        title="Menús · Bo.TiC · Restaurant Gastronòmic Corçà"
        description="Descobreix els menús de Bo.TiC, una experiència gastronòmica a Corçà basada en el producte, la temporada i l'alta cuina de l'Empordà."
        canonical="https://www.bo-tic.com/menus"
        ogImage="https://www.bo-tic.com/og-menus.jpg"
      />

      {/* ── Hero ── */}
      <section
        className="relative flex items-end min-h-[60vh] md:min-h-[65vh] overflow-hidden
                   bg-botic-dark pt-20"
        aria-label="Menús de Bo.TiC"
      >
        {/* Fons degradat */}
        <div className="absolute inset-0 bg-gradient-to-br
                        from-botic-black via-botic-dark to-botic-surface" />
        {/* Textura puntejada subtil */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(196,169,106,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 container-max w-full pb-14 md:pb-20">
          <span className="label block mb-4">Proposta gastronòmica</span>
          <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl
                         text-botic-cream leading-[1.05] tracking-tight max-w-3xl">
            Una manera d'entendre el territori, el producte i el temps a taula.
          </h1>
        </div>
      </section>

      {/* ── Introducció ── */}
      <section className="bg-botic-ivory py-20 md:py-28 lg:py-32"
               aria-labelledby="intro-heading">
        <div ref={introRef} className="container-max reveal" style={{ maxWidth: '768px' }}>
          <span className="label-light block mb-6">El format dels menús</span>
          <h2
            id="intro-heading"
            className="font-serif font-light text-3xl md:text-4xl text-botic-text
                       leading-tight tracking-tight mb-8"
          >
            Cada menú és un relat complet
          </h2>
          <div className="space-y-5 font-sans text-sm md:text-base text-botic-text/65
                          leading-relaxed">
            <p>
              A Bo.TiC els menús no són una llista de plats. Són una estructura pensada
              per construir una experiència de principi a fi: des del primer aperitiu fins
              a l'últim postre, tot segueix una lògica de territori, temporada i producte.
            </p>
            <p>
              L'Albert Sastregener dissenya cada menú com un relat gastronòmic coherent,
              on cada plat dialoga amb l'anterior i prepara el terreny per al següent.
              No hi ha plats desconnectats ni concessions gratuïtes.
            </p>
            <p>
              Bo.TiC ofereix tres propostes diferenciades per adaptar-se a cada moment,
              a cada ocasió i a cada voluntat d'aprofundiment en la cuina de l'Empordà.
            </p>
          </div>
        </div>
      </section>

      {/* ── Els menús ── */}
      <section className="bg-botic-black" aria-label="Els tres menús de Bo.TiC">
        {menus.map((menu, i) => (
          <MenuBlock key={menu.id} menu={menu} index={i} />
        ))}
      </section>

      {/* ── Maridatge ── */}
      <section className="bg-botic-dark py-20 md:py-28"
               aria-labelledby="maridatge-heading">
        <div ref={maridatgeRef} className="container-max reveal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="label block mb-6">El celler</span>
              <h2
                id="maridatge-heading"
                className="font-serif font-light text-3xl md:text-4xl text-botic-cream
                           leading-tight tracking-tight mb-8"
              >
                Maridatge de vins
              </h2>
              <div className="space-y-5 font-sans text-sm md:text-base text-botic-muted
                              leading-relaxed">
                <p>
                  Per a cada menú, Bo.TiC ofereix la possibilitat d'un maridatge de vins
                  pensat específicament per acompanyar la progressió dels plats.
                </p>
                <p>
                  La selecció prioritza vins de l'Empordà i de les denominacions
                  d'origen catalanes, complementada amb referències d'interès.
                  L'objectiu és que el vi amplifiqui el que hi ha al plat, mai que el tapi.
                </p>
                <p className="text-[11px] tracking-[0.2em] uppercase text-botic-border">
                  Consulteu disponibilitat i preu en fer la reserva
                </p>
              </div>
            </div>

            {/* Decoració central */}
            <div className="flex items-center justify-center py-12 lg:py-0"
                 aria-hidden="true">
              <div className="text-center">
                <div className="w-px h-16 bg-botic-border mx-auto mb-6" />
                <span className="font-serif font-light text-botic-surface block leading-none"
                      style={{ fontSize: 'clamp(60px, 10vw, 100px)' }}>
                  ✦
                </span>
                <div className="w-px h-16 bg-botic-border mx-auto mt-6 mb-4" />
                <p className="font-sans text-[10px] tracking-[0.4em] uppercase
                              text-botic-muted">
                  Selecció de vins
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Informació pràctica ── */}
      <section className="bg-botic-ivory py-20 md:py-28"
               aria-labelledby="info-heading">
        <div ref={infoRef} className="container-max reveal">
          <span className="label-light block mb-6">Informació pràctica</span>
          <h2
            id="info-heading"
            className="font-serif font-light text-3xl md:text-4xl text-botic-text
                       leading-tight tracking-tight mb-12"
          >
            Abans de venir
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-botic-stone/50">
            {PRACTICALS.map(({ icon, title, text }) => (
              <div key={title} className="bg-botic-ivory p-8 md:p-10">
                <span className="font-serif text-2xl text-botic-gold block mb-4"
                      aria-hidden="true">
                  {icon}
                </span>
                <h3 className="font-serif font-light text-xl text-botic-text
                               tracking-tight mb-3">
                  {title}
                </h3>
                <p className="font-sans text-sm text-botic-text/60 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/reserves" className="btn-dark menus-btn-dark">
              Consultar disponibilitat
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="bg-botic-black py-24 md:py-32 text-center">
        <div className="container-max">
          <span className="label block mb-4">Reserva</span>
          <h2 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl
                         text-botic-cream leading-tight tracking-tight mb-6">
            Assegureu la vostra taula
          </h2>
          <p className="font-sans text-sm md:text-base text-botic-muted leading-relaxed
                        max-w-md mx-auto mb-10">
            L'aforament és reduït. Cada servei és una oportunitat única d'experimentar
            la cuina de Bo.TiC.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/reserves" className="btn-gold">
              Reservar taula
            </Link>
            <a href="tel:+34972630869" className="btn-cream">
              +34 972 630 869
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
