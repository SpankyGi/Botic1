import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO.jsx'
import ClosingCTA from '../components/ClosingCTA.jsx'
import { useReveal } from '../hooks/useReveal.js'
import { useLangRoutes } from '../i18n/LangContext'

const CELLAR = '/images/restaurant-emporda-botic-michelin.webp'
const PORTRAIT = '/images/albert-sastregener-cuina-emporda-girona.webp'
const TEAM = '/images/cristina-albert-botic-emporda-michelin.webp'

function ExperienceHero({ t }) {
  return (
    <section className="exp-hero" aria-labelledby="exp-hero-title">
      <video
        className="exp-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={CELLAR}
        aria-hidden="true"
      >
        <source media="(max-width: 768px)" src="/images/experiencia-botic-emporda-mobile.webm" type="video/webm" />
        <source src="/images/experiencia-botic-emporda.webm" type="video/webm" />
      </video>
      <div className="exp-hero-shade" aria-hidden="true" />
      <div className="exp-hero-copy">
        <span className="exp-kicker">{t('experiencia.heroEyebrow')}</span>
        <h1 id="exp-hero-title">{t('experiencia.heroHeading')}</h1>
      </div>
      <span className="exp-hero-whisper" aria-hidden="true">{t('experiencia.heroWhisper')}</span>
    </section>
  )
}

function MenuNarrative({ t }) {
  const [activeMoment, setActiveMoment] = useState(0)
  const moments = [
    {
      num: '01', label: t('experiencia.moment01Label'), text: t('experiencia.moment01Text'),
      images: [
        '/images/botic-maig-2026-webp/plat-esparrecs-blancs-restaurant-botic.webp',
        '/images/botic-maig-2026-webp/xef-acabant-plat-restaurant-botic.webp',
        '/images/botic-maig-2026-webp/escamarlans-marisc-restaurant-botic-emporda.webp',
      ],
    },
    {
      num: '02', label: t('experiencia.moment02Label'), text: t('experiencia.moment02Text'),
      images: [
        '/images/botic-maig-2026-webp/plat-llamantol-restaurant-botic-emporda.webp',
        '/images/botic-maig-2026-webp/xef-servint-brou-plat-peix-botic.webp',
        '/images/plat-cenital-botic.jpg',
      ],
    },
    {
      num: '03',
      label: t('experiencia.moment03Label'),
      text: t('experiencia.moment03Text'),
      images: [
        '/images/botic-maig-2026-webp/postres-maduixes-menu-degustacio-botic.webp',
        '/images/botic-maig-2026-webp/plat-carn-fruits-vermells-botic.webp',
        '/images/botic-maig-2026-webp/alta-cuina-empordanesa-restaurant-botic.webp',
      ],
    },
    {
      num: '04', label: t('experiencia.moment04Label'), text: t('experiencia.moment04Text'),
      images: [
        '/images/botic-maig-2026-webp/plat-peix-costa-brava-emporda-botic.webp',
        '/images/restaurant-botic-corca-emporda-sala-gastronomica.webp',
        '/images/restaurant-botic-corca-emporda-interior.webp',
      ],
    },
  ]
  const goToMoment = (index) => setActiveMoment((index + moments.length) % moments.length)

  return (
    <section className="exp-narrative" aria-labelledby="exp-menu-title">
      <span className="exp-narrative-ghost" aria-hidden="true">{t('experiencia.menuGhost')}</span>
      <header className="exp-narrative-head">
        <span className="exp-kicker">{t('experiencia.menuEyebrow')}</span>
        <h2 id="exp-menu-title">{t('experiencia.menuHeading')}</h2>
        <p>{t('experiencia.menuNote')}</p>
      </header>
      <div className="exp-gallery-shell">
        <nav className="exp-gallery-nav" aria-label={t('experiencia.menuHeading')}>
          {moments.map((moment, index) => (
            <button
              type="button"
              key={moment.num}
              className={index === activeMoment ? 'is-active' : ''}
              onClick={() => goToMoment(index)}
              aria-current={index === activeMoment ? 'step' : undefined}
            >
              <span>{moment.num}</span><b>{moment.label}</b>
            </button>
          ))}
        </nav>
        <div className="exp-gallery-stage" aria-live="polite">
        {moments.map((moment, index) => (
          <article className={`exp-gallery-slide${index === activeMoment ? ' is-active' : ''}`} key={moment.num} aria-hidden={index !== activeMoment}>
            <div className="exp-gallery-images">
              <figure className="exp-gallery-main"><img src={moment.images[0]} alt={moment.label} loading={index === 0 ? 'eager' : 'lazy'} /></figure>
              <figure className="exp-gallery-side"><img src={moment.images[1]} alt="" loading="lazy" /></figure>
              <figure className="exp-gallery-detail"><img src={moment.images[2]} alt="" loading="lazy" /></figure>
              <span className="exp-gallery-count" aria-hidden="true">{moment.num} / 04</span>
            </div>
            <div className="exp-gallery-copy">
              <span className="exp-gallery-number">{moment.num}</span>
              <h3>{moment.label}</h3>
              <p>{moment.text}</p>
            </div>
          </article>
        ))}
        </div>
        <div className="exp-gallery-controls">
          <button type="button" onClick={() => goToMoment(activeMoment - 1)} aria-label="Anterior">←</button>
          <span>{String(activeMoment + 1).padStart(2, '0')} <i /> 04</span>
          <button type="button" onClick={() => goToMoment(activeMoment + 1)} aria-label="Següent">→</button>
        </div>
      </div>
    </section>
  )
}

