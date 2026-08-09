import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import { useLangRoutes } from '../i18n/LangContext'
import { useReveal } from '../hooks/useReveal.js'

const CELLAR = '/images/restaurant-emporda-botic-michelin.webp'
const CHEF = '/images/Albert Sastregener-empordà-botic-restaurant.webp'
const PORTRAIT = '/images/albert-sastregener-cuina-emporda-girona.webp'
const TEAM = '/images/cristina-albert-botic-emporda-michelin.webp'

function ExperienceHero({ t }) {
  return (
    <section className="exp-hero" aria-labelledby="exp-hero-title">
      <img src={CELLAR} alt={t('experiencia.vinsHeading')} className="exp-hero-img" />
      <div className="exp-hero-shade" aria-hidden="true" />
      <div className="exp-hero-copy">
        <span className="exp-kicker">{t('experiencia.heroEyebrow')}</span>
        <h1 id="exp-hero-title">{t('experiencia.heroHeading')}</h1>
      </div>
      <div className="exp-hero-clock" aria-hidden="true">
        <span /><i /><b />
      </div>
      <span className="exp-hero-whisper" aria-hidden="true">{t('experiencia.heroWhisper')}</span>
    </section>
  )
}

function MenuNarrative({ t }) {
  const revealRef = useReveal(0.06)
  const moments = [
    {
      num: '01', label: t('experiencia.moment01Label'), text: t('experiencia.moment01Text'),
      image: '/images/botic-maig-2026-webp/plat-esparrecs-blancs-restaurant-botic.webp',
      detail: '/images/botic-maig-2026-webp/xef-acabant-plat-restaurant-botic.webp',
    },
    {
      num: '02', label: t('experiencia.moment02Label'), text: t('experiencia.moment02Text'),
      image: '/images/botic-maig-2026-webp/plat-llamantol-restaurant-botic-emporda.webp',
      detail: '/images/botic-maig-2026-webp/xef-servint-brou-plat-peix-botic.webp',
    },
    {
      num: '03',
      label: t('experiencia.moment03Label'),
      text: t('experiencia.moment03Text'),
      image: '/images/botic-maig-2026-webp/postres-maduixes-menu-degustacio-botic.webp',
      detail: '/images/botic-maig-2026-webp/plat-carn-fruits-vermells-botic.webp',
      imageAlt: t('experiencia.moment03ImgAlt'),
    },
    {
      num: '04', label: t('experiencia.moment04Label'), text: t('experiencia.moment04Text'),
      image: '/images/botic-maig-2026-webp/plat-peix-costa-brava-emporda-botic.webp',
      detail: '/images/restaurant-botic-corca-emporda-sala-gastronomica.webp',
    },
  ]

  return (
    <section className="exp-narrative" aria-labelledby="exp-menu-title">
      <header className="exp-narrative-head reveal" ref={revealRef}>
        <span className="exp-kicker">{t('experiencia.menuEyebrow')}</span>
        <h2 id="exp-menu-title">{t('experiencia.menuHeading')}</h2>
        <p>{t('experiencia.menuNote')}</p>
      </header>
      <div className="exp-timeline">
        <div className="exp-timeline-axis" aria-hidden="true"><span /></div>
        {moments.map((moment, index) => (
          <article className={`exp-moment${index % 2 ? ' is-reversed' : ''}`} key={moment.num}>
            <span className="exp-moment-num">{moment.num}</span>
            <div className="exp-moment-copy">
              <h3>{moment.label}</h3>
              <p>{moment.text}</p>
            </div>
            <figure className="exp-moment-gallery">
              <div className="exp-moment-primary">
                <img src={moment.image} alt={moment.imageAlt || moment.label} loading="lazy" />
              </div>
              <div className="exp-moment-detail" aria-hidden="true">
                <img src={moment.detail} alt="" loading="lazy" />
              </div>
              <figcaption>0{index + 1} / 04</figcaption>
            </figure>
            <span className="exp-moment-orbit" style={{ '--orbit-scale': 1 + index * .16 }} aria-hidden="true" />
          </article>
        ))}
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

function ExperienceCTA({ t, routes }) {
  return (
    <section className="exp-cta">
      <img src={CHEF} alt="" aria-hidden="true" loading="lazy" />
      <div className="exp-cta-shade" aria-hidden="true" />
      <div className="exp-cta-copy">
        <span className="exp-kicker">{t('experiencia.ctaEyebrow')}</span>
        <h2>{t('experiencia.ctaHeading')}</h2>
        <p>{t('experiencia.ctaBody')}</p>
        <Link className="btn-gold" to={routes.reserves}>{t('experiencia.ctaBtn')}</Link>
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
      <HospitalitySection t={t} />
      <CellarSection t={t} />
      <ExperienceCTA t={t} routes={routes} />
    </>
  )
}
