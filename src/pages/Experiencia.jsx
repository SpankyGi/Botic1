import { useTranslation } from 'react-i18next'
import SEO          from '../components/SEO.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CTA          from '../components/CTA.jsx'
import { useLangRoutes } from '../i18n/LangContext'

function PageHero({ eyebrow, heading, aria, imgAlt }) {
  return (
    <section
      className="relative flex items-end min-h-[60vh] md:min-h-[65vh] overflow-hidden
                 bg-botic-dark pt-20"
      aria-label={aria}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/experiencia-hero.jpg)' }}
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

export default function Experiencia() {
  const { t }  = useTranslation()
  const routes = useLangRoutes()

  const MENU_MOMENTS = [
    { num: '01', label: t('experiencia.moment01Label'), text: t('experiencia.moment01Text') },
    { num: '02', label: t('experiencia.moment02Label'), text: t('experiencia.moment02Text') },
    { num: '03', label: t('experiencia.moment03Label'), text: t('experiencia.moment03Text') },
    { num: '04', label: t('experiencia.moment04Label'), text: t('experiencia.moment04Text') },
  ]

  return (
    <>
      <SEO
        title={t('seo.experiencia.title')}
        description={t('seo.experiencia.description')}
        pageKey="experiencia"
      />

      <PageHero
        aria={t('experiencia.heroAria')}
        imgAlt={t('experiencia.heroImgAlt')}
        eyebrow={t('experiencia.heroEyebrow')}
        heading={t('experiencia.heroHeading')}
      />

      {/* ── El ritme ── */}
      <section className="bg-botic-ivory py-20 md:py-28 lg:py-32" aria-labelledby="ritme-heading">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <SectionTitle
                theme="light"
                eyebrow={t('experiencia.ritmeEyebrow')}
                as="h2"
                heading={t('experiencia.ritmeHeading')}
              />
              <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                              text-botic-text/68 leading-relaxed">
                <p>{t('experiencia.ritmeP1')}</p>
                <p>{t('experiencia.ritmeP2')}</p>
                <p>{t('experiencia.ritmeP3')}</p>
              </div>
            </div>

            <div className="h-96 md:h-[520px] overflow-hidden bg-botic-stone">
              <img
                src="/images/sala-1.jpg"
                alt={t('experiencia.salaImgAlt')}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Estructura del menú ── */}
      <section className="bg-botic-black py-20 md:py-28" aria-labelledby="menu-heading">
        <div className="container-max">
          <div className="max-w-xl mb-14">
            <SectionTitle
              theme="dark"
              eyebrow={t('experiencia.menuEyebrow')}
              as="h2"
              heading={t('experiencia.menuHeading')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
            {MENU_MOMENTS.map(({ num, label, text }) => (
              <div
                key={num}
                className="border border-botic-border p-8 md:p-10
                           hover:border-botic-gold/40 transition-colors duration-300"
              >
                <span className="font-serif text-5xl font-light text-botic-surface
                                 block mb-4 leading-none">
                  {num}
                </span>
                <h3 className="font-serif font-light text-xl text-botic-cream
                               mb-3 tracking-tight">
                  {label}
                </h3>
                <p className="font-sans text-sm text-botic-muted leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 font-sans text-xs text-botic-muted tracking-[0.15em] uppercase">
            {t('experiencia.menuNote')}
          </p>
        </div>
      </section>

      {/* ── L'equip ── */}
      <section className="bg-botic-dark py-20 md:py-28" aria-labelledby="equip-heading">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="h-80 md:h-[480px] overflow-hidden bg-botic-surface">
              <img
                src="/images/equip.jpg"
                alt={t('experiencia.equipImgAlt')}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.opacity = '0' }}
              />
            </div>

            <div>
              <SectionTitle
                theme="dark"
                eyebrow={t('experiencia.equipEyebrow')}
                as="h2"
                heading={t('experiencia.equipHeading')}
              />
              <div className="mt-8 space-y-5 font-sans text-sm md:text-base
                              text-botic-muted leading-relaxed">
                <p>{t('experiencia.equipP1')}</p>
                <p>{t('experiencia.equipP2')}</p>
                <p>{t('experiencia.equipP3')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Els vins ── */}
      <section className="bg-botic-black py-16 md:py-20">
        <div className="container-max max-w-3xl text-center">
          <span className="label block text-center">{t('experiencia.vinsEyebrow')}</span>
          <h2
            className="font-serif font-light text-3xl md:text-4xl lg:text-5xl
                       text-botic-cream leading-tight tracking-tight mt-4 mb-8"
          >
            {t('experiencia.vinsHeading')}
          </h2>
          <p className="font-sans text-sm md:text-base text-botic-muted leading-relaxed mb-5">
            {t('experiencia.vinsP1')}
          </p>
          <p className="font-sans text-sm md:text-base text-botic-muted leading-relaxed mb-10">
            {t('experiencia.vinsP2')}
          </p>
        </div>
      </section>

      <CTA
        eyebrow={t('experiencia.ctaEyebrow')}
        heading={t('experiencia.ctaHeading')}
        body={t('experiencia.ctaBody')}
        linkTo={routes.reserves}
        linkLabel={t('experiencia.ctaBtn')}
        theme="dark"
      />
    </>
  )
}
