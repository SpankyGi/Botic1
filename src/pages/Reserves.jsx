import BrandDot from '../components/BrandDot'
import RestooBooking from '../components/RestooBooking'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import ResponsiveImage from '../components/ResponsiveImage'
import ClosingCTA from '../components/ClosingCTA.jsx'
import { useLang, useLangRoutes } from '../i18n/LangContext'
import { useReveal } from '../hooks/useReveal'

function PracticalInfo({ practicalRef, routes, t }) {
  return (
    <section className="booking-practical reveal" ref={practicalRef} aria-labelledby="booking-practical-title">
      <div className="container-max">
        <header className="booking-section-heading booking-section-heading-left">
          <span className="booking-kicker booking-info-label">{t('reserves.infoEyebrow')}</span>
          <h2 id="booking-practical-title">{t('reserves.infoHeading')}</h2>
        </header>
        <div className="booking-practical-grid">
          <article>
            <h3>{t('reserves.restaurantTitle')}</h3>
            <p>{t('reserves.restaurantPets')}</p><p>{t('reserves.restaurantHours')}</p><p>{t('reserves.restaurantParking')}</p>
            <a href="https://www.google.com/maps/d/viewer?mid=13ycz7ovNLHKlPEOouM13aNPLOzpPzv4&ll=41.98827961281014%2C3.016173340973789&z=17" target="_blank" rel="noopener noreferrer">{t('reserves.restaurantParkingLink')} →</a>
          </article>
          <article>
            <h3>{t('reserves.menusTitle')}</h3>
            <p>{t('reserves.menusAllergies')}</p><p>{t('reserves.menusFullTable')}</p>
            <Link to={routes.menus}>{t('reserves.menusLink')} →</Link>
          </article>
          <article>
            <h3>{t('reserves.childrenTitle')}</h3>
            <p>{t('reserves.childrenConduct')}</p><p>{t('reserves.childrenStroller')}</p><p>{t('reserves.childrenHighchairs')}</p>
          </article>
        </div>
        <div className="booking-notes">
          <div>
            <span className="booking-kicker">{t('reserves.importantTitle')}</span><p>{t('reserves.importantConfirm')}</p>
            <span className="booking-kicker">{t('reserves.taxiTitle')}</span><p>{t('reserves.taxiBody')}</p>
          </div>
          <article>
            <span className="booking-kicker">{t('reserves.cancellationTitle')}</span>
            <h3>{t('reserves.cancellationNotice')}</h3>
            <ol>{['cancellationGrace', 'cancellationHow', 'cancellationConfirm', 'cancellationCharge'].map((key) => <li key={key}><span><BrandDot /></span>{t(`reserves.${key}`)}</li>)}</ol>
          </article>
        </div>
      </div>
    </section>
  )
}

function OpeningHours({ scheduleRef, t }) {
  const periods = t('reserves.schedule.periods', { returnObjects: true })
  return (
    <section className="booking-schedule reveal" ref={scheduleRef} aria-labelledby="booking-schedule-title">
      <div className="container-max">
        <header className="booking-section-heading">
          <span className="booking-kicker booking-schedule-label">{t('reserves.schedule.eyebrow')}</span>
          <h2 id="booking-schedule-title">{t('reserves.schedule.heading')}</h2>
          <p>{t('reserves.schedule.intro')}</p>
          <p><strong>{t('reserves.schedule.holidaysLabel')}</strong> {t('reserves.schedule.holidaysText')}</p>
        </header>
        <div className="booking-hours-details">
          {periods.map((period, index) => (
            <details key={period.title} open={index === 0}>
              <summary><span><BrandDot /></span><strong>{period.title}</strong><i aria-hidden="true" /></summary>
              <div className="booking-hours-content">
                {period.items.map((item) => <div key={item.label}><h3>{item.label}</h3><p>{item.text}</p>{item.time && <span>{item.time}</span>}</div>)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReservationForm({ reservationRef, t }) {
  const lang = useLang()
  return (
    <section className="booking-reservation reveal" id="reserva" ref={reservationRef}>
      <div className="container-max booking-reservation-grid">
        <header className="booking-reservation-intro">
          <span className="booking-kicker"><BrandDot /> {t('reserves.heroLabel')}</span>
          <h2>{t('common.bookTable')}</h2>
          <div className="booking-direct-contact"><a href="tel:+34972630869">+34 972 630 869</a><a href="mailto:restaurant@bo-tic.com">restaurant@bo-tic.com</a></div>
        </header>
        <div className="booking-form-wrap">
          <RestooBooking lang={lang} />
        </div>
      </div>
    </section>
  )
}

export default function Reserves() {
  const { t } = useTranslation()
  const routes = useLangRoutes()
  const practicalRef = useReveal(0.12)
  const scheduleRef = useReveal(0.12)
  const reservationRef = useReveal(0.12)
  const locationRef = useReveal(0.12)

  return (
    <div className="booking-page">
      <SEO title={t('seo.reserves.title')} description={t('seo.reserves.description')} pageKey="reserves" />
      <section className="booking-hero booking-hero--photo">
        <div className="booking-hero-photo" aria-hidden="true">
          <ResponsiveImage src="/images/navigation/reserva.webp"
            mobileSrc="/images/navigation/reserva-mobile.webp"
            alt="" width="2500" height="1666" fetchpriority="high" decoding="async" />
        </div>
        <div className="container-max booking-hero-inner">
          <span className="booking-kicker">Bo.TiC · Corçà · Empordà</span>
          <h1>{t('reserves.heroHeading')}</h1>
          <p>{t('reserves.heroIntro')}</p>
          <a className="booking-primary-cta" href="#reserva">{t('common.bookTable')}</a>
        </div>
      </section>

      <PracticalInfo practicalRef={practicalRef} routes={routes} t={t} />
      <OpeningHours scheduleRef={scheduleRef} t={t} />
      <ReservationForm reservationRef={reservationRef} t={t} />

      <section className="booking-location reveal" ref={locationRef} aria-labelledby="booking-location-title">
        <div className="container-max booking-location-grid">
          <header>
            <span className="booking-kicker"><BrandDot /> {t('reserves.addressLabel')}</span>
            <h2 id="booking-location-title">{t('reserves.footerHeading')}</h2>
            <address><span>{t('reserves.addressLine1')}</span><span>{t('reserves.addressLine2')}</span></address>
            <p>{t('reserves.distanceNote')}</p>
            <a className="booking-map-link" href="https://maps.google.com/?q=Avinguda+Costa+Brava+6,+Corçà,+Girona" target="_blank" rel="noopener noreferrer">{t('reserves.openMaps')}</a>
          </header>
          <div className="booking-map-wrap"><iframe title={t('reserves.addressLabel')} src="https://www.google.com/maps?q=Avinguda%20Costa%20Brava%206%2C%2017121%20Cor%C3%A7%C3%A0%2C%20Girona&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
        </div>
      </section>
      <ClosingCTA
        id="reserves-closing-cta"
        tone="dark"
        eyebrow={t('closingCta.reserves.eyebrow')}
        heading={t('closingCta.reserves.heading')}
        primaryTo="#reserva"
        primaryLabel={t('closingCta.reserves.primary')}
      />
    </div>
  )
}
