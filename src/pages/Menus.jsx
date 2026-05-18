import { useState, useId } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { menus } from '../data/menus'

const PENDING = '[pendent de revisar]'

/* ── Hero ───────────────────────────────────────────────────── */
function MenusHero() {
  return (
    <section
      className="relative flex items-end overflow-hidden bg-botic-black pt-24"
      style={{ minHeight: '55vh' }}
      aria-label="Menús de Bo.TiC"
    >
      {/* Gradient principal fosc */}
      <div className="absolute inset-0 bg-gradient-to-br
                      from-botic-black via-botic-dark to-botic-surface" />

      {/* Punt de llum daurat — centrat baix, on es llegeix el text */}
      <div className="mnu-hero-glow-gold" />

      {/* Toc de borgonya a dalt-dreta */}
      <div className="mnu-hero-glow-burg" />

      {/* Trama puntejada daurada */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(154,42,42,1) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Línia horitzontal inferior */}
      <div className="absolute bottom-0 left-0 right-0 mnu-hero-border-line" />

      {/* Cantonades decoratives */}
      <span className="mnu-hero-corner tl" />
      <span className="mnu-hero-corner br" />

      <div className="relative z-10 container-max w-full pb-12 md:pb-16">
        <span className="menus-hero-label label block mb-5">
          Proposta gastronòmica
        </span>
        <h1
          className="menus-hero-title font-serif font-light leading-[0.92] tracking-tight
                     text-botic-cream"
          style={{ fontSize: 'clamp(68px, 11vw, 130px)' }}
        >
          Menús
        </h1>
        <p
          className="menus-hero-sub font-serif italic font-light text-botic-cream/55
                     leading-relaxed max-w-xl mt-5"
          style={{ fontSize: 'clamp(16px, 1.8vw, 20px)' }}
        >
          Tres maneres d'apropar-se a l'univers gastronòmic de Bo.TiC.
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
              onClick={() => setActiveId(m.id)}
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
