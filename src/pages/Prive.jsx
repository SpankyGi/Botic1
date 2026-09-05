import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import ResponsiveImage from '../components/ResponsiveImage'
import PriveWordmark from '../components/PriveWordmark'
import { useReveal } from '../hooks/useReveal'
import { useLang, useLangRoutes } from '../i18n/LangContext'
import { PRIVE_CONTENT } from '../data/priveContent'

const BASE_URL = 'https://www.bo-tic.com'

function Lines({ text }) {
  return text.split('\n').map((line, index) => <span key={`${line}-${index}`}>{line}</span>)
}

function PriveSchema({ pageKey, title, description, routes }) {
  useEffect(() => {
    const url = `${BASE_URL}${routes[pageKey]}`
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = `prive-schema-${pageKey}`
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: title,
      description,
      provider: {
        '@type': 'Restaurant',
        name: 'Bo.TiC',
        telephone: '+34972630869',
        email: 'restaurant@bo-tic.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Carrer dels Forns, 7',
          addressLocality: 'Corçà',
          postalCode: '17121',
          addressRegion: 'Girona',
          addressCountry: 'ES',
        },
      },
      areaServed: { '@type': 'AdministrativeArea', name: 'Empordà' },
      url,
    })
    document.head.appendChild(script)
    return () => script.remove()
  }, [pageKey, title, description, routes])
  return null
}

function PriveHero({ content, image, mobileImage, compact = false }) {
  return (
    <section className={`prv-hero${compact ? ' prv-hero--detail' : ''}`}>
      <ResponsiveImage src={image} mobileSrc={mobileImage} alt="" className="prv-hero__image" fetchpriority="high" />
      <div className="prv-hero__veil" aria-hidden="true" />
      <div className="prv-hero__monogram" aria-hidden="true">P</div>
      <div className="prv-hero__copy">
        <span className="prv-kicker">{content.eyebrow}</span>
        <h1>{compact ? <Lines text={content.title} /> : <PriveWordmark endorsed />}</h1>
        <p>{content.lead}</p>
      </div>
      <span className="prv-hero__edge" aria-hidden="true">BO·TIC · CORÇÀ · EMPORDÀ</span>
    </section>
  )
}

function ContactEnding({ common, kicker, title }) {
  return (
    <section className="prv-contact" aria-labelledby="prv-contact-title">
      <div className="prv-shell prv-contact__inner">
        <div>
          <span className="prv-kicker">{kicker}</span>
          <h2 id="prv-contact-title">{title}</h2>
        </div>
        <div className="prv-contact__actions">
          <a className="prv-button" href="mailto:restaurant@bo-tic.com?subject=Bo.TiC%20Priv%C3%A9">{common.contact}</a>
          <a className="prv-text-link" href="tel:+34972630869">{common.phone}</a>
        </div>
      </div>
    </section>
  )
}

function HubIntro({ content }) {
  const ref = useReveal(0.12)
  return (
    <section className="prv-intro">
      <div className="prv-shell prv-intro__grid reveal" ref={ref}>
        <span className="prv-kicker">{content.introKicker}</span>
        <h2>{content.introTitle}</h2>
        <p>{content.introBody}</p>
      </div>
    </section>
  )
}

function PathCard({ item, to, image, mobileImage }) {
  return (
    <Link to={to} className="prv-path">
      <ResponsiveImage src={image} mobileSrc={mobileImage} alt="" className="prv-path__image" loading="lazy" />
      <span className="prv-path__shade" aria-hidden="true" />
      <span className="prv-path__index">{item.index}</span>
      <div className="prv-path__copy">
        <h3>{item.title}</h3>
        <p>{item.text}</p>
        <span className="prv-path__cta">{item.cta}<i aria-hidden="true">→</i></span>
      </div>
    </Link>
  )
}

