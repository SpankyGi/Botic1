import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Hero             from '../components/Hero'
import ChefSection      from '../components/ChefSection'
import ClosingCTA       from '../components/ClosingCTA'
import SEO              from '../components/SEO'
import ResponsiveImage  from '../components/ResponsiveImage'
import { useLateReveal } from '../hooks/useReveal'
import { useLangRoutes } from '../i18n/LangContext'

function FeatureEntry({ tag, title, body, to, label, image, index }) {
  const entryRef = useLateReveal()

  return (
    <Link ref={entryRef} to={to} className="feature-card feature-entry" style={{ '--i': index }}>
      <span className="feature-media" aria-hidden="true">
        <ResponsiveImage src={image} mobileSrc={image.replace('.webp', '-mobile.webp')} alt="" loading="lazy" />
      </span>
      <span className="feature-index" aria-hidden="true">0{index + 1}</span>
      <span className="feature-tag">{tag}</span>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-body">{body}</p>
      <span className="feature-cta">{label} →</span>
    </Link>
  )
}

function SeoIntroHeading({ children }) {
  const match = children.match(/^(.*?)(Empordà)([.!?]?)$/)

  if (!match) return <h2>{children}</h2>

  return (
    <h2>
      {match[1]}<span className="home-seo-territory">{match[2]}</span>{match[3]}
    </h2>
  )
}

