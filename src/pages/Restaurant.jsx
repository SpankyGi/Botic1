import { useTranslation } from 'react-i18next'
import SEO          from '../components/SEO.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CTA          from '../components/CTA.jsx'
import { useLangRoutes } from '../i18n/LangContext'

function PageHero({ eyebrow, heading, imgAlt, aria }) {
  return (
    <section
      className="relative flex items-end min-h-[60vh] md:min-h-[65vh] overflow-hidden
                 bg-botic-dark pt-20"
      aria-label={aria}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/restaurant-hero.jpg)' }}
        role="img"
        aria-label={imgAlt}
      />
      <div className="absolute inset-0 bg-gradient-to-t
                      from-botic-black via-botic-black/55 to-botic-black/15" />
      <div className="relative z-10 container-max w-full pb-14 md:pb-20">
        <span className="label">{eyebrow}</span>
        <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl
                       text-botic-cream leading-[1.05] tracking-tight max-w-2xl">
          {heading}
        </h1>
      </div>
    </section>
  )
}

export default function Restaurant() {
  const { t }  = useTranslation()
  const routes = useLangRoutes()

  const GALLERY = [
    { src: '/images/sala-2.jpg',   alt: t('restaurant.galleryAlt1') },
    { src: '/images/exterior.jpg', alt: t('restaurant.galleryAlt2') },
    { src: '/images/detall.jpg',   alt: t('restaurant.galleryAlt3') },
  ]

  return (
    <>
      <SEO
        title={t('seo.restaurant.title')}
        description={t('seo.restaurant.description')}
        pageKey="restaurant"
      />

      <PageHero
        aria={t('restaurant.heroAria')}
        imgAlt={t('restaurant.heroImgAlt')}
        eyebrow={t('restaurant.heroEyebrow')}
        heading={t('restaurant.heroHeading')}
      />

      {/* ── El concepte ── */}
      <section className="bg-botic-ivory py-20 md:py-28 lg:py-32" aria-labelledby="concept-heading">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div>
              <SectionTitle
                theme="light"
                eyebrow={t('restaurant.conceptEyebrow')}
                as="h2"
                heading={t('restaurant.conceptHeading')}
              />
              <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                              text-botic-text/68 leading-relaxed">
                <p>{t('restaurant.conceptP1')}</p>
                <p>{t('restaurant.conceptP2')}</p>
                <p>{t('restaurant.conceptP3')}</p>
              </div>
            </div>

            <div className="h-96 md:h-[520px] overflow-hidden bg-botic-stone">
              <img
                src="/images/concept.jpg"
                alt={t('restaurant.heroImgAlt')}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── L'espai ── */}
      <section className="bg-botic-black py-20 md:py-28" aria-labelledby="space-heading">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <SectionTitle
                theme="dark"
                eyebrow={t('restaurant.spaceEyebrow')}
                as="h2"
                heading={t('restaurant.spaceHeading')}
              />
              <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                              text-botic-muted leading-relaxed">
                <p>{t('restaurant.spaceP1')}</p>
                <p>{t('restaurant.spaceP2')}</p>
                <p>{t('restaurant.spaceP3')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 h-[480px]">
              <div className="overflow-hidden bg-botic-surface row-span-2">
                <img
                  src={GALLERY[0].src}
                  alt={GALLERY[0].alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.opacity = '0' }}
                />
              </div>
              {GALLERY.slice(1).map(({ src, alt }) => (
                <div key={src} className="overflow-hidden bg-botic-surface">
                  <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.opacity = '0' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── El servei ── */}
      <section className="bg-botic-dark py-20 md:py-28" aria-labelledby="service-heading">
        <div className="container-max max-w-2xl">
          <SectionTitle
            theme="dark"
            eyebrow={t('restaurant.serviceEyebrow')}
            as="h2"
            heading={t('restaurant.serviceHeading')}
          />
          <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                          text-botic-muted leading-relaxed">
            <p>{t('restaurant.serviceP1')}</p>
            <p>{t('restaurant.serviceP2')}</p>
          </div>
        </div>
      </section>

      <CTA
        eyebrow={t('restaurant.ctaEyebrow')}
        heading={t('restaurant.ctaHeading')}
        body={t('restaurant.ctaBody')}
        linkTo={routes.reserves}
        linkLabel={t('restaurant.ctaBtn')}
        theme="dark"
      />
    </>
  )
}
