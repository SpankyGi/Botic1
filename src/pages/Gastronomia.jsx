import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import { useLangRoutes } from '../i18n/LangContext'
import { useReveal } from '../hooks/useReveal.js'

const CHEF_ACTION = '/images/Albert Sastregener-empordà-botic-restaurant.webp'
const CHEF_PORTRAIT = '/images/albert-sastregener-cuina-emporda-girona.webp'
const TERRITORY = '/images/restaurant-emporda-michelin-girona.webp'
const DISH_IMAGE_ROOT = '/images/botic-maig-2026-webp'
const TECHNIQUE_ACTION = `${DISH_IMAGE_ROOT}/xef-acabant-plat-restaurant-botic.webp`

const DISH_SEQUENCE = [
  { file: 'presentacio-aperitiu-botic-costa-brava.webp', alt: 'galleryAlt2', shape: 'portrait' },
  { file: 'amanida-gastronomica-herbes-botic-emporda.webp', alt: 'galleryAlt1', shape: 'landscape' },
  { file: 'plat-peix-costa-brava-emporda-botic.webp', alt: 'galleryAlt3', shape: 'feature' },
  { file: 'tonyina-mar-costa-brava-alta-cuina-botic.webp', alt: 'galleryAlt3', shape: 'dark' },
  { file: 'plat-carn-fruits-vermells-botic.webp', alt: 'galleryAlt3', shape: 'landscape' },
  { file: 'postres-maduixes-menu-degustacio-botic.webp', alt: 'galleryAlt4', shape: 'portrait' },
]

const DESKTOP_GALLERY = [
  { file: 'xef-servint-brou-plat-peix-botic.webp', alt: 'galleryAlt2' },
  ...DISH_SEQUENCE,
  { file: 'escamarlans-marisc-restaurant-botic-emporda.webp', alt: 'galleryAlt3' },
  { file: 'plat-llamantol-restaurant-botic-emporda.webp', alt: 'galleryAlt3' },
  { file: 'plat-esparrecs-blancs-restaurant-botic.webp', alt: 'galleryAlt1' },
  { file: 'detall-postres-maduixes-botic-emporda.webp', alt: 'galleryAlt4' },
  { file: 'alta-cuina-empordanesa-restaurant-botic.webp', alt: 'galleryAlt3' },
]

function GastronomyHero({ t, routes }) {
  return (
    <section className="gst-hero" aria-labelledby="gst-hero-title">
      <img className="gst-hero-img" src={CHEF_ACTION} alt={t('gastronomia.heroImgAlt')} />
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
      <div className="gst-manifest-word" aria-hidden="true">MATÈRIA</div>
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
      <div className="gst-territory-line" aria-hidden="true"><span>PALAMÓS</span><i /><span>CORÇÀ</span><i /><span>EMPORDÀ</span></div>
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
              src={`${DISH_IMAGE_ROOT}/${dish.file}`}
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
        <span className="gst-technique-ghost" aria-hidden="true">GEST</span>
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
        <div className="gst-dishes-intro" aria-hidden="true"><span>01</span><i /><span>06</span></div>
        <div className="gst-dishes-grid">
          {DISH_SEQUENCE.map((dish, index) => (
            <figure className="gst-dish" key={dish.file}>
              <img src={`${DISH_IMAGE_ROOT}/${dish.file}`} alt={t(`gastronomia.${dish.alt}`)} loading="lazy" />
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
    <section className="gst-cta">
      <span className="gst-kicker">{t('gastronomia.ctaEyebrow')}</span>
      <h2>{t('gastronomia.ctaHeading')}</h2>
      <p>{t('gastronomia.ctaBody')}</p>
      <div className="gst-cta-actions">
        <Link className="btn-gold" to={routes.reserves}>{t('gastronomia.ctaBtn')}</Link>
        <Link className="gst-cta-secondary" to={routes.experiencia}>{t('gastronomia.ctaSecondary')}</Link>
      </div>
    </section>
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
