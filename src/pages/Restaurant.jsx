import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import { useReveal } from '../hooks/useReveal'
import { useLangRoutes } from '../i18n/LangContext'

const BASE_URL = 'https://www.bo-tic.com'

/* Scroll progress (0→1 durant el primer viewport) per al parallax del hero.
   Es manté com a variable CSS; no s'activa si l'usuari prefereix menys moviment. */
function useHeroScrollProgress() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = null
    const update = () => {
      raf = null
      const p = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1)
      el.style.setProperty('--p', p.toFixed(3))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return ref
}

/* ── 1. Hero — cinematogràfic, immersiu, tipografia partida ──── */
function RestaurantHero({ t, routes }) {
  const heroRef = useHeroScrollProgress()
  const words = t('restaurant.heroHeading').split(' ')

  return (
    <section className="rst-hero" ref={heroRef} aria-label={t('restaurant.heroAria')}>
      <div className="rst-hero-media">
        <img
          src="/images/restaurant-botic-corca-emporda-exterior-nit.webp"
          alt={t('restaurant.heroImgAlt')}
          className="rst-hero-img"
        />
      </div>
      <div className="rst-hero-overlay" aria-hidden="true" />

      <span className="rst-hero-vert" aria-hidden="true">{t('restaurant.heroEyebrow')}</span>

      <div className="rst-hero-inner">
        <div className="container-max rst-hero-inner-max">
          <h1 className="rst-hero-title">
            {words.map((w, i) => (
              <span className="rst-hw" key={i} style={{ '--i': i }}><span>{w}</span></span>
            ))}
          </h1>
          <p className="rst-hero-sub">{t('restaurant.heroSub')}</p>
          <div className="rst-hero-ctas">
            <Link to={routes.reserves} className="btn-gold">{t('restaurant.bookBtn')}</Link>
            <a href="#origin" className="rst-hero-secondary">{t('restaurant.heroCtaSecondary')}</a>
          </div>
        </div>
      </div>

      <div className="rst-hero-scroll" aria-hidden="true"><span /></div>
    </section>
  )
}

/* ── 2. "Bo.TiC a Corçà" — foto a sang + targeta flotant ──────── */
function OriginSection({ t }) {
  const cardRef = useReveal(0.2)

  return (
    <section id="origin" className="rst-origin" aria-labelledby="origin-heading">
      <img
        src="/images/restaurant-emporda-michelin-girona.webp"
        alt={t('restaurant.originImgAlt')}
        className="rst-origin-bg"
        loading="lazy"
      />
      <div className="rst-origin-overlay" aria-hidden="true" />
      <span className="rst-origin-numeral" aria-hidden="true">I</span>

      <div className="container-max">
        <div className="rst-origin-card" ref={cardRef}>
          <span className="rst-eyebrow">{t('restaurant.originEyebrow')}</span>
          <h2 id="origin-heading" className="rst-origin-title">{t('restaurant.originHeading')}</h2>
          <div className="rst-sep" aria-hidden="true" />
          <p className="rst-origin-body">{t('restaurant.originP1')}</p>
          <p className="rst-origin-body">{t('restaurant.originP2')}</p>
          <p className="rst-origin-body">{t('restaurant.originP3')}</p>
        </div>
      </div>
    </section>
  )
}

/* ── 3. Arquitectura i espais — 3 fotogrames a sang, no caixes ── */
function ArchFrame({ num, img, alt, title, body, align }) {
  const ref = useReveal(0.22)

  return (
    <div className={`rst-arch-frame align-${align}`} ref={ref}>
      <img src={img} alt={alt} className="rst-arch-img" loading="lazy" />
      <div className="rst-arch-overlay" aria-hidden="true" />
      <span className="rst-arch-num" aria-hidden="true">{num}</span>
      <div className="rst-arch-caption">
        <h3 className="rst-arch-title">{title}</h3>
        <p className="rst-arch-body">{body}</p>
      </div>
    </div>
  )
}

function ArchitectureSection({ t }) {
  const headerRef = useReveal(0.2)

  const ROOMS = [
    {
      num: '01',
      img: '/images/cristina-albert-botic-emporda-michelin.webp',
      alt: t('restaurant.archRoom1ImgAlt'),
      title: t('restaurant.archRoom1Title'),
      body: t('restaurant.archRoom1Body'),
      align: 'left',
    },
    {
      num: '02',
      img: '/images/Albert Sastregener-empordà-botic-restaurant.webp',
      alt: t('restaurant.archRoom2ImgAlt'),
      title: t('restaurant.archRoom2Title'),
      body: t('restaurant.archRoom2Body'),
      align: 'right',
    },
    {
      num: '03',
      img: '/images/restaurant-emporda-botic-michelin.webp',
      alt: t('restaurant.archRoom3ImgAlt'),
      title: t('restaurant.archRoom3Title'),
      body: t('restaurant.archRoom3Body'),
      align: 'center',
    },
  ]

  return (
    <section className="rst-arch" aria-labelledby="arch-heading">
      <div className="rst-arch-header reveal" ref={headerRef}>
        <span className="rst-eyebrow">{t('restaurant.archEyebrow')}</span>
        <h2 id="arch-heading" className="rst-arch-heading">{t('restaurant.archHeading')}</h2>
      </div>
      {ROOMS.map((room) => <ArchFrame key={room.num} {...room} />)}
    </section>
  )
}