function SeasonStrip({ t, routes }) {
  const revealRef = useLateReveal()
  const [activeDish, setActiveDish] = useState(0)
  const labels = t('home.seasonItems', { returnObjects: true })
  const dishes = [
    '/images/botic-maig-2026-webp/amanida-gastronomica-herbes-botic-emporda.webp',
    '/images/botic-maig-2026-webp/presentacio-aperitiu-botic-costa-brava.webp',
    '/images/botic-maig-2026-webp/tonyina-mar-costa-brava-alta-cuina-botic.webp',
    '/images/botic-maig-2026-webp/xef-servint-brou-plat-peix-botic.webp',
    '/images/botic-maig-2026-webp/xef-acabant-plat-restaurant-botic.webp',
    '/images/botic-maig-2026-webp/plat-peix-costa-brava-emporda-botic.webp',
    '/images/botic-maig-2026-webp/escamarlans-marisc-restaurant-botic-emporda.webp',
    '/images/botic-maig-2026-webp/plat-llamantol-restaurant-botic-emporda.webp',
    '/images/botic-maig-2026-webp/plat-esparrecs-blancs-restaurant-botic.webp',
    '/images/botic-maig-2026-webp/plat-carn-fruits-vermells-botic.webp',
    '/images/botic-maig-2026-webp/detall-postres-maduixes-botic-emporda.webp',
    '/images/botic-maig-2026-webp/postres-maduixes-menu-degustacio-botic.webp',
    '/images/botic-maig-2026-webp/alta-cuina-empordanesa-restaurant-botic.webp',
    '/images/plat-cenital-botic.webp',
    '/images/botic-maig-2026-webp/plat-peix-costa-brava-emporda-botic.webp',
    '/images/botic-maig-2026-webp/tonyina-mar-costa-brava-alta-cuina-botic.webp',
    '/images/botic-maig-2026-webp/xef-servint-brou-plat-peix-botic.webp',
    '/images/botic-maig-2026-webp/plat-esparrecs-blancs-restaurant-botic.webp',
    '/images/botic-maig-2026-webp/plat-carn-fruits-vermells-botic.webp',
    '/images/botic-maig-2026-webp/detall-postres-maduixes-botic-emporda.webp',
  ].map((image, index) => ({ image, label: labels[index] }))
  const dish = dishes[activeDish]
  const formatIndex = (index) => String(index + 1).padStart(2, '0')

  return (
    <section className="home-season" aria-label={t('home.seasonAria')}>
      <span className="home-season-ghost" aria-hidden="true">TEMPORADA</span>
      <div className="home-season-inner reveal" ref={revealRef}>
        <header className="home-season-head">
          <div>
            <span className="home-season-eyebrow">{t('home.seasonEyebrow')}</span>
            <h2 id="home-season-title">{t('home.seasonHeading')}</h2>
          </div>
          <Link to={routes.menus} className="home-season-link">{t('home.seasonLink')} <span aria-hidden="true">→</span></Link>
        </header>

        <div className="home-season-gallery">
          <figure className="home-season-dish">
            <ResponsiveImage key={dish.image} src={dish.image} mobileSrc={dish.image.replace('.webp', '-mobile.webp')} alt={dish.label} loading="lazy" />
            <figcaption aria-hidden="true">{formatIndex(activeDish)}</figcaption>
          </figure>

          <div className="home-season-controls" aria-label={t('home.seasonControlsAria')}>
            {dishes.map((item, index) => (
              <button
                className={index === activeDish ? 'is-active' : ''}
                type="button"
                key={`${item.image}-${index}`}
                aria-pressed={index === activeDish}
                onClick={() => setActiveDish(index)}
                onFocus={() => setActiveDish(index)}
                onMouseEnter={() => setActiveDish(index)}
              >
                <span aria-hidden="true">{formatIndex(index)}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { t }       = useTranslation()
  const routes      = useLangRoutes()
  const seoIntroRef = useLateReveal()
  const introRef    = useLateReveal()
  const dishRef     = useRef(null)

  useEffect(() => {
    const dish = dishRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!dish || reducedMotion.matches) return

    let frame = 0
    const updateDishTurn = () => {
      frame = 0
      const rect = dish.getBoundingClientRect()
      const travel = window.innerHeight + rect.height
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel))
      // El plat conserva presència mentre s'entra al bloc; només gira al
      // tram final, quan el lector ja n'ha recorregut la major part.
      const lateProgress = Math.min(1, Math.max(0, (progress - 0.54) / 0.46))
      const degrees = -22 + lateProgress * 44
      dish.style.setProperty('--dish-turn', `${degrees.toFixed(2)}deg`)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateDishTurn)
    }

    updateDishTurn()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const FEATURES = [
    {
      tag:   t('home.featRestaurantTag'),
      title: t('home.featRestaurantTitle'),
      body:  t('home.featRestaurantBody'),
      to:    routes.restaurant,
      label: t('home.featRestaurantLabel'),
      image: '/images/restaurant-botic-corca-emporda-interior.webp',
    },
    {
      tag:   t('home.featGastroTag'),
      title: t('home.featGastroTitle'),
      body:  t('home.featGastroBody'),
      to:    routes.gastronomia,
      label: t('home.featGastroLabel'),
      image: '/images/botic-maig-2026-webp/alta-cuina-empordanesa-restaurant-botic.webp',
    },
    {
      tag:   t('home.featExpTag'),
      title: t('home.featExpTitle'),
      body:  t('home.featExpBody'),
      to:    routes.experiencia,
      label: t('home.featExpLabel'),
      image: '/images/restaurant-botic-corca-emporda-exterior-nit.webp',
    },
  ]

  return (
    <>
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        pageKey="home"
      />

      <Hero />

      {/* ── Tres portes per descobrir Bo·TiC ── */}
      <section className="features-section" aria-label={t('home.featuresAria')}>
        <img
          className="home-albert-editorial"
          src="/images/albert-sastregener-editorial-transparent.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
        <div className="home-albert-signature" aria-hidden="true">
          <span>Albert Sastregener</span>
          <span>Xef</span>
        </div>
        <img
          className="home-cristina-editorial"
          src="/images/cristina-editorial-transparent-v2.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
        <div className="home-cristina-signature" aria-hidden="true">
          <span>{t('home.cristinaName')}</span>
          <span>{t('home.cristinaRole')}</span>
        </div>
        <div className="container-max">
          <div className="home-seo-intro reveal" ref={seoIntroRef}>
            <div className="home-seo-logo" aria-hidden="true">
              <span className="home-seo-symbol-reveal">
              <img src="/images/botic-logo-original.png" alt="" decoding="async" />
              </span>
            </div>
            <SeoIntroHeading>{t('home.seoIntroHeading')}</SeoIntroHeading>
            <p>{t('home.seoIntroBody')}</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((feature, i) => (
              <FeatureEntry key={feature.to} {...feature} index={i} />
            ))}
          </div>
          <div className="mobile-people-coda" aria-label={t('home.peopleCodaAria')}>
            <div className="mobile-person mobile-person-albert">
              <img src="/images/albert-sastregener-editorial-transparent.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <div className="mobile-person-signature">
                <span>{t('home.albertName')}</span>
                <span>{t('home.albertRole')}</span>
              </div>
            </div>
            <div className="mobile-person mobile-person-cristina">
              <img src="/images/cristina-editorial-transparent-v2.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <div className="mobile-person-signature">
                <span>{t('home.cristinaName')}</span>
                <span>{t('home.cristinaRole')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SeasonStrip t={t} routes={routes} />


      {/* ── Paisatge i relat ── */}
      <section className="home-intro home-scene-reveal" ref={introRef}>
        <div className="home-intro-photo home-intro-dish" ref={dishRef} aria-hidden="true">
          <ResponsiveImage
            src="/images/plat-cenital-botic.webp"
            mobileSrc="/images/plat-cenital-botic-mobile.webp"
            alt=""
            className="home-intro-img"
          />
          <div className="home-intro-overlay" />
        </div>

        <span className="home-intro-ghost" aria-hidden="true">ARREL</span>

        <div className="container-max home-intro-inner">
          <div className="home-intro-content">
            <span className="home-intro-label">{t('home.introLabel')}</span>
            <h2 className="font-serif font-light leading-tight tracking-tight home-intro-title">
              {t('home.introHeading').split('\n').map((line, i) => (
                <span className="home-intro-title-line" key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
            <p className="font-sans home-intro-body">
              {t('home.introBody')}
            </p>
          </div>
        </div>
      </section>


      <ChefSection />

      {/* ── CTA Reserva ── */}
      <ClosingCTA
        id="home-closing-cta"
        tone="light"
        eyebrow={t('home.ctaLabel')}
        heading={t('home.ctaHeading')}
        primaryTo={routes.reserves}
        primaryLabel={t('home.ctaBtn')}
      />
    </>
  )
}
