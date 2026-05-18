import { useState, useId } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { menus } from '../data/menus'

const PENDING = '[pendent de revisar]'

/* ── Hero ───────────────────────────────────────────────── */
function MenusHero() {
  return (
    <section
      className="relative flex items-end overflow-hidden bg-botic-black pt-24"
      style={{ minHeight: '52vh' }}
      aria-label="Menús de Bo.TiC"
    >
      {/* Fons degradat */}
      <div className="absolute inset-0 bg-gradient-to-br
                      from-botic-black via-botic-dark to-botic-surface" />
      {/* Textura puntejada */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(196,169,106,0.9) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      {/* Línia decorativa horitzontal */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-botic-border opacity-40" />

      <div className="relative z-10 container-max w-full pb-12 md:pb-16">
        <span className="menus-hero-label label block mb-5">
          Proposta gastronòmica
        </span>
        <h1 className="menus-hero-title font-serif font-light leading-[0.95] tracking-tight
                       text-botic-cream"
            style={{ fontSize: 'clamp(64px, 10vw, 120px)' }}>
          Menús
        </h1>
        <p className="menus-hero-sub font-serif italic font-light text-botic-cream/55
                      leading-relaxed max-w-xl mt-5"
           style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}>
          Tres maneres d'apropar-se a l'univers gastronòmic de Bo.TiC.
        </p>
      </div>
    </section>
  )
}

/* ── Accordion de secció ─────────────────────────────────── */
function SectionAccordion({ section, menuId }) {
  const [open, setOpen]     = useState(false)
  const [openKey, setOpenKey] = useState(0)
  const id    = useId()
  const bodyId = `${id}-body`

  const toggle = () => {
    if (!open) setOpenKey(k => k + 1)   // remount dishes → re-trigger stagger
    setOpen(o => !o)
  }

  return (
    <div className="mnu-section">
      <button
        className="mnu-section-trigger"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={bodyId}
      >
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
                  {/* description only shown when real content is added */}
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

/* ── Pàgina principal ────────────────────────────────────── */
export default function Menus() {
  const [activeId, setActiveId] = useState('degustacion')
  const active = menus.find(m => m.id === activeId) ?? menus[0]

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
      <div className="mnu-selector-wrap" role="navigation" aria-label="Selecciona un menú">
        <div className="mnu-selector">
          {menus.map((m) => (
            <button
              key={m.id}
              className={`mnu-tab${m.id === activeId ? ' active' : ''}`}
              onClick={() => setActiveId(m.id)}
              aria-pressed={m.id === activeId}
            >
              <span className="mnu-tab-title">{m.title}</span>
              <span className="mnu-tab-price">{m.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Contingut del menú actiu ── */}
      <section
        className="mnu-content-wrap"
        aria-label={active.title}
        key={activeId}          /* remount on switch → fadeUp re-triggers */
      >
        <div className="container-max mnu-content">

          {/* Nota del menú (ex. Esencia: disponibilitat migdia) */}
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

      {/* ── CTA final ── */}
      <section className="bg-botic-dark py-24 md:py-32 text-center"
               aria-labelledby="menus-cta-heading">
        <div className="container-max">
          <span className="label block mb-4">Reserva</span>
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
