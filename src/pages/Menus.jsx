import { useState, useId, useRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import { useLangRoutes } from '../i18n/LangContext'
import { useLang } from '../i18n/LangContext'
import { getOfficialMenus } from '../data/officialMenus'

const HERO_IMG = '/images/plat-cenital-botic.jpg'

// i18n metadata per menu — titles and notes come from translations
const MENU_META = [
  { id: 'degustacio',  titleKey: 'menus.degustacioTitle', positionKey: 'menus.degustacioPosition', noteKey: null,                fallbackPrice: '190 €' },
  { id: 'chef',        titleKey: 'menus.chefTitle',       positionKey: 'menus.chefPosition',       noteKey: null,                fallbackPrice: '250 €' },
  { id: 'esencia',     titleKey: 'menus.esenciaTitle',    positionKey: 'menus.esenciaPosition',     noteKey: 'menus.esenciaNote', fallbackPrice: '90 €' },
]

/* ── Hero ─────────────────────────────────────────────────── */
function MenusHero({ t }) {
  return (
    <section className="mnu-hero" aria-label={t('menus.heroAria')}>
      <img
        src={HERO_IMG}
        alt=""
        aria-hidden="true"
        className="mnu-hero-img"
      />
      <div className="mnu-hero-overlay" aria-hidden="true" />
      <div className="mnu-hero-border-line" />

      <div className="container-max mnu-hero-inner">
        <div className="mnu-hero-copy">
        <span className="menus-hero-label">{t('menus.heroLabel')}</span>
        <h1 className="menus-hero-title">{t('menus.heroTitle')}</h1>
        <p className="menus-hero-sub">{t('menus.heroSub')}</p>
        <div className="menus-hero-ornament">
          <span className="mnu-orn-line" /><span className="mnu-orn-glyph">✦</span><span className="mnu-orn-line" />
        </div>
        </div>
      </div>
    </section>
  )
}

/* ── Accordion de grup (nivell 2 — quan hi ha seccions reals) ── */
function GroupAccordion({ group, sectionId, menuId }) {
  const [open, setOpen]       = useState(false)
  const [openKey, setOpenKey] = useState(0)
  const id     = useId()
  const bodyId = `${id}-body`

  const toggle = () => {
    if (!open) setOpenKey(k => k + 1)
    setOpen(o => !o)
  }

  return (
    <div className={`mnu-section mnu-group${open ? ' is-open' : ''}`}>
      <button
        className="mnu-section-trigger"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        <span className="mnu-section-dot" aria-hidden="true" />
        <span className="mnu-section-title">{group.title}</span>
        <span className="mnu-section-count" aria-hidden="true">{group.items.length}</span>
        <span className="mnu-section-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <div
        id={bodyId}
        className={`mnu-section-body${open ? ' open' : ''}`}
        role="region"
      >
        <div className="mnu-section-inner">
          <div className="mnu-section-accent" aria-hidden="true" />
          <ul key={openKey} className="mnu-dish-list">
            {group.items.map((item, i) => (
              <li
                key={`${menuId}-${sectionId}-${group.id}-${i}`}
                className="mnu-dish"
                style={{ animationDelay: `${60 + i * 55}ms` }}
              >
                <span className="mnu-dish-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="mnu-dish-content">
                  <h4 className="mnu-dish-name">{item.name}</h4>
                  {item.description && <p className="mnu-dish-desc">{item.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ── Accordion de secció (nivell 1) ──────────────────────────────────── */
function SectionAccordion({ section, menuId, t }) {
  const [open, setOpen]       = useState(false)
  const [openKey, setOpenKey] = useState(0)
  const id     = useId()
  const bodyId = `${id}-body`

  const toggle = () => {
    if (!open) setOpenKey(k => k + 1)
    setOpen(o => !o)
  }

  // Compatibilitat amb noms llegats del fallback (Snacks/Menú/Postres → i18n)
  const SECTION_KEY_MAP = { 'Snacks': 'menus.sectionSnacks', 'Menú': 'menus.sectionMenu', 'Postres': 'menus.sectionPostres' }
  const sectionTitle = t(SECTION_KEY_MAP[section.title] || section.title)

  // flat: secció amb un sol grup del mateix nom → mostra plats directament sense accordion de grup
  const flatItems  = section.flat ? (section.groups[0]?.items ?? []) : []
  const totalCount = section.flat
    ? flatItems.length
    : section.groups.reduce((s, g) => s + g.items.length, 0)

  return (
    <div className={`mnu-section${open ? ' is-open' : ''}`}>
      <button
        className="mnu-section-trigger"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        <span className="mnu-section-dot" aria-hidden="true" />
        <span className="mnu-section-titlewrap">
          <span className="mnu-section-eyebrow" aria-hidden="true">{t('menus.sectionEyebrow')}</span>
          <span className="mnu-section-title">{sectionTitle}</span>
        </span>
        <span className="mnu-section-count" aria-hidden="true">{totalCount}</span>
        <span className="mnu-section-icon" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      <div
        id={bodyId}
        className={`mnu-section-body${open ? ' open' : ''}`}
        role="region"
        aria-labelledby={`${id}-trigger`}
      >
        <div className="mnu-section-inner">
          <div className="mnu-section-accent" aria-hidden="true" />
          {section.flat ? (
            <ul key={openKey} className="mnu-dish-list">
              {flatItems.map((item, i) => (
                <li
                  key={`${menuId}-${section.id}-${i}`}
                  className="mnu-dish"
                  style={{ animationDelay: `${60 + i * 55}ms` }}
                >
                  <span className="mnu-dish-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="mnu-dish-content">
                    <h4 className="mnu-dish-name">{item.name}</h4>
                    {item.description && <p className="mnu-dish-desc">{item.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mnu-groups">
              {section.groups.map(group => (
                <GroupAccordion
                  key={group.id}
                  group={group}
                  sectionId={section.id}
                  menuId={menuId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── useReveal ─────────────────────────────────────────────── */
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

/* ── useCountUp ────────────────────────────────────────────── */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)
  const ref    = useRef(null)

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
          const t2    = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t2, 3)
          setCount(Math.round(eased * target))
          if (t2 < 1) requestAnimationFrame(tick)
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

/* ── WineSection ───────────────────────────────────────────── */
function WineSection({ t }) {
  const { count, ref: statRef } = useCountUp(900, 1250)
  const [colRef,  colVisible]   = useReveal(0.12)
  const [divRef,  divVisible]   = useReveal(0.50)

  return (
    <section className="wine-section" aria-labelledby="wine-heading">
      <span className="wine-ghost" aria-hidden="true">{t('menus.wineBackgroundWord')}</span>
      <div className="wine-photo-wrap" aria-hidden="true">
        <img
          src="/images/restaurant-emporda-botic-michelin.webp"
          alt=""
          className="wine-photo-img"
        />
        <div className="wine-photo-overlay" />
      </div>
      <div className="wine-bg-texture" aria-hidden="true" />

      <div className="container-max wine-inner">
        <div className={`wine-col-left${colVisible ? ' is-visible' : ''}`} ref={colRef}>
          <span className="wine-label">{t('menus.wineLabel')}</span>

          <div className="wine-stat" ref={statRef}>
            <span className="wine-stat-num" aria-label={`${t('menus.wineStatDesc').replace('$1', '900+')}`}>
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
              {t('menus.wineStatDesc')}
            </span>
          </div>

          <div className={`wine-divider${divVisible ? ' in-view' : ''}`} ref={divRef} aria-hidden="true" />

          <h2 id="wine-heading" className="wine-title">
            {t('menus.wineTitle').split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>

          <div className="wine-ornament" aria-hidden="true">
            <span className="wine-orn-line" /><span className="wine-orn-glyph">◈</span><span className="wine-orn-line" />
          </div>

          <p className="wine-lead">{t('menus.wineLead')}</p>
          <p className="wine-body">{t('menus.wineBody1')}</p>
          <p className="wine-body">{t('menus.wineBody2')}</p>
        </div>
      </div>
    </section>
  )
}

/* ── InfoSection ───────────────────────────────────────────── */
function InfoSection({ t }) {
  const [gridRef, gridVisible] = useReveal(0.15)

  const INFO_ITEMS = [
    { num: '01', text: t('menus.info01') },
    { num: '02', text: t('menus.info02') },
    { num: '03', text: t('menus.info03') },
  ]

  return (
    <section className="info-section" aria-label={t('menus.infoAria')}>
      <div className="container-max">
        <div className={`info-grid${gridVisible ? ' revealed' : ''}`} ref={gridRef}>
          {INFO_ITEMS.map(({ num, text }, i) => (
            <div key={num} className="info-card" style={{ '--i': i }}>
              <span className="info-num" aria-hidden="true">{num}</span>
              <p className="info-text">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── FaqSection ────────────────────────────────────────────── */
function FaqSection({ t }) {
  const [openIdx, setOpenIdx] = useState(null)

  const FAQS = [
    { q: t('menus.faqQ1'), a: t('menus.faqA1') },
    { q: t('menus.faqQ2'), a: t('menus.faqA2') },
    { q: t('menus.faqQ3'), a: t('menus.faqA3') },
    { q: t('menus.faqQ4'), a: t('menus.faqA4') },
    { q: t('menus.faqQ5'), a: t('menus.faqA5') },
    { q: t('menus.faqQ6'), a: t('menus.faqA6') },
    { q: t('menus.faqQ7'), a: t('menus.faqA7') },
  ]

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
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (i) => setOpenIdx(prev => prev === i ? null : i)

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="container-max">
        <header className="faq-header">
          <span className="faq-eyebrow">{t('menus.faqEyebrow')}</span>
          <h2 id="faq-heading" className="faq-title">{t('menus.faqTitle')}</h2>
          <p className="faq-subtitle">{t('menus.faqSubtitle')}</p>
        </header>

        <dl className="faq-list">
          {FAQS.map(({ q, a }, i) => {
            const isOpen   = openIdx === i
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

function Ornament() {
  return (
    <div className="mnu-ornament" aria-hidden="true">
      <span className="mnu-orn-line" /><span className="mnu-orn-glyph">✦</span><span className="mnu-orn-line" />
    </div>
  )
}

/* ── Pàgina principal ─────────────────────────────────────── */
function MenuCourseList({ sections, menuId }) {
  return (
    <div className="mnu-course-list">
      {sections.map((section, sectionIndex) => (
        <section className="mnu-course-section" key={`${menuId}-${section.id}`}>
          <header className="mnu-course-section-head">
            <span aria-hidden="true">{String(sectionIndex + 1).padStart(2, '0')}</span>
            <h3>{section.title}</h3>
          </header>
          <div className="mnu-course-groups">
            {section.groups.map((course) => (
              <article className="mnu-course" key={`${menuId}-${section.id}-${course.id}`}>
                <h4>{course.title}</h4>
                <ul>
                  {course.items.map((item, itemIndex) => (
                    <li key={`${menuId}-${section.id}-${course.id}-${itemIndex}`}>
                      <span className="mnu-course-item-mark" aria-hidden="true">{String(itemIndex + 1).padStart(2, '0')}</span>
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default function Menus() {
  const { t }   = useTranslation()
  const routes  = useLangRoutes()
  const lang    = useLang()
  const [activeId, setActiveId] = useState('degustacio')
  const contentRef = useRef(null)

  // API/cache/fallback data — hook handles fetch, TTL, and language

  // Merge API data with i18n metadata (titles, notes stay in i18n)
  const menus = useMemo(() =>
    MENU_META.map(({ id, titleKey, positionKey, noteKey, fallbackPrice }) => {
      const raw = getOfficialMenus(lang).find(m => m.id === id) || {}
      return {
        id,
        price:    raw.price || fallbackPrice,
        title:    t(titleKey),
        position: t(positionKey),
        note:     noteKey ? t(noteKey) : '',
        sections: raw.sections || [],
      }
    }),
  [lang, t])

  const active = menus.find(m => m.id === activeId) ?? menus[0]

  const selectMenu = (id) => {
    setActiveId(id)
  }

  const onSelectorKeyDown = (event, currentIndex) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextIndex = event.key === 'Home' ? 0
      : event.key === 'End' ? menus.length - 1
        : (currentIndex + (event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1) + menus.length) % menus.length
    const next = menus[nextIndex]
    selectMenu(next.id)
    requestAnimationFrame(() => document.getElementById(`menu-selector-${next.id}`)?.focus())
  }

  return (
    <>
      <SEO
        title={t('seo.menus.title')}
        description={t('seo.menus.description')}
        pageKey="menus"
        ogImage="/images/plat-cenital-botic.jpg"
      />

      <MenusHero t={t} />

      <section className="mnu-food-menus" aria-label={t('menus.selectorAria')}>
        {/* ── Selector de menús ── */}
        <div className="mnu-selector-wrap">
          <div className="mnu-selector" role="tablist">
            {menus.map((m, index) => (
            <button
              key={m.id}
              id={`menu-selector-${m.id}`}
              className={`mnu-tab${m.id === activeId ? ' active' : ''}`}
              onClick={() => selectMenu(m.id)}
              onKeyDown={(event) => onSelectorKeyDown(event, index)}
              role="tab"
              aria-selected={m.id === activeId}
              aria-controls={`menu-panel-${m.id}`}
              tabIndex={m.id === activeId ? 0 : -1}
            >
              <span className="mnu-tab-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="mnu-tab-title">{m.title}</span>
              <span className="mnu-tab-position">{m.position}</span>
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
          id={`menu-panel-${active.id}`}
          role="tabpanel"
          key={activeId}
        >
          <div className="container-max mnu-content">
            <div className="mnu-content-header">
              <h2 className="mnu-content-title">{active.title}</h2>
              <span className="mnu-content-price">{active.price}</span>
            </div>

            {active.note && (
              <p className="mnu-note" role="note">
                <span className="mnu-note-icon" aria-hidden="true">◈</span>
                {active.note}
              </p>
            )}

            <MenuCourseList sections={active.sections} menuId={activeId} />
            <p className="mnu-season-note" role="note">{t('menus.seasonNote')}</p>
          </div>
        </section>
      </section>

      <div className="mnu-wine-stage" id="wine-list">
        <WineSection t={t} />
        <InfoSection t={t} />
      </div>
      <FaqSection  t={t} />

      {/* ── CTA final ── */}
      <section className="mnu-cta-section" aria-labelledby="menus-cta-heading">
        <div className="mnu-cta-glow" aria-hidden="true" />
        <div className="container-max mnu-cta-content">
          <Ornament />
          <span className="label block mt-8 mb-4">{t('menus.ctaLabel')}</span>
          <h2
            id="menus-cta-heading"
            className="font-serif font-light text-4xl md:text-5xl lg:text-6xl
                       text-botic-cream leading-tight tracking-tight mb-4"
          >
            {t('menus.ctaHeading')}
          </h2>
          <p className="font-sans text-sm md:text-base text-botic-muted leading-relaxed
                        max-w-md mx-auto mb-10">
            {t('menus.ctaBody')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={routes.reserves} className="btn-gold">{t('menus.ctaBook')}</Link>
            <a href="tel:+34972630869" className="btn-cream">{t('menus.ctaContact')}</a>
          </div>
        </div>
      </section>
    </>
  )
}
