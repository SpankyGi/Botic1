import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Hero             from '../components/Hero'
import MarqueeStrip     from '../components/MarqueeStrip'
import ProjecteSection  from '../components/ProjecteSection'
import ChefSection      from '../components/ChefSection'
import SEO              from '../components/SEO'
import { useReveal } from '../hooks/useReveal'
import { useLangRoutes } from '../i18n/LangContext'

export default function Home() {
  const { t }       = useTranslation()
  const routes      = useLangRoutes()
  const ctaRef      = useReveal(0.18)
  const featuresRef = useReveal(0.12)

  const FEATURES = [
    {
      tag:   t('home.featRestaurantTag'),
      title: t('home.featRestaurantTitle'),
      body:  t('home.featRestaurantBody'),
      to:    routes.restaurant,
      label: t('home.featRestaurantLabel'),
    },
    {
      tag:   t('home.featGastroTag'),
      title: t('home.featGastroTitle'),
      body:  t('home.featGastroBody'),
      to:    routes.gastronomia,
      label: t('home.featGastroLabel'),
    },
    {
      tag:   t('home.featExpTag'),
      title: t('home.featExpTitle'),
      body:  t('home.featExpBody'),
      to:    routes.experiencia,
      label: t('home.featExpLabel'),
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

      <ProjecteSection />

      <MarqueeStrip />

      {/* ── Marquee / paisatge / contingut central ── */}
      <section className="home-intro">
        <div className="home-intro-photo" aria-hidden="true">
          <img
            src="/images/restaurant-emporda-michelin-girona.webp"
            alt=""
            className="home-intro-img"
          />
          <div className="home-intro-overlay" />
        </div>

        <div className="container-max home-intro-inner">
          <div className="home-intro-content">
            <span className="home-intro-label">{t('home.introLabel')}</span>
            <h2 className="font-serif font-light leading-tight tracking-tight home-intro-title">
              {t('home.introHeading').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
            <p className="font-sans home-intro-body">
              {t('home.introBody')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="features-section" ref={featuresRef} aria-label={t('home.featuresAria')}>
        <div className="container-max">
          <div className="features-grid">
            {FEATURES.map(({ tag, title, body, to, label }, i) => (
              <Link key={to} to={to} className="feature-card" style={{ '--i': i }}>
                <span className="feature-index" aria-hidden="true">0{i + 1}</span>
                <span className="feature-tag">{tag}</span>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-body">{body}</p>
                <span className="feature-cta">{label} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ChefSection />

      {/* ── CTA Reserva ── */}
      <section className="home-reserva-cta">
        <div className="container-max reveal" ref={ctaRef}>
          <span className="label block">{t('home.ctaLabel')}</span>
          <h2 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl
                         text-botic-cream leading-tight tracking-tight mt-4 mb-6">
            {t('home.ctaHeading')}
          </h2>
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