function PaceSection({ t }) {
  const revealRef = useReveal(0.12)
  return (
    <section className="exp-pace" aria-labelledby="exp-pace-title">
      <div className="exp-pace-time" aria-hidden="true">—</div>
      <div className="exp-pace-inner reveal" ref={revealRef}>
        <span className="exp-kicker">{t('experiencia.ritmeEyebrow')}</span>
        <h2 id="exp-pace-title">{t('experiencia.ritmeHeading')}</h2>
        <div className="exp-pace-copy">
          <p>{t('experiencia.ritmeP1')}</p>
          <p>{t('experiencia.ritmeP2')}</p>
          <p>{t('experiencia.ritmeP3')}</p>
        </div>
      </div>
    </section>
  )
}

function HospitalitySection({ t }) {
  const revealRef = useReveal(0.1)
  return (
    <section className="exp-hospitality" aria-labelledby="exp-team-title">
      <div className="exp-hospitality-images">
        <figure className="exp-hospitality-main"><img src={TEAM} alt={t('experiencia.equipImgAlt')} loading="lazy" /></figure>
        <figure className="exp-hospitality-detail"><img src={PORTRAIT} alt="" loading="lazy" /></figure>
        <span aria-hidden="true">{t('experiencia.equipGhost')}</span>
      </div>
      <div className="exp-hospitality-copy reveal" ref={revealRef}>
        <span className="exp-kicker">{t('experiencia.equipEyebrow')}</span>
        <h2 id="exp-team-title">{t('experiencia.equipHeading')}</h2>
        <p>{t('experiencia.equipP1')}</p>
        <p>{t('experiencia.equipP2')}</p>
        <p>{t('experiencia.equipP3')}</p>
      </div>
    </section>
  )
}

function CellarSection({ t }) {
  const revealRef = useReveal(0.12)
  return (
    <section className="exp-cellar" aria-labelledby="exp-cellar-title">
      <img src={CELLAR} alt={t('experiencia.vinsHeading')} loading="lazy" />
      <div className="exp-cellar-shade" aria-hidden="true" />
      <div className="exp-cellar-copy reveal" ref={revealRef}>
        <span className="exp-kicker">{t('experiencia.vinsEyebrow')}</span>
        <h2 id="exp-cellar-title">{t('experiencia.vinsHeading')}</h2>
        <p>{t('experiencia.vinsP1')}</p>
        <p>{t('experiencia.vinsP2')}</p>
      </div>
    </section>
  )
}

export default function Experiencia() {
  const { t } = useTranslation()
  const routes = useLangRoutes()

  return (
    <>
      <SEO
        title={t('seo.experiencia.title')}
        description={t('seo.experiencia.description')}
        pageKey="experiencia"
      />
      <ExperienceHero t={t} />
      <MenuNarrative t={t} />
      <PaceSection t={t} />
      <ClosingCTA
        id="experience-closing-cta"
        tone="light"
        eyebrow={t('closingCta.experience.eyebrow')}
        heading={t('closingCta.experience.heading')}
        primaryTo={routes.reserves}
        primaryLabel={t('closingCta.experience.primary')}
      />
    </>
  )
}
