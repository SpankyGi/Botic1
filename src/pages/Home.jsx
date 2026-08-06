import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MarqueeStrip     from '../components/MarqueeStrip'
import ProjecteSection  from '../components/ProjecteSection'
import ChefSection      from '../components/ChefSection'
import SEO              from '../components/SEO'
import { useLangRoutes } from '../i18n/LangContext'

export default function Home() {
  const { t }       = useTranslation()
  const routes      = useLangRoutes()

  const FEATURES = [
    {
      tag:   t('home.featRestaurantTag'),
      title: t('home.featRestaurantTitle'),
      body:  t('home.featRestaurantBody'),
      to:    routes.restaurant,
      label: t('home.featRestaurantLabel'),
      image: '/images/restaurant-emporda-botic-michelin.webp',
    },
    {
      tag:   t('home.featGastroTag'),
      title: t('home.featGastroTitle'),
      body:  t('home.featGastroBody'),
      to:    routes.gastronomia,
      label: t('home.featGastroLabel'),
      image: '/images/restaurant-emporda-michelin-girona.webp',
    },
    {
      tag:   t('home.featExpTag'),
      title: t('home.featExpTitle'),
      body:  t('home.featExpBody'),
      to:    routes.experiencia,
      label: t('home.featExpLabel'),
      image: '/images/cristina-albert-botic-emporda-michelin.webp',
    },
  ]

  return (
    <>
      <SEO
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        pageKey="home"
      />

      <section className="home-new-hero">
        <div className="home-new-hero-copy">
          <span className="home-new-hero-eyebrow">{t('hero.awardLine')}</span>
          <h1>{t('hero.word1')}<br />{t('hero.word2')}</h1>
          <p>{t('hero.sub')}</p>
          <div className="home-new-hero-ctas">
            <Link to={routes.reserves} className="hero-btn-primary">{t('hero.btnPrimary')}</Link>
            <Link to={routes.menus} className="hero-btn-secondary">{t('hero.btnSecondary')}</Link>
          </div>
        </div>
        <div className="home-new-hero-media" aria-hidden="true">
          <img src="/images/restaurant-emporda-michelin-girona.webp" alt="" />
        </div>
      </section>

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
                <span className="home-intro-title-line" key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
            <p className="font-sans home-intro-body">
              {t('home.introBody')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="features-section" aria-label={t('home.featuresAria')}>
        <div className="container-max">
          <div className="features-grid">
            {FEATURES.map(({ tag, title, body, to, label, image }, i) => (
              <Link key={to} to={to} className="feature-card" style={{ '--i': i }}>
                <span className="feature-media" aria-hidden="true"><img src={image} alt="" /></span>
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
        <div className="container-max">
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
