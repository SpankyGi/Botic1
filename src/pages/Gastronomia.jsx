import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import ClosingCTA from '../components/ClosingCTA.jsx'
import { useLangRoutes } from '../i18n/LangContext'
import { useReveal } from '../hooks/useReveal.js'

const CHEF_ACTION = '/images/Albert Sastregener-empordà-botic-restaurant.webp'
const CHEF_PORTRAIT = '/images/albert-sastregener-cuina-emporda-girona.webp'
const TERRITORY = '/images/restaurant-emporda-michelin-girona.webp'
const TECHNIQUE_IMAGE_ROOT = '/images/gastronomia-technique'
const TECHNIQUE_ACTION = `${TECHNIQUE_IMAGE_ROOT}/restaurant-botic-emporda-preparacio-xef-02.webp`

const TECHNIQUE_DETAIL_SEQUENCE = [
  { file: 'restaurant-botic-emporda-preparacio-xef-01.webp', alt: 'galleryAlt2', shape: 'landscape' },
  { file: 'restaurant-botic-emporda-plat-signatura-01.webp', alt: 'galleryAlt3', shape: 'landscape' },
  { file: 'restaurant-botic-emporda-preparacio-xef-03.webp', alt: 'galleryAlt3', shape: 'landscape' },
  { file: 'restaurant-botic-emporda-preparacio-xef-04.webp', alt: 'galleryAlt2', shape: 'landscape' },
  { file: 'restaurant-botic-emporda-preparacio-xef-06.webp', alt: 'galleryAlt1', shape: 'landscape' },
]

const DESKTOP_GALLERY = TECHNIQUE_DETAIL_SEQUENCE

function GastronomyHero({ t, routes }) {
  return (
    <section className="gst-hero" aria-labelledby="gst-hero-title">
      <video
        className="gst-hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={CHEF_ACTION}
        aria-hidden="true"
      >
        <source media="(max-width: 768px)" src="/images/producte-gastronomia-botic-emporda-mobile.webm" type="video/webm" />
        <source src="/images/producte-gastronomia-botic-emporda.webm" type="video/webm" />
      </video>
      <div className="gst-hero-shade" aria-hidden="true" />
      <div className="gst-hero-grain" aria-hidden="true" />
      <div className="gst-hero-copy">
        <span className="gst-kicker">{t('gastronomia.heroEyebrow')}</span>
        <h1 id="gst-hero-title">{t('gastronomia.heroHeading')}</h1>
        <p>{t('gastronomia.heroSub')}</p>
        <Link className="gst-text-link" to={routes.experiencia}>{t('gastronomia.ctaSecondary')}</Link>
      </div>
      <span className="gst-hero-index" aria-hidden="true">01 / 04</span>
      <div className="gst-scroll-cue" aria-hidden="true"><span /></div>
    </section>
  )
}

