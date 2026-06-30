import { useTranslation } from 'react-i18next'
import SEO          from '../components/SEO.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CTA          from '../components/CTA.jsx'
import { useLangRoutes } from '../i18n/LangContext'

function PageHero({ img, alt, eyebrow, heading, subheading }) {
  return (
    <section
      className="relative flex items-end min-h-[60vh] md:min-h-[70vh] overflow-hidden
                 bg-botic-dark pt-20"
      aria-label={eyebrow}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
        role="img"
        aria-label={alt}
      />
      <div className="absolute inset-0 bg-gradient-to-t
                      from-botic-black via-botic-black/55 to-botic-black/15" />
      <div className="relative z-10 container-max w-full pb-14 md:pb-20 max-w-3xl">
        <span className="label">{eyebrow}</span>
        <h1 className="font-serif font-light text-4xl md:text-6xl lg:text-7xl
                       text-botic-cream leading-[1.05] tracking-tight">
          {heading}
        </h1>
        {subheading && (
          <p className="mt-5 font-sans text-sm md:text-base text-botic-stone/75
                        leading-relaxed max-w-lg">
            {subheading}
          </p>
        )}
      </div>
    </section>
  )
}

export default function Gastronomia() {
  const { t }  = useTranslation()
  const routes = useLangRoutes()

  const GALLERY = [
    { src: '/images/plat-1.jpg', alt: t('gastronomia.galleryAlt1') },
    { src: '/images/plat-2.jpg', alt: t('gastronomia.galleryAlt2') },
    { src: '/images/plat-3.jpg', alt: t('gastronomia.galleryAlt3') },
    { src: '/images/plat-4.jpg', alt: t('gastronomia.galleryAlt4') },
  ]

  return (
    <>
      <SEO
        title={t('seo.gastronomia.title')}
        description={t('seo.gastronomia.description')}
        pageKey="gastronomia"
      />

      <PageHero
        img="/images/gastronomia-hero.jpg"
        alt={t('gastronomia.heroImgAlt')}
        eyebrow={t('gastronomia.heroEyebrow')}
        heading={t('gastronomia.heroHeading')}
        subheading={t('gastronomia.heroSub')}
      />

      {/* ── El producte ── */}
      <section className="bg-botic-ivory py-20 md:py-28 lg:py-32" aria-labelledby="producte-heading">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            <div>
              <SectionTitle
                theme="light"
                eyebrow={t('gastronomia.producteEyebrow')}
                as="h2"
                heading={t('gastronomia.producteHeading')}
              />
              <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                              text-botic-text/68 leading-relaxed">
                <p>{t('gastronomia.producteP1')}</p>
                <p>{t('gastronomia.producteP2')}</p>
                <p>{t('gastronomia.producteP3')}</p>
              </div>
            </div>

            <div className="h-96 md:h-[520px] overflow-hidden bg-botic-stone">
              <img
                src="/images/producte.jpg"
                alt={t('gastronomia.producteImgAlt')}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── El territori ── */}
      <section className="bg-botic-black" aria-labelledby="territori-heading">
        <div className="h-72 md:h-[480px] overflow-hidden bg-botic-surface">
          <img
            src="/images/territori.jpg"
            alt={t('gastronomia.territorImgAlt')}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.opacity = '0' }}
          />
        </div>

        <div className="container-max py-16 md:py-24">
          <div className="max-w-2xl">
            <SectionTitle
              theme="dark"
              eyebrow={t('gastronomia.territorEyebrow')}
              as="h2"
              heading={t('gastronomia.territorHeading')}
            />
            <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                            text-botic-muted leading-relaxed">
              <p>{t('gastronomia.territorP1')}</p>
              <p>{t('gastronomia.territorP2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Galeria editorial ── */}
      <section className="bg-botic-dark" aria-label={t('gastronomia.galleryAria')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          <div className="h-72 md:h-auto md:row-span-2 overflow-hidden bg-botic-surface">
            <img
              src={GALLERY[0].src}
              alt={GALLERY[0].alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => { e.target.style.opacity = '0' }}
            />
          </div>
          {GALLERY.slice(1, 3).map(({ src, alt }) => (
            <div key={src} className="h-56 md:h-auto overflow-hidden bg-botic-surface">
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>
          ))}
        </div>
        <div className="h-64 md:h-96 overflow-hidden bg-botic-surface mt-0.5">
          <img
            src={GALLERY[3].src}
            alt={GALLERY[3].alt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            onError={(e) => { e.target.style.opacity = '0' }}
          />
        </div>
      </section>

      {/* ── La tècnica ── */}
      <section className="bg-botic-ivory py-20 md:py-28" aria-labelledby="tecnica-heading">
        <div className="container-max">
          <div className="max-w-2xl mx-auto text-center">
            <SectionTitle
              theme="light"
              eyebrow={t('gastronomia.tecnicaEyebrow')}
              as="h2"
              heading={t('gastronomia.tecnicaHeading')}
              align="center"
            />
            <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                            text-botic-text/65 leading-relaxed">
              <p>{t('gastronomia.tecnicaP1')}</p>
              <p>{t('gastronomia.tecnicaP2')}</p>
            </div>
          </div>
        </div>
      </section>

      <CTA
        eyebrow={t('gastronomia.ctaEyebrow')}
        heading={t('gastronomia.ctaHeading')}
        body={t('gastronomia.ctaBody')}
        linkTo={routes.reserves}
        linkLabel={t('gastronomia.ctaBtn')}
        secondaryLink={routes.experiencia}
        secondaryLabel={t('gastronomia.ctaSecondary')}
        theme="dark"
      />
    </>
  )
}