function FormatCard({ item, image, mobileImage, to, email = false }) {
  const content = (
    <>
      <ResponsiveImage src={image} mobileSrc={mobileImage} alt="" className="prv-format__image" loading="lazy" />
      <span className="prv-format__veil" aria-hidden="true" />
      <div className="prv-format__copy">
        <span className="prv-format__label">{item.label}</span>
        <h3><Lines text={item.title} /></h3>
        <p>{item.text}</p>
        <span className="prv-format__note">{item.note}</span>
        <span className="prv-format__cta">{item.cta}<i aria-hidden="true">→</i></span>
      </div>
    </>
  )

  return email
    ? <a href="mailto:restaurant@bo-tic.com?subject=Bo.TiC%20Priv%C3%A9" className="prv-format">{content}</a>
    : <Link to={to} className="prv-format">{content}</Link>
}

export default function Prive() {
  const lang = useLang()
  const routes = useLangRoutes()
  const { t } = useTranslation()
  const { common, hub } = PRIVE_CONTENT[lang]
  const pillarsRef = useReveal(0.1)

  return (
    <div className="prv-page">
      <SEO title={t('seo.prive.title')} description={t('seo.prive.description')} pageKey="prive" ogImage={`${BASE_URL}/images/restaurant-botic-corca-emporda-sala-gastronomica.webp`} />
      <PriveSchema pageKey="prive" title="Bo·TiC Privé" description={hub.introBody} routes={routes} />
      <PriveHero content={hub} image="/images/restaurant-botic-corca-emporda-sala-gastronomica.webp" mobileImage="/images/restaurant-botic-corca-emporda-sala-gastronomica-mobile.webp" />
      <HubIntro content={hub} />

      <section className="prv-formats" aria-labelledby="prv-formats-title">
        <header className="prv-shell prv-formats__head">
          <span className="prv-kicker">{hub.formatsKicker}</span>
          <h2 id="prv-formats-title">{hub.formatsTitle}</h2>
        </header>
        <div className="prv-formats__grid">
          <FormatCard item={hub.atHome} to={routes.priveCelebrations} image="/images/restaurant-botic-corca-emporda-exterior-nit.webp" mobileImage="/images/restaurant-botic-corca-emporda-exterior-nit-mobile.webp" />
          <FormatCard item={hub.atBotic} email image="/images/restaurant-sala-arcs-emporda.webp" mobileImage="/images/restaurant-sala-arcs-emporda-mobile.webp" />
        </div>
      </section>

      <section className="prv-paths" aria-labelledby="prv-paths-title">
        <header className="prv-shell prv-section-head">
          <span className="prv-kicker">{hub.pathsKicker}</span>
          <h2 id="prv-paths-title">{hub.pathsTitle}</h2>
        </header>
        <div className="prv-paths__grid">
          <PathCard item={hub.celebrations} to={routes.priveCelebrations} image="/images/restaurant-sala-arcs-emporda.webp" mobileImage="/images/restaurant-sala-arcs-emporda-mobile.webp" />
          <PathCard item={hub.corporate} to={routes.priveCorporate} image="/images/restaurant-taula-xef-emporda.webp" mobileImage="/images/restaurant-taula-xef-emporda-mobile.webp" />
        </div>
      </section>

      <section className="prv-pillars">
        <div className="prv-pillars__image">
          <ResponsiveImage src="/images/restaurant-botic-corca-emporda-interior.webp" mobileSrc="/images/restaurant-botic-corca-emporda-interior-mobile.webp" alt="" loading="lazy" />
        </div>
        <div className="prv-pillars__content reveal" ref={pillarsRef}>
          <span className="prv-kicker">{hub.pillarsKicker}</span>
          <h2>{hub.pillarsTitle}</h2>
          <div className="prv-pillars__list">
            {hub.pillars.map(([num, title, body]) => (
              <article key={num}><span>{num}</span><div><h3>{title}</h3><p>{body}</p></div></article>
            ))}
          </div>
        </div>
      </section>
      <section className="prv-local" aria-labelledby="prv-local-title">
        <div className="prv-shell prv-local__grid">
          <div>
            <span className="prv-kicker">{hub.localKicker}</span>
            <h2 id="prv-local-title">{hub.localTitle}</h2>
          </div>
          <div className="prv-local__copy">
            <p>{hub.localBody}</p>
            <div className="prv-local__areas" aria-label={hub.localKicker}>
              {hub.localAreas.map((area, index) => <span key={area}><i>{String(index + 1).padStart(2, '0')}</i>{area}</span>)}
            </div>
          </div>
        </div>
      </section>
      <ContactEnding common={common} kicker={hub.closingKicker} title={hub.closingTitle} />
    </div>
  )
}

