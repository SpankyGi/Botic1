import { useState, useId, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { menus } from '../data/menus'

const PENDING = '[pendent de revisar]'

const HERO_IMG = '/images/Albert Sastregener-empordà-botic-restaurant.webp'

/* ── Hero ───────────────────────────────────────────────────── */
function MenusHero() {
  return (
    <section
      className="relative flex items-end overflow-hidden bg-botic-black pt-24"
      style={{ minHeight: '72vh' }}
      aria-label="Menús de Bo.TiC"
    >
      {/* Fotografia de fons */}
      <img
        src={HERO_IMG}
        alt=""
        aria-hidden="true"
        className="mnu-hero-img absolute inset-0 w-full h-full object-cover object-center"
        style={{ objectPosition: '60% 20%' }}
      />

      {/* Overlay cinematogràfic: fosc baix + lateral esquerra */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.18) 100%)',
            'linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.40) 42%, rgba(0,0,0,0.10) 72%, rgba(0,0,0,0) 100%)',
          ].join(', '),
        }}
      />

      {/* Línia horitzontal inferior */}
      <div className="absolute bottom-0 left-0 right-0 mnu-hero-border-line" />

      <div className="relative z-10 container-max w-full pb-14 md:pb-20">
        <span className="menus-hero-label label block mb-6">
          Menús
        </span>
        <h1
          className="menus-hero-title font-serif font-light italic text-botic-cream"
          style={{
            fontSize:  'clamp(26px, 4.2vw, 58px)',
            lineHeight: 1.18,
            maxWidth:   '560px',
          }}
        >
          Tres maneres d'apropar-se a l'univers gastronòmic de Bo.TiC.
        </h1>
        <p
          className="menus-hero-sub font-sans font-light text-botic-cream/65
                     mt-5"
          style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', letterSpacing: '0.20em' }}
        >
          DEGUSTACIÓ · CHEF · ESSÈNCIA
        </p>

        {/* Ornament sota el subtítol */}
        <div className="menus-hero-ornament">
          <span className="mnu-orn-line" />
          <span className="mnu-orn-glyph">✦</span>
          <span className="mnu-orn-line" />
        </div>
      </div>
    </section>
  )
}