/* ── 4. Galeria — filmstrip horitzontal, secció icònica ───────── */
function GallerySection({ t }) {
  const headerRef = useReveal(0.15)
  const trackRef  = useRef(null)

  // Permet desplaçar la galeria horitzontalment amb la roda vertical del ratolí
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = trackRef.current
    if (!el) return
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      el.scrollLeft += e.deltaY
      e.preventDefault()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  const IMAGES = [
    { src: '/images/Albert Sastregener-empordà-botic-restaurant.webp', alt: t('restaurant.galleryAlt1') },
    { src: '/images/albert-sastregener-cuina-emporda-girona.webp',     alt: t('restaurant.galleryAlt2') },
    { src: '/images/cristina-albert-botic-emporda-michelin.webp',     alt: t('restaurant.galleryAlt3') },
    { src: '/images/restaurant-emporda-botic-michelin.webp',          alt: t('restaurant.galleryAlt4') },
    { src: '/images/restaurant-emporda-michelin-girona.webp',         alt: t('restaurant.galleryAlt5') },
  ]

  return (
    <section className="rst-gallery" aria-labelledby="gallery-heading">
      <div className="rst-gallery-label reveal" ref={headerRef}>
        <span className="rst-eyebrow">{t('restaurant.galleryEyebrow')}</span>
        <h2 id="gallery-heading" className="rst-gallery-heading">{t('restaurant.galleryHeading')}</h2>
      </div>
      <div className="rst-gallery-track" ref={trackRef}>
        {IMAGES.map((img, i) => (
          <div key={img.src} className={`rst-gallery-item item-${i + 1}`}>
            <img src={img.src} alt={img.alt} className="rst-gallery-img" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── 5. Reserva i informació pràctica — partició en diagonal ─── */
function ScrollArchitectureSection({ t }) {
  const storyRef = useRef(null)
  const [activeScene, setActiveScene] = useState(0)
  const [showStoryIntro, setShowStoryIntro] = useState(true)

  const scenes = [
    {
      num: '01',
      img: '/images/restaurant-emporda-michelin-girona.webp',
      alt: t('restaurant.originImgAlt'),
      title: t('restaurant.originHeading'),
      body: [t('restaurant.originP1'), t('restaurant.originP2'), t('restaurant.originP3')],
    },
    {
      num: '02',
      img: '/images/restaurant-botic-corca-emporda-exterior-nit.webp',
      alt: t('restaurant.archRoom1ImgAlt'),
      title: t('restaurant.archRoom1Title'),
      body: t('restaurant.archRoom1Body'),
    },
    {
      num: '03',
      img: '/images/restaurant-emporda-botic-michelin.webp',
      alt: t('restaurant.archRoom2ImgAlt'),
      title: t('restaurant.archRoom2Title'),
      body: t('restaurant.archRoom2Body'),
    },
    {
      num: '04',
      img: '/images/cristina-albert-botic-emporda-michelin.webp',
      alt: t('restaurant.archRoom3ImgAlt'),
      title: t('restaurant.archRoom3Title'),
      body: t('restaurant.archRoom3Body'),
    },
    {
      num: '05',
      img: '/images/Albert Sastregener-empordà-botic-restaurant.webp',
      alt: t('restaurant.archRoom4ImgAlt'),
      title: t('restaurant.archRoom4Title'),
      body: t('restaurant.archRoom4Body'),
    },
  ]

  useEffect(() => {
    const el = storyRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let raf = null
    const update = () => {
      raf = null
      if (window.innerWidth <= 768) return
      const rect = el.getBoundingClientRect()
      const distance = Math.max(el.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(Math.max(-rect.top / distance, 0), 1)
      const nextScene = Math.min(scenes.length - 1, Math.floor(progress * scenes.length))
      setActiveScene((current) => current === nextScene ? current : nextScene)
      setShowStoryIntro((current) => current === (progress < 0.075) ? current : progress < 0.075)
      el.style.setProperty('--story-progress', progress.toFixed(3))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [scenes.length])

  return (
    <section className={`rst-story${showStoryIntro ? ' is-intro' : ''}`} aria-labelledby="story-heading">
      <div className="rst-story-scroll" ref={storyRef}>
        <div className="rst-story-stage">
          <div className="rst-story-scenes">
            {scenes.map((scene, index) => (
              <article
                key={scene.num}
                className={`rst-story-scene${index === activeScene ? ' is-active' : ''}${index < activeScene ? ' is-past' : ''}`}
              >
                <img src={scene.img} alt={scene.alt} className="rst-story-img" loading={index === 0 ? 'eager' : 'lazy'} />
                <div className="rst-story-shade" aria-hidden="true" />
                <div className="rst-story-copy">
                  <span className="rst-story-number">{scene.num}</span>
                  <h3>{scene.title}</h3>
                  {(Array.isArray(scene.body) ? scene.body : [scene.body]).map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="rst-story-intro">
            <span className="rst-eyebrow">{t('restaurant.archEyebrow')}</span>
            <h2 id="story-heading" className="rst-arch-heading">{t('restaurant.archHeading')}</h2>
            <span className="rst-story-intro-line" aria-hidden="true" />
          </div>

          <div className="rst-story-chrome" aria-hidden="true">
            <span>{String(activeScene + 1).padStart(2, '0')}</span>
            <div className="rst-story-rail"><span style={{ height: `${((activeScene + 1) / scenes.length) * 100}%` }} /></div>
            <span>{String(scenes.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function GalleryEpilogue({ t }) {
  const headerRef = useReveal(0.15)
  const images = [
    { src: '/images/albert-sastregener-cuina-emporda-girona.webp', alt: t('restaurant.galleryAlt2') },
    { src: '/images/restaurant-emporda-michelin-girona.webp', alt: t('restaurant.galleryAlt5') },
  ]

  return (
    <section className="rst-gallery rst-gallery--epilogue" aria-labelledby="gallery-epilogue-heading">
      <div className="rst-gallery-label reveal" ref={headerRef}>
        <span className="rst-eyebrow">{t('restaurant.galleryEyebrow')}</span>
        <h2 id="gallery-epilogue-heading" className="rst-gallery-heading">{t('restaurant.galleryHeading')}</h2>
      </div>
      <div className="rst-gallery-epilogue">
        {images.map((image, index) => (
          <figure className={`rst-gallery-epilogue-item item-${index + 1}`} key={image.src}>
            <img src={image.src} alt={image.alt} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  )
}

function ReserveSection({ t, routes }) {
  const contentRef = useReveal(0.12)

  return (
    <section className="rst-reserve" aria-labelledby="reserve-heading">
      <div className="rst-reserve-photo">
        <img
          src="/images/restaurant-emporda-botic-michelin.webp"
          alt={t('restaurant.reserveImgAlt')}
          className="rst-reserve-img"
          loading="lazy"
        />
      </div>
      <div className="rst-reserve-content reveal" ref={contentRef}>
        <span className="rst-eyebrow">{t('restaurant.reserveEyebrow')}</span>
        <h2 id="reserve-heading" className="rst-reserve-heading">{t('restaurant.reserveHeading')}</h2>

        <div className="rst-reserve-block">
          <h3 className="rst-reserve-block-title">{t('restaurant.reserveImportantTitle')}</h3>
          <p className="rst-reserve-block-body">{t('restaurant.reserveImportantBody')}</p>
        </div>

        <div className="rst-reserve-block">
          <h3 className="rst-reserve-block-title">{t('restaurant.reservePolicyTitle')}</h3>
          <ul className="rst-reserve-list">
            <li>{t('restaurant.reservePolicy1')}</li>
            <li>{t('restaurant.reservePolicy2')}</li>
            <li>{t('restaurant.reservePolicy3')}</li>
            <li>{t('restaurant.reservePolicy4')}</li>
            <li>{t('restaurant.reservePolicy5')}</li>
          </ul>
        </div>

        <div className="rst-reserve-block">
          <h3 className="rst-reserve-block-title">{t('restaurant.reserveTaxiTitle')}</h3>
          <p className="rst-reserve-block-body">{t('restaurant.reserveTaxiBody')}</p>
        </div>

        <Link to={routes.reserves} className="btn-gold rst-reserve-btn">{t('restaurant.bookBtn')}</Link>
      </div>
    </section>
  )
}

/* ── 6. Equip — asimètric, tipografia que trepitja la foto ────── */
function TeamSection({ t }) {
  const headerRef  = useReveal(0.15)
  const kitchenRef = useReveal(0.15)
  const salaRef    = useReveal(0.15)

  return (
    <section className="rst-team" aria-labelledby="team-heading">
      <div className="container-max">
        <div className="rst-team-header reveal" ref={headerRef}>
          <span className="rst-eyebrow">{t('restaurant.teamEyebrow')}</span>
          <h2 id="team-heading" className="rst-team-heading">{t('restaurant.teamHeading')}</h2>
          <p className="rst-team-sub">{t('restaurant.teamSub')}</p>
        </div>

        <div className="rst-team-grid">
          <div className="rst-team-block kitchen reveal" ref={kitchenRef}>
            <div className="rst-team-photo">
              <img
                src="/images/albert-sastregener-cuina-emporda-girona.webp"
                alt={t('restaurant.kitchenImgAlt')}
                className="rst-team-img"
                loading="lazy"
              />
            </div>
            <span className="rst-team-label">{t('restaurant.kitchenLabel')}</span>
            <h3 className="rst-team-name">{t('restaurant.kitchenName')}</h3>
            <p className="rst-team-body">{t('restaurant.kitchenBody')}</p>
          </div>

          <div className="rst-team-block sala reveal" ref={salaRef}>
            <div className="rst-team-photo sala">
              <img
                src="/images/cristina-albert-botic-emporda-michelin.webp"
                alt={t('restaurant.salaImgAlt')}
                className="rst-team-img"
                loading="lazy"
              />
            </div>
            <span className="rst-team-label">{t('restaurant.salaLabel')}</span>
            <h3 className="rst-team-name">{t('restaurant.salaName')}</h3>
            <p className="rst-team-body">{t('restaurant.salaBody')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 7. CTA final — ticker de moviment + estil ja existent ────── */
function FinalTicker({ t }) {
  const words = [
    t('restaurant.heroEyebrow'),
    t('restaurant.originEyebrow'),
    t('restaurant.archEyebrow'),
    t('restaurant.galleryEyebrow'),
    t('restaurant.teamEyebrow'),
  ]
  const line = words.join('   ·   ') + '   ·   '

  return (
    <div className="rst-ticker" aria-hidden="true">
      <div className="rst-ticker-track">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  )
}

function FinalCTA({ t, routes }) {
  const ref = useReveal(0.18)

  return (
    <>
      <FinalTicker t={t} />
      <section className="home-reserva-cta">
        <div className="container-max reveal" ref={ref}>
          <span className="label block">{t('restaurant.finalEyebrow')}</span>
          <h2 className="font-serif font-light text-4xl md:text-5xl lg:text-6xl
                         text-botic-cream leading-tight tracking-tight mt-4 mb-6">
            {t('restaurant.finalHeading')}
          </h2>
          <p className="font-sans text-sm md:text-base leading-relaxed max-w-md mx-auto mb-10">
            {t('restaurant.finalBody')}
          </p>
          <div className="rst-final-ctas">
            <Link to={routes.reserves} className="btn-gold">{t('restaurant.bookBtn')}</Link>
            <Link to={routes.menus} className="btn-cream">{t('restaurant.finalBtnMenus')}</Link>
          </div>
        </div>
      </section>
    </>
  )
}

/* ── Pàgina principal ─────────────────────────────────────────── */
export default function Restaurant() {
  const { t }  = useTranslation()
  const routes = useLangRoutes()

  // Schema.org: Restaurant + BreadcrumbList (dades reals ja usades a Footer/Reserves)
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Restaurant',
          name: 'Bo.TiC',
          image: `${BASE_URL}/images/restaurant-botic-corca-emporda-exterior-nit.webp`,
          url: `${BASE_URL}${routes.restaurant}`,
          telephone: '+34972630869',
          email: 'restaurant@bo-tic.com',
          priceRange: '€€€€',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Carrer dels Forns, 7',
            addressLocality: 'Corçà',
            postalCode: '17121',
            addressRegion: 'Girona',
            addressCountry: 'ES',
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Bo.TiC', item: `${BASE_URL}${routes.home}` },
            { '@type': 'ListItem', position: 2, name: t('restaurant.heroEyebrow'), item: `${BASE_URL}${routes.restaurant}` },
          ],
        },
      ],
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'restaurant-schema'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => { document.getElementById('restaurant-schema')?.remove() }
  }, [t, routes])

  return (
    <>
      <SEO
        title={t('seo.restaurant.title')}
        description={t('seo.restaurant.description')}
        pageKey="restaurant"
        ogImage={`${BASE_URL}/images/restaurant-botic-corca-emporda-exterior-nit.webp`}
      />

      <RestaurantHero t={t} routes={routes} />
      <ScrollArchitectureSection t={t} />
      <TeamSection t={t} />
      <FinalCTA t={t} routes={routes} />
    </>
  )
}