function DetailPage({ type }) {
  const lang = useLang()
  const routes = useLangRoutes()
  const { t } = useTranslation()
  const { common, [type]: content } = PRIVE_CONTENT[lang]
  const isCelebration = type === 'celebrations'
  const pageKey = isCelebration ? 'priveCelebrations' : 'priveCorporate'
  const heroImage = isCelebration ? '/images/restaurant-sala-arcs-emporda.webp' : '/images/restaurant-taula-xef-emporda.webp'
  const heroMobile = heroImage.replace('.webp', '-mobile.webp')
  const featureImage = isCelebration ? '/images/restaurant-botic-corca-emporda-interior.webp' : '/images/restaurant-botic-corca-emporda-exterior-nit.webp'
  const featureMobile = featureImage.replace('.webp', '-mobile.webp')
  const introRef = useReveal(0.12)
  const featureRef = useReveal(0.1)
  const faqRef = useReveal(0.08)

  return (
    <div className="prv-page prv-detail">
      <SEO title={t(`seo.${pageKey}.title`)} description={t(`seo.${pageKey}.description`)} pageKey={pageKey} ogImage={`${BASE_URL}${heroImage}`} />
      <PriveSchema pageKey={pageKey} title={content.eyebrow} description={content.introBody} routes={routes} />
      <PriveHero content={content} image={heroImage} mobileImage={heroMobile} compact />

      <section className="prv-detail-intro">
        <div className="prv-shell prv-detail-intro__grid reveal" ref={introRef}>
          <span className="prv-kicker">{content.introKicker}</span>
          <h2>{content.introTitle}</h2>
          <p>{content.introBody}</p>
        </div>
      </section>

      <section className="prv-occasions" aria-label={content.occasionsKicker}>
        <span className="prv-kicker">{content.occasionsKicker}</span>
        <div>{content.occasions.map((occasion, index) => <span key={occasion}><i>{String(index + 1).padStart(2, '0')}</i>{occasion}</span>)}</div>
      </section>

      <section className="prv-feature">
        <div className="prv-feature__media"><ResponsiveImage src={featureImage} mobileSrc={featureMobile} alt="" loading="lazy" /></div>
        <div className="prv-feature__copy reveal" ref={featureRef}>
          <h2>{content.featureTitle}</h2>
          <div>
            {content.features.map(([num, title, body]) => <article key={num}><span>{num}</span><h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="prv-faq">
        <div className="prv-shell reveal" ref={faqRef}>
          <span className="prv-kicker">Bo·TiC Privé</span>
          <h2>{content.faqTitle}</h2>
          <div className="prv-faq__list">
            {content.faqs.map(([question, answer], index) => <article key={question}><span>{String(index + 1).padStart(2, '0')}</span><h3>{question}</h3><p>{answer}</p></article>)}
          </div>
          <Link to={routes.prive} className="prv-back-link">← {common.back}</Link>
        </div>
      </section>
      <ContactEnding common={common} kicker={content.closingKicker} title={content.closingTitle} />
    </div>
  )
}

export function PriveCelebrations() { return <DetailPage type="celebrations" /> }
export function PriveCorporate() { return <DetailPage type="corporate" /> }