function ProductManifest({ t }) {
  const revealRef = useReveal(0.08)
  const principles = [
    { number: '01', text: t('gastronomia.producteP1') },
    { number: '02', text: t('gastronomia.producteP2') },
    { number: '03', text: t('gastronomia.producteP3') },
  ]

  return (
    <section className="gst-manifest" aria-labelledby="gst-product-title">
      <div className="gst-manifest-word" aria-hidden="true">{t('gastronomia.producteGhost')}</div>
      <div className="gst-manifest-inner reveal" ref={revealRef}>
        <header className="gst-section-head">
          <span className="gst-kicker">{t('gastronomia.producteEyebrow')}</span>
          <h2 id="gst-product-title">{t('gastronomia.producteHeading')}</h2>
        </header>
        <div className="gst-principles">
          {principles.map((principle) => (
            <article className="gst-principle" key={principle.number}>
              <span>{principle.number}</span>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function TerritorySection({ t }) {
  const revealRef = useReveal(0.12)
  return (
    <section className="gst-territory" aria-labelledby="gst-territory-title">
      <img src={TERRITORY} alt={t('gastronomia.territorImgAlt')} loading="lazy" />
      <div className="gst-territory-shade" aria-hidden="true" />
      <div className="gst-territory-copy reveal" ref={revealRef}>
        <span className="gst-kicker">{t('gastronomia.territorEyebrow')}</span>
        <h2 id="gst-territory-title">{t('gastronomia.territorHeading')}</h2>
        <div>
          <p>{t('gastronomia.territorP1')}</p>
          <p>{t('gastronomia.territorP2')}</p>
        </div>
      </div>
      <div className="gst-territory-line" aria-hidden="true">{t('gastronomia.territoryLine')}</div>
    </section>
  )
}

function TechniqueSection({ t }) {
  const revealRef = useReveal(0.1)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [galleryPaused, setGalleryPaused] = useState(false)
  const galleryTotal = DESKTOP_GALLERY.length
  const changeGallery = (direction) => setGalleryIndex((current) => (current + direction + galleryTotal) % galleryTotal)

  useEffect(() => {
    if (galleryPaused) return undefined
    const timer = window.setInterval(() => changeGallery(1), 5200)
    return () => window.clearInterval(timer)
  }, [galleryPaused, galleryTotal])

  return (
    <section className="gst-technique" aria-labelledby="gst-technique-title">
      <div className="gst-technique-stage">
        <div className="gst-technique-canvas">
        <figure className="gst-technique-main">
          <img src={TECHNIQUE_ACTION} alt={t('gastronomia.galleryAlt2')} loading="lazy" />
        </figure>
        <figure
          className="gst-technique-detail"
          aria-label={t('gastronomia.galleryAria')}
          onMouseEnter={() => setGalleryPaused(true)}
          onMouseLeave={() => setGalleryPaused(false)}
          onFocusCapture={() => setGalleryPaused(true)}
          onBlurCapture={() => setGalleryPaused(false)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') changeGallery(-1)
            if (event.key === 'ArrowRight') changeGallery(1)
          }}
        >
          {DESKTOP_GALLERY.map((dish, index) => (
            <img
              key={dish.file}
              className={index === galleryIndex ? 'is-active' : ''}
              src={`${TECHNIQUE_IMAGE_ROOT}/${dish.file}`}
              alt={t(`gastronomia.${dish.alt}`)}
              loading="lazy"
            />
          ))}
          <button className="gst-gallery-arrow gst-gallery-prev" type="button" onClick={() => changeGallery(-1)} aria-label={t('gastronomia.galleryPrev')}><span aria-hidden="true">←</span></button>
          <button className="gst-gallery-arrow gst-gallery-next" type="button" onClick={() => changeGallery(1)} aria-label={t('gastronomia.galleryNext')}><span aria-hidden="true">→</span></button>
          <figcaption aria-live="polite">
            <span>{String(galleryIndex + 1).padStart(2, '0')}</span>
            <i><b style={{ transform: `scaleX(${(galleryIndex + 1) / galleryTotal})` }} /></i>
            <span>{String(galleryTotal).padStart(2, '0')}</span>
          </figcaption>
        </figure>
        <span className="gst-technique-ghost" aria-hidden="true">{t('gastronomia.tecnicaGhost')}</span>
        </div>
        <div className="gst-technique-copy reveal" ref={revealRef}>
          <span className="gst-kicker">{t('gastronomia.tecnicaEyebrow')}</span>
          <h2 id="gst-technique-title">{t('gastronomia.tecnicaHeading')}</h2>
          <p>{t('gastronomia.tecnicaP1')}</p>
          <p>{t('gastronomia.tecnicaP2')}</p>
        </div>
        <img className="gst-technique-signature" src={CHEF_PORTRAIT} alt={t('gastronomia.producteImgAlt')} loading="lazy" />
      </div>
      <div className="gst-dishes gst-dishes-mobile" aria-label={t('gastronomia.galleryAria')}>
        <div className="gst-dishes-intro" aria-hidden="true"><span>01</span><i /><span>{String(TECHNIQUE_DETAIL_SEQUENCE.length).padStart(2, '0')}</span></div>
        <div className="gst-dishes-grid">
          {TECHNIQUE_DETAIL_SEQUENCE.map((dish, index) => (
            <figure className="gst-dish" key={dish.file}>
              <img src={`${TECHNIQUE_IMAGE_ROOT}/${dish.file}`} alt={t(`gastronomia.${dish.alt}`)} loading="lazy" />
              <figcaption aria-hidden="true">{String(index + 1).padStart(2, '0')}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function GastronomyCTA({ t, routes }) {
  return (
    <ClosingCTA
      id="gastronomy-closing-cta"
      tone="light"
      eyebrow={t('closingCta.gastronomy.eyebrow')}
      heading={t('closingCta.gastronomy.heading')}
      primaryTo={routes.menus}
      primaryLabel={t('closingCta.gastronomy.primary')}
      secondaryTo={routes.reserves}
      secondaryLabel={t('closingCta.gastronomy.secondary')}
    />
  )
}

export default function Gastronomia() {
  const { t } = useTranslation()
  const routes = useLangRoutes()

  return (
    <>
      <SEO
        title={t('seo.gastronomia.title')}
        description={t('seo.gastronomia.description')}
        pageKey="gastronomia"
      />
      <GastronomyHero t={t} routes={routes} />
      <ProductManifest t={t} />
      <TerritorySection t={t} />
      <TechniqueSection t={t} />
      <GastronomyCTA t={t} routes={routes} />
    </>
  )
}
