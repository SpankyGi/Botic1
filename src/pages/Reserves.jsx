import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import { useLangRoutes } from '../i18n/LangContext'
import { useReveal } from '../hooks/useReveal'

function PracticalInfo({ practicalRef, routes, t }) {
  return (
    <section className="booking-practical reveal" ref={practicalRef} aria-labelledby="booking-practical-title">
      <div className="container-max">
        <header className="booking-section-heading booking-section-heading-left">
          <span className="booking-kicker">01 · {t('reserves.infoEyebrow')}</span>
          <h2 id="booking-practical-title">{t('reserves.infoHeading')}</h2>
        </header>
        <div className="booking-practical-grid">
          <article>
            <span>01</span><h3>{t('reserves.restaurantTitle')}</h3>
            <p>{t('reserves.restaurantPets')}</p><p>{t('reserves.restaurantHours')}</p><p>{t('reserves.restaurantParking')}</p>
            <a href="https://www.google.com/maps/d/viewer?mid=13ycz7ovNLHKlPEOouM13aNPLOzpPzv4&ll=41.98827961281014%2C3.016173340973789&z=17" target="_blank" rel="noopener noreferrer">{t('reserves.restaurantParkingLink')} →</a>
          </article>
          <article>
            <span>02</span><h3>{t('reserves.menusTitle')}</h3>
            <p>{t('reserves.menusAllergies')}</p><p>{t('reserves.menusFullTable')}</p>
            <Link to={routes.menus}>{t('reserves.menusLink')} →</Link>
          </article>
          <article>
            <span>03</span><h3>{t('reserves.childrenTitle')}</h3>
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
            <ol>{['cancellationGrace', 'cancellationHow', 'cancellationConfirm', 'cancellationCharge'].map((key, index) => <li key={key}><span>0{index + 1}</span>{t(`reserves.${key}`)}</li>)}</ol>
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
          <span className="booking-kicker">02 · {t('reserves.schedule.eyebrow')}</span>
          <h2 id="booking-schedule-title">{t('reserves.schedule.heading')}</h2>
          <p>{t('reserves.schedule.intro')}</p>
        </header>
        <div className="booking-hours-details">
          {periods.map((period, index) => (
            <details key={period.title} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, '0')}</span><strong>{period.title}</strong><i aria-hidden="true" /></summary>
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
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', telefon: '', persones: '2', data: '', missatge: '' })
  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const handleSubmit = (event) => { event.preventDefault(); setSent(true) }

  return (
    <section className="booking-reservation reveal" id="reserva" ref={reservationRef}>
      <div className="container-max booking-reservation-grid">
        <header className="booking-reservation-intro">
          <span className="booking-kicker">03 · {t('reserves.heroLabel')}</span>
          <h2>{t('reserves.formHeading')}</h2>
          <p>{t('reserves.formIntro')}</p>
          <div className="booking-direct-contact"><a href="tel:+34972630869">+34 972 630 869</a><a href="mailto:reserves@bo-tic.com">reserves@bo-tic.com</a></div>
        </header>
        <div className="booking-form-wrap">
          {sent ? (
            <div className="booking-confirmation" role="status"><span aria-hidden="true">✦</span><h3>{t('reserves.confirmHeading')}</h3><p>{t('reserves.confirmBody')}</p></div>
          ) : (
            <form onSubmit={handleSubmit} name="reserves" method="POST" data-netlify="true" aria-label={t('reserves.formAria')}>
              <input type="hidden" name="form-name" value="reserves" />
              <div className="booking-form-row">
                <label><span>{t('reserves.fieldName')}</span><input className="booking-field" name="nom" type="text" required value={form.nom} onChange={handleChange} placeholder={t('reserves.placeholderName')} /></label>
                <label><span>{t('reserves.fieldPhone')}</span><input className="booking-field" name="telefon" type="tel" required value={form.telefon} onChange={handleChange} placeholder={t('reserves.placeholderPhone')} /></label>
              </div>
              <label><span>{t('reserves.fieldEmail')}</span><input className="booking-field" name="email" type="email" required value={form.email} onChange={handleChange} placeholder={t('reserves.placeholderEmail')} /></label>
              <div className="booking-form-row">
                <label><span>{t('reserves.fieldDate')}</span><input className="booking-field [color-scheme:dark]" name="data" type="date" required value={form.data} onChange={handleChange} /></label>
                <label><span>{t('reserves.fieldGuests')}</span><select className="booking-field [color-scheme:dark]" name="persones" value={form.persones} onChange={handleChange}>{[1, 2, 3, 4, 5, 6, 7, 8].map((number) => <option key={number} value={number}>{number} {number === 1 ? t('common.person') : t('common.persons')}</option>)}<option value="9+">{t('common.group')}</option></select></label>
              </div>
              <label><span>{t('reserves.fieldMessage')}</span><textarea className="booking-field" name="missatge" rows="4" value={form.missatge} onChange={handleChange} placeholder={t('reserves.placeholderMessage')} /></label>
              <button className="booking-primary-cta" type="submit">{t('reserves.submitBtn')}</button>
              <p className="booking-form-note">{t('reserves.formNote')}</p>
            </form>
          )}
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
      <section className="booking-hero">
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
            <span className="booking-kicker">04 · {t('reserves.addressLabel')}</span>
            <h2 id="booking-location-title">{t('reserves.footerHeading')}</h2>
            <address><span>{t('reserves.addressLine1')}</span><span>{t('reserves.addressLine2')}</span></address>
            <p>{t('reserves.distanceNote')}</p>
            <a className="booking-map-link" href="https://maps.google.com/?q=Carrer+dels+Forns+7,+Corçà,+Girona" target="_blank" rel="noopener noreferrer">{t('reserves.openMaps')}</a>
          </header>
          <div className="booking-map-wrap"><iframe title={t('reserves.addressLabel')} src="https://www.google.com/maps?q=Carrer%20dels%20Forns%207%2C%2017121%20Cor%C3%A7%C3%A0%2C%20Girona&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
        </div>
      </section>
    </div>
  )
}
