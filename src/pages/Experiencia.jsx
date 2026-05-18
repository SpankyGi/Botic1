import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CTA from '../components/CTA.jsx'

function PageHero() {
  return (
    <section
      className="relative flex items-end min-h-[60vh] md:min-h-[65vh] overflow-hidden
                 bg-botic-dark pt-20"
      aria-label="L'experiència a Bo.TiC"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/experiencia-hero.jpg)' }}
        role="img"
        aria-label="Sala del restaurant Bo.TiC durant el servei"
      />
      <div className="absolute inset-0 bg-gradient-to-t
                      from-botic-black via-botic-black/55 to-botic-black/15" />
      <div className="relative z-10 container-max w-full pb-14 md:pb-20">
        <span className="label">L'experiència</span>
        <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl
                       text-botic-cream leading-[1.05] tracking-tight max-w-2xl">
          Un ritme propi. Un relat complet.
        </h1>
      </div>
    </section>
  )
}

const MENU_MOMENTS = [
  {
    num: '01',
    label: "L'entrada",
    text:  "Els primers passos del menú: aperitius que estableixen el to, el territori i la temporada. Una introducció que obre l'apetit i la conversa.",
  },
  {
    num: '02',
    label: 'El cos',
    text:  "Els plats centrals del menú, on la cuina parla amb més profunditat. Producte principal, tècnica i memòria gastronòmica en la seva expressió màxima.",
  },
  {
    num: '03',
    label: 'La dolçor',
    text:  "Un tancament que no és un simple final. Les postres de Bo.TiC segueixen la mateixa lògica de territori i temporada que la resta del menú.",
  },
  {
    num: '04',
    label: 'El comiat',
    text:  "Petites elaboracions que allarguen el plaer. Un últim record del menú per endur-se cap a casa.",
  },
]

export default function Experiencia() {
  return (
    <>
      <SEO
        title="L'Experiència · Bo.TiC · Menú Degustació Empordà"
        description="L'experiència gastronòmica de Bo.TiC: menú degustació, sala, equip i hospitalitat. Restaurant Michelin a Corçà, Girona. Alta cuina de l'Empordà."
        canonical="https://www.bo-tic.com/experiencia"
      />

      <PageHero />

      {/* ── El ritme ── */}
      <section className="bg-botic-ivory py-20 md:py-28 lg:py-32" aria-labelledby="ritme-heading">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <SectionTitle
                theme="light"
                eyebrow="El ritme de la taula"
                as="h2"
                heading="Sense pressa. Amb intensitat."
              />
              <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                              text-botic-text/68 leading-relaxed">
                <p>
                  Una taula a Bo.TiC segueix el seu propi ritme. No hi ha pressa.
                  El menú degustació s'entén com un relat que comença, s'estableix,
                  sorprèn i tanca.
                </p>
                <p>
                  L'equip de sala acompanya aquest procés amb naturalitat i
                  coneixement, sense excés de protocol ni distàncies innecessàries.
                  Cada plat arriba quan ha d'arribar. Cada explicació es dona
                  quan afegeix valor.
                </p>
                <p>
                  La durada d'un servei a Bo.TiC és variable. Deixem que
                  l'experiència prengui el temps que necessita.
                </p>
              </div>
            </div>

            <div className="h-96 md:h-[520px] overflow-hidden bg-botic-stone">
              <img
                src="/images/sala-1.jpg"
                alt="Sala del restaurant Bo.TiC preparada per al servei"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Estructura del menú ── */}
      <section className="bg-botic-black py-20 md:py-28" aria-labelledby="menu-heading">
        <div className="container-max">
          <div className="max-w-xl mb-14">
            <SectionTitle
              theme="dark"
              eyebrow="El menú"
              as="h2"
              heading="Una estructura pensada com un relat"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
            {MENU_MOMENTS.map(({ num, label, text }) => (
              <div
                key={num}
                className="border border-botic-border p-8 md:p-10
                           hover:border-botic-gold/40 transition-colors duration-300"
              >
                <span className="font-serif text-5xl font-light text-botic-surface
                                 block mb-4 leading-none">
                  {num}
                </span>
                <h3 className="font-serif font-light text-xl text-botic-cream
                               mb-3 tracking-tight">
                  {label}
                </h3>
                <p className="font-sans text-sm text-botic-muted leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 font-sans text-xs text-botic-muted tracking-[0.15em] uppercase">
            El menú pot variar segons la temporada i la disponibilitat del producte.
          </p>
        </div>
      </section>

      {/* ── L'equip ── */}
      <section className="bg-botic-dark py-20 md:py-28" aria-labelledby="equip-heading">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="h-80 md:h-[480px] overflow-hidden bg-botic-surface">
              <img
                src="/images/equip.jpg"
                alt="Equip del restaurant Bo.TiC"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>

            <div>
              <SectionTitle
                theme="dark"
                eyebrow="L'equip"
                as="h2"
                heading="Petit, format i compromès"
              />
              <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                              text-botic-muted leading-relaxed">
                <p>
                  L'Albert Sastregener lidera la cuina des de la fundació del
                  restaurant. Al seu costat, un equip reduït que entén que
                  l'hospitalitat és tan important com el que arriba al plat.
                </p>
                <p>
                  La sala la dirigeix un equip amb un coneixement profund de la
                  carta, dels vins i dels productors. La complicitat entre
                  cuina i sala es percep en cada servei.
                </p>
                <p>
                  La mida reduïda de l'equip no és una limitació: és una decisió.
                  Permet un control absolut de l'experiència i una relació més
                  directa i genuïna amb cada hoste.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Els vins ── */}
      <section className="bg-botic-black py-16 md:py-20">
        <div className="container-max max-w-3xl text-center">
          <span className="label block text-center">El celler</span>
          <h2
            className="font-serif font-light text-3xl md:text-4xl lg:text-5xl
                       text-botic-cream leading-tight tracking-tight mt-4 mb-8"
          >
            Una selecció de vins pensada per acompanyar
          </h2>
          <p className="font-sans text-sm md:text-base text-botic-muted leading-relaxed mb-5">
            El celler de Bo.TiC és una selecció personal de vins de l'Empordà
            i de les millors denominacions d'origen catalanes, complementada amb
            referències internacionals d'interès.
          </p>
          <p className="font-sans text-sm md:text-base text-botic-muted leading-relaxed mb-10">
            Oferim també un maridatge de vins pensat específicament per
            acompanyar el menú degustació de cada temporada.
          </p>
        </div>
      </section>

      <CTA
        eyebrow="Reserva"
        heading="Reserveu la vostra experiència"
        body="Cada servei és un espai limitat. No espereu l'últim moment."
        linkTo="/reserves"
        linkLabel="Reservar taula"
        theme="dark"
      />
    </>
  )
}
