import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Hero             from '../components/Hero'
import ChefSection      from '../components/ChefSection'
import SEO              from '../components/SEO'
import { useReveal } from '../hooks/useReveal'
import { useLangRoutes } from '../i18n/LangContext'

function FeatureEntry({ tag, title, body, to, label, image, index }) {
  const entryRef = useReveal(0.24)

  return (
    <Link ref={entryRef} to={to} className="feature-card feature-entry" style={{ '--i': index }}>
      <span className="feature-media" aria-hidden="true">
        <img src={image} alt="" />
      </span>
      <span className="feature-index" aria-hidden="true">0{index + 1}</span>
      <span className="feature-tag">{tag}</span>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-body">{body}</p>
      <span className="feature-cta">{label} →</span>
    </Link>
  )
}

function ReserveHeading({ children }) {
  const words = children.split(' ')

  return (
    <h2 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl text-botic-cream leading-tight tracking-tight mt-4 mb-6 reserve-title">
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="reserve-word">{word}</span>
      ))}
    </h2>
  )
}

function SeasonStrip({ t, routes }) {
  const revealRef = useReveal(0.16)
  const dishes = [
    { image: '/images/botic-maig-2026-webp/amanida-gastronomica-herbes-botic-emporda.webp', alt: t('home.seasonDish1Alt') },
    { image: '/images/botic-maig-2026-webp/plat-peix-costa-brava-emporda-botic.webp', alt: t('home.seasonDish2Alt') },
    { image: '/images/botic-maig-2026-webp/postres-maduixes-menu-degustacio-botic.webp', alt: t('home.seasonDish3Alt') },
  ]

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
          {dishes.map((dish, index) => (
            <figure className={`home-season-dish home-season-dish-${index + 1}`} key={dish.image}>
              <img src={dish.image} alt={dish.alt} loading="lazy" />
              <figcaption aria-hidden="true">0{index + 1}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { t }       = useTranslation()
  const routes      = useLangRoutes()
  const ctaRef      = useReveal(0.18)
  const featuresRef = useReveal(0.12)
  const introRef    = useReveal(0.26)
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
      const degrees = -22 + progress * 44
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
        <div className="container-max">
          <h2 className="features-intro-title">
            <img src="/images/botic-logo-original.png" alt="Bo·TiC" />
          </h2>
          <div className="features-grid" ref={featuresRef}>
            {FEATURES.map((feature, i) => (
              <FeatureEntry key={feature.to} {...feature} index={i} />
            ))}
          </div>
          <div className="features-portraits" aria-label={t('home.portraitsAria')}>
            <figure className="feature-portrait feature-portrait-albert">
              <img
                src="/images/cristina-albert-botic-emporda-michelin.webp"
                alt={t('home.albertPortraitAlt')}
                loading="lazy"
              />
              <figcaption>{t('home.albertPortraitLabel')}</figcaption>
            </figure>
            <figure className="feature-portrait feature-portrait-cristina">
              <img
                src="/images/cristina-albert-botic-emporda-michelin.webp"
                alt={t('home.cristinaPortraitAlt')}
                loading="lazy"
              />
              <figcaption>{t('home.cristinaPortraitLabel')}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <SeasonStrip t={t} routes={routes} />


      {/* ── Paisatge i relat ── */}
      <section className="home-intro home-scene-reveal" ref={introRef}>
        <div className="home-intro-photo home-intro-dish" ref={dishRef} aria-hidden="true">
          <img
            src="/images/plat-cenital-botic.jpg"
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
      <section className="home-reserva-cta">
        <div className="container-max reveal" ref={ctaRef}>
          <span className="label block">{t('home.ctaLabel')}</span>
          <ReserveHeading>{t('home.ctaHeading')}</ReserveHeading>
          <p className="font-sans text-sm md:text-base leading-relaxed
                        max-w-md mx-auto mb-10">
            {t('home.ctaBody')}
          </p>
          <Link to={routes.reserves} className="btn-gold">{t('home.ctaBtn')}</Link>
        </div>
      </section>
    </>
  )
}
