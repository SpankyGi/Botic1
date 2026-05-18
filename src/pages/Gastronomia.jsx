import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CTA from '../components/CTA.jsx'

function PageHero({ img, alt, eyebrow, heading, subheading }) {
  return (
    <section
      className="relative flex items-end min-h-[60vh] md:min-h-[70vh] overflow-hidden
                 bg-botic-dark pt-20"
      aria-label={eyebrow}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
        role="img"
        aria-label={alt}
      />
      <div className="absolute inset-0 bg-gradient-to-t
                      from-botic-black via-botic-black/55 to-botic-black/15" />
      <div className="relative z-10 container-max w-full pb-14 md:pb-20 max-w-3xl">
        <span className="label">{eyebrow}</span>
        <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl
                       text-botic-cream leading-[1.05] tracking-tight">
          {heading}
        </h1>
        {subheading && (
          <p className="mt-5 font-sans text-sm md:text-base text-botic-stone/75
                        leading-relaxed max-w-lg">
            {subheading}
          </p>
        )}
      </div>
    </section>
  )
}

const GALLERY = [
  { src: '/images/plat-1.jpg', alt: 'Plat de temporada de Bo.TiC'              },
  { src: '/images/plat-2.jpg', alt: 'Preparació culinària al restaurant Bo.TiC' },
  { src: '/images/plat-3.jpg', alt: 'Plat principal del menú de Bo.TiC'         },
  { src: '/images/plat-4.jpg', alt: 'Postres del restaurant Bo.TiC'             },
]

export default function Gastronomia() {
  return (
    <>
      <SEO
        title="Gastronomia · Bo.TiC · Alta Cuina de l'Empordà"
        description="La cuina de Bo.TiC treballa amb producte local de l'Empordà, tècnica depurada i memòria gastronòmica. Restaurant Michelin a Corçà, Girona. Costa Brava."
        canonical="https://www.bo-tic.com/gastronomia"
      />

      <PageHero
        img="/images/gastronomia-hero.jpg"
        alt="Plat del menú degustació de Bo.TiC"
        eyebrow="Gastronomia"
        heading="El producte és la primera decisió"
        subheading="Tot el que arriba a la cuina porta una adreça, un pagès i una temporada."
      />

      {/* ── El producte ── */}
      <section className="bg-botic-ivory py-20 md:py-28 lg:py-32" aria-labelledby="producte-heading">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div>
              <SectionTitle
                theme="light"
                eyebrow="El producte"
                as="h2"
                heading="La matèria primera mana"
              />
              <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                              text-botic-text/68 leading-relaxed">
                <p>
                  Treballem amb productors de proximitat amb qui hem construït
                  una relació de confiança al llarg dels anys. Sabem d'on ve cada
                  ingredient, com s'ha criat o conreat, i en quin moment del seu
                  cicle és millor.
                </p>
                <p>
                  La temporada no és una tendència: és una manera d'entendre la
                  cuina. El menú canvia quan canvia el que ofereix la terra, no
                  quan canvia el calendari d'algun expert extern.
                </p>
                <p>
                  Verdura de pagès, peix de la llotja de Palamós, carns de
                  raça autòctona, bolets de tardor, oli d'oliva arbequina de
                  l'Alt Empordà. Ingredients que no necessiten explicació perquè
                  parlen per si mateixos.
                </p>
              </div>
            </div>

            <div className="h-96 md:h-[520px] overflow-hidden bg-botic-stone">
              <img
                src="/images/producte.jpg"
                alt="Producte de temporada al restaurant Bo.TiC de l'Empordà"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── El territori ── */}
      <section className="bg-botic-black" aria-labelledby="territori-heading">
        {/* Full-width image */}
        <div className="h-72 md:h-[480px] overflow-hidden bg-botic-surface">
          <img
            src="/images/territori.jpg"
            alt="Paisatge de l'Empordà, territori del restaurant Bo.TiC"
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.opacity = '0' }}
          />
        </div>

        <div className="container-max py-16 md:py-24">
          <div className="max-w-2xl">
            <SectionTitle
              theme="dark"
              eyebrow="El territori"
              as="h2"
              heading="L'Empordà com a despensa"
            />
            <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                            text-botic-muted leading-relaxed">
              <p>
                L'Empordà és la nostra despensa i el nostre horitzó. Un territori
                d'una riquesa agroalimentària excepcional: hortalisses de regadiu,
                vinyes, oliveres, pesca artesanal, bolets i una tradició culinària
                que porta segles d'acumulació de saber.
              </p>
              <p>
                Bo.TiC no podria existir en cap altre lloc. La seva cuina és filla
                d'aquest paisatge, d'aquest clima i d'aquesta gent. El restaurnat
                és, en última instància, una manera de retre homenatge a tot això.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Galeria editorial ── */}
      <section className="bg-botic-dark" aria-label="Galeria gastronòmica de Bo.TiC">
        {/* Layout asimètric: 1 gran esquerra + 2 apilades dreta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {/* Imatge gran */}
          <div className="h-72 md:h-auto md:row-span-2 overflow-hidden bg-botic-surface">
            <img
              src={GALLERY[0].src}
              alt={GALLERY[0].alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => { e.target.style.opacity = '0' }}
            />
          </div>
          {/* Dues petites */}
          {GALLERY.slice(1, 3).map(({ src, alt }) => (
            <div key={src} className="h-56 md:h-auto overflow-hidden bg-botic-surface">
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>
          ))}
        </div>
        {/* Quarta imatge full-width */}
        <div className="h-64 md:h-96 overflow-hidden bg-botic-surface mt-0.5">
          <img
            src={GALLERY[3].src}
            alt={GALLERY[3].alt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            onError={(e) => { e.target.style.opacity = '0' }}
          />
        </div>
      </section>

      {/* ── La tècnica ── */}
      <section className="bg-botic-ivory py-20 md:py-28" aria-labelledby="tecnica-heading">
        <div className="container-max">
          <div className="max-w-2xl mx-auto text-center">
            <SectionTitle
              theme="light"
              eyebrow="La tècnica"
              as="h2"
              heading="Aplicada amb mesura"
              align="center"
            />
            <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                            text-botic-text/65 leading-relaxed">
              <p>
                La tècnica no és un fi en si mateixa. A Bo.TiC la tècnica és un
                mitjà: una manera d'expressar millor el que el producte ja porta
                dins. La cuina moderna ens ha donat eines extraordinàries, però
                l'únic criteri per aplicar-les és si milloren o no allò que
                volem posar al plat.
              </p>
              <p>
                No hi ha ostentació tècnica gratuïta. Cada preparació ha de tenir
                sentit en el context del menú, de la temporada i de l'ingredient
                principal. La senzillesa aparent és, gairebé sempre, la resolució
                tècnica més exigent.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTA
        eyebrow="El menú"
        heading="Viviu l'experiència completa"
        body="El menú degustació de Bo.TiC és el format que millor expressa la nostra cuina. Reserveu amb antelació."
        linkTo="/reserves"
        linkLabel="Reservar taula"
        secondaryLink="/experiencia"
        secondaryLabel="L'experiència"
        theme="dark"
      />
    </>
  )
}