/* ── Accordion de secció ────────────────────────────────────── */
function SectionAccordion({ section, menuId }) {
  const [open, setOpen]       = useState(false)
  const [openKey, setOpenKey] = useState(0)
  const id     = useId()
  const bodyId = `${id}-body`

  const toggle = () => {
    if (!open) setOpenKey(k => k + 1)
    setOpen(o => !o)
  }

  return (
    <div className={`mnu-section${open ? ' is-open' : ''}`}>
      <button
        className="mnu-section-trigger"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        {/* Punt decoratiu borgonya */}
        <span className="mnu-section-dot" aria-hidden="true" />

        <span className="mnu-section-title">{section.title}</span>

        <span className="mnu-section-count" aria-hidden="true">
          {section.items.length}
        </span>
        <span className="mnu-section-icon" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>

      <div
        id={bodyId}
        className={`mnu-section-body${open ? ' open' : ''}`}
        role="region"
        aria-labelledby={`${id}-trigger`}
      >
        <div className="mnu-section-inner">
          {/* Accent borgonya lateral quan és obert */}
          <div className="mnu-section-accent" aria-hidden="true" />

          <ul key={openKey} className="mnu-dish-list">
            {section.items.map((item, i) => (
              <li
                key={`${menuId}-${section.title}-${i}`}
                className="mnu-dish"
                style={{ animationDelay: `${60 + i * 55}ms` }}
              >
                <span className="mnu-dish-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="mnu-dish-content">
                  <h4 className="mnu-dish-name">{item.name}</h4>
                  {item.description !== PENDING && (
                    <p className="mnu-dish-desc">{item.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ── Hook reveal per IntersectionObserver ──────────────────── */
function useReveal(threshold = 0.15) {
  const reduced = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [visible, setVisible] = useState(reduced)
  const ref = useRef(null)

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, visible]
}

/* ── Hook count-up ─────────────────────────────────────────── */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)
  const hasRun  = useRef(false)
  const ref     = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setCount(target); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return
        hasRun.current = true
        observer.disconnect()

        const start = performance.now()
        const tick  = (now) => {
          const t     = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)   // cubic ease-out
          setCount(Math.round(eased * target))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.35 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { count, ref }
}

/* ── Carta de Vinos ─────────────────────────────────────────── */
function WineSection() {
  const { count, ref: statRef } = useCountUp(900, 1250)
  const [colRef,  colVisible]   = useReveal(0.12)
  const [divRef,  divVisible]   = useReveal(0.50)

  return (
    <section className="wine-section" aria-labelledby="wine-heading">

      {/* Foto de fons — panel dret */}
      <div className="wine-photo-wrap" aria-hidden="true">
        <img
          src="/images/restaurant-emporda-botic-michelin.webp"
          alt=""
          className="wine-photo-img"
        />
        <div className="wine-photo-overlay" />
      </div>

      {/* Trama atmosfèrica */}
      <div className="wine-bg-texture" aria-hidden="true" />

      <div className="container-max wine-inner">
        <div className={`wine-col-left${colVisible ? ' is-visible' : ''}`} ref={colRef}>
          <span className="wine-label">Maridatge · Bodega</span>

          <div className="wine-stat" ref={statRef}>
            <span className="wine-stat-num" aria-label="Más de 900 referencias">
              {count}<span className="wine-stat-plus" aria-hidden="true">+</span>
            </span>
            <span
              className="wine-stat-desc"
              style={{
                opacity:    count > 0 ? 1 : 0,
                transform:  count > 0 ? 'translateY(0)' : 'translateY(6px)',
                transition: 'opacity 0.5s ease 1.05s, transform 0.5s ease 1.05s',
              }}
            >
              referencias de todo el mundo
            </span>
          </div>

          <div className={`wine-divider${divVisible ? ' in-view' : ''}`} ref={divRef} aria-hidden="true" />

          <h2 id="wine-heading" className="wine-title">
            Carta<br />de vinos
          </h2>

          <div className="wine-ornament" aria-hidden="true">
            <span className="wine-orn-line" />
            <span className="wine-orn-glyph">◈</span>
            <span className="wine-orn-line" />
          </div>

          <p className="wine-lead">
            Tenemos una amplia carta de vinos con más de 900 referencias de diferentes países.
          </p>
          <p className="wine-body">
            España, Portugal, Francia, Italia, Alemania, Austria, Grecia, Líbano, Moldavia,
            Australia, Sudáfrica, Argentina, Chile, Uruguay, Bolivia, Estados Unidos y Nueva
            Zelanda, siempre en busca de los mejores vinos con el objetivo de configurar
            nuestra bodega.
          </p>
          <p className="wine-body">
            Una bodega versátil con numerosas D.O. y con referencias de todas partes, cada
            una de ellas con una fuerte personalidad.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Informació pràctica ─────────────────────────────────────── */
const INFO_ITEMS = [
  {
    num: '01',
    text: 'Los menús no incluyen la bebida.',
  },
  {
    num: '02',
    text: 'Los menús se servirán a mesas completas.',
  },
  {
    num: '03',
    text: 'Los menús se pueden modificar según mercado o novedad, pero respetando su estructura.',
  },
]

function InfoSection() {
  const [gridRef, gridVisible] = useReveal(0.15)

  return (
    <section className="info-section" aria-label="Informació pràctica dels menús">
      <div className="container-max">
        <div className={`info-grid${gridVisible ? ' revealed' : ''}`} ref={gridRef}>
          {INFO_ITEMS.map(({ num, text }, i) => (
            <div
              key={num}
              className="info-card"
              style={{ '--i': i }}
            >
              <span className="info-num" aria-hidden="true">{num}</span>
              <p className="info-text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── FAQ Section ────────────────────────────────────────────── */
const FAQS = [
  {
    q: '¿Los menús incluyen la bebida?',
    a: 'No, los menús no incluyen la bebida. La bebida y el maridaje se pueden elegir aparte según la experiencia deseada.',
  },
  {
    q: '¿Los menús se sirven a mesa completa?',
    a: 'Sí, los menús se sirven a mesa completa para mantener el ritmo y la coherencia de la experiencia gastronómica.',
  },
  {
    q: '¿El menú puede cambiar?',
    a: 'Sí, la propuesta puede variar según temporada, mercado o novedades del restaurante, siempre respetando la estructura del menú.',
  },
  {
    q: '¿Es necesario reservar?',
    a: 'Sí, recomendamos reservar con antelación para asegurar disponibilidad y preparar la experiencia con el máximo cuidado.',
  },
  {
    q: '¿Dónde está ubicado Bo.TiC?',
    a: 'Bo.TiC está situado en Corçà, en el Empordà, en una masía rehabilitada donde conviven territorio, cocina de autor y hospitalidad.',
  },
  {
    q: '¿Hay opción de maridaje?',
    a: 'La experiencia puede acompañarse con una selección de vinos de nuestra bodega, con más de 900 referencias de diferentes países.',
  },
  {
    q: '¿Cuál es la diferencia entre los menús?',
    a: 'Cada menú propone una manera distinta de acercarse al universo gastronómico de Bo.TiC: desde una experiencia más esencial hasta una propuesta más completa y gastronómica.',
  },
]

function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null)

  // Schema.org FAQPage
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'faq-schema'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => { document.getElementById('faq-schema')?.remove() }
  }, [])

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i)

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="container-max">

        <header className="faq-header">
          <span className="faq-eyebrow">Información Práctica</span>
          <h2 id="faq-heading" className="faq-title">Antes de reservar</h2>
          <p className="faq-subtitle">
            Algunos detalles para disfrutar la experiencia con calma.
          </p>
        </header>

        <dl className="faq-list">
          {FAQS.map(({ q, a }, i) => {
            const isOpen = openIdx === i
            const answerId = `faq-ans-${i}`
            return (
              <div key={i} className={`faq-item${isOpen ? ' open' : ''}`}>
                <dt>
                  <button
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => toggle(i)}
                  >
                    <span className="faq-q-text">{q}</span>
                    <span className="faq-icon" aria-hidden="true" />
                  </button>
                </dt>
                <dd id={answerId} className="faq-answer" role="region">
                  <div className="faq-answer-inner">
                    <p className="faq-answer-text">{a}</p>
                  </div>
                </dd>
              </div>
            )
          })}
        </dl>

      </div>
    </section>
  )
}

/* ── Ornament separador reutilitzable ───────────────────────── */
function Ornament() {
  return (
    <div className="mnu-ornament" aria-hidden="true">
      <span className="mnu-orn-line" />
      <span className="mnu-orn-glyph">✦</span>
      <span className="mnu-orn-line" />
    </div>
  )
}

/* ── Pàgina principal ───────────────────────────────────────── */
export default function Menus() {
  const [activeId, setActiveId] = useState('degustacion')
  const active = menus.find(m => m.id === activeId) ?? menus[0]
  const contentRef = useRef(null)

  const selectMenu = (id) => {
    setActiveId(id)
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  return (
    <>
      <SEO
        title="Menús | Bo.TiC Restaurant"
        description="Descobreix els menús de Bo.TiC: Menú Degustación, Menú del Chef i Menú Esencia, tres propostes gastronòmiques a Corçà."
        canonical="https://www.bo-tic.com/menus"
        ogImage="https://www.bo-tic.com/og-menus.jpg"
      />

      <MenusHero />

      {/* ── Selector de menús ── */}
      <div
        className="mnu-selector-wrap"
        role="navigation"
        aria-label="Selecciona un menú"
      >
        <div className="mnu-selector">
          {menus.map((m) => (
            <button
              key={m.id}
              className={`mnu-tab${m.id === activeId ? ' active' : ''}`}
              onClick={() => selectMenu(m.id)}
              aria-pressed={m.id === activeId}
            >
              <span className="mnu-tab-title">{m.title}</span>
              <span className="mnu-tab-price">
                <span className="mnu-tab-price-value">{m.price}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Contingut del menú actiu ── */}
      <section
        ref={contentRef}
        className="mnu-content-wrap"
        aria-label={active.title}
        key={activeId}
      >
        <div className="container-max mnu-content">

          {/* Capçalera del menú actiu */}
          <div className="mnu-content-header">
            <h2 className="mnu-content-title">{active.title}</h2>
            <span className="mnu-content-price">{active.price}</span>
          </div>

          {/* Nota de disponibilitat (Menú Esencia) */}
          {active.note && (
            <p className="mnu-note" role="note">
              <span className="mnu-note-icon" aria-hidden="true">◈</span>
              {active.note}
            </p>
          )}

          {/* Seccions accordion */}
          <div className="mnu-sections">
            {active.sections.map((section) => (
              <SectionAccordion
                key={`${activeId}-${section.title}`}
                section={section}
                menuId={activeId}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Carta de vinos + info pràctica ── */}
      <WineSection />
      <InfoSection />

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── CTA final ── */}
      <section
        className="mnu-cta-section"
        aria-labelledby="menus-cta-heading"
      >
        {/* Glow radial daurat al centre */}
        <div className="mnu-cta-glow" aria-hidden="true" />

        <div className="container-max mnu-cta-content">
          <Ornament />

          <span className="label block mt-8 mb-4">Reserva</span>
          <h2
            id="menus-cta-heading"
            className="font-serif font-light text-4xl md:text-5xl lg:text-6xl
                       text-botic-cream leading-tight tracking-tight mb-4"
          >
            Reserva la teva experiència
          </h2>
          <p className="font-sans text-sm md:text-base text-botic-muted leading-relaxed
                        max-w-md mx-auto mb-10">
            Els menús poden variar segons temporada, producte i disponibilitat.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/reserves" className="btn-gold">Reservar taula</Link>
            <a href="tel:+34972630869" className="btn-cream">Contactar</a>
          </div>
        </div>
      </section>
    </>
  )
}
