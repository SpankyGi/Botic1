import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import { useLangRoutes } from '../i18n/LangContext'
import { useReveal } from '../hooks/useReveal'

// 0 = closed, 1 = lunch, 2 = lunch and dinner. The calendar follows the
// existing service pattern and remains independent from translated labels.
function getDayStatus(month, dow) {
  if (dow === 1 || dow === 2) return 0
  if (month === 6 || month === 7) return 1
  if (month === 5 || month === 8) return dow === 0 ? 2 : 1
  return (dow === 5 || dow === 6) ? 1 : 2
}

function buildMonth(year, month) {
  const firstDow = new Date(year, month, 1).getDay()
  const offset = firstDow === 0 ? 6 : firstDow - 1
  const total = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: offset }, () => null)
  for (let day = 1; day <= total; day += 1) {
    cells.push({ day, status: getDayStatus(month, new Date(year, month, day).getDay()) })
  }
  return cells
}

export default function Reserves() {
  const { t } = useTranslation()
  const routes = useLangRoutes()
  const reservationRef = useReveal(0.12)
  const scheduleRef = useReveal(0.10)
  const practicalRef = useReveal(0.12)
  const locationRef = useReveal(0.12)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    nom: '', email: '', telefon: '', persones: '2', data: '', missatge: '',
  })

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const handleSubmit = (event) => {
    event.preventDefault()
    setSent(true)
  }

  const months = t('horaris.months', { returnObjects: true })
  const days = t('horaris.days', { returnObjects: true })
  const seasons = [
    { num: '01', ...t('horaris.seasons.summer', { returnObjects: true }) },
    { num: '02', ...t('horaris.seasons.midSeason', { returnObjects: true }) },
    { num: '03', ...t('horaris.seasons.lowSeason', { returnObjects: true }) },
  ]
  const inputClass = 'booking-field'

  return (
    <div className="booking-page">
      <SEO
        title={t('seo.reserves.title')}
        description={t('seo.reserves.description')}
        pageKey="reserves"
      />

      <section className="booking-hero">
        <div className="container-max booking-hero-inner">
          <span className="booking-kicker">Bo.TiC · Corçà · Empordà</span>
          <h1>{t('reserves.heroHeading')}</h1>
          <p>{t('horaris.scheduleIntro')}</p>
          <a className="booking-primary-cta" href="#reserva">{t('common.bookTable')}</a>
        </div>
      </section>

      <section className="booking-reservation reveal" id="reserva" ref={reservationRef}>
        <div className="container-max booking-reservation-grid">
          <header className="booking-reservation-intro">
            <span className="booking-kicker">01 · {t('reserves.heroLabel')}</span>
            <h2>{t('reserves.formHeading')}</h2>
            <p>{t('reserves.formIntro')}</p>
            <div className="booking-direct-contact">
              <a href="tel:+34972630869">+34 972 630 869</a>
              <a href="mailto:reserves@bo-tic.com">reserves@bo-tic.com</a>
            </div>
          </header>

          <div className="booking-form-wrap">
            {sent ? (
              <div className="booking-confirmation" role="status">
                <span aria-hidden="true">✦</span>
                <h3>{t('reserves.confirmHeading')}</h3>
                <p>{t('reserves.confirmBody')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} name="reserves" method="POST" data-netlify="true" aria-label={t('reserves.formAria')}>
                <input type="hidden" name="form-name" value="reserves" />
                <div className="booking-form-row">
                  <label>
                    <span>{t('reserves.fieldName')}</span>
                    <input className={inputClass} name="nom" type="text" required value={form.nom} onChange={handleChange} placeholder={t('reserves.placeholderName')} />
                  </label>
                  <label>
                    <span>{t('reserves.fieldPhone')}</span>
                    <input className={inputClass} name="telefon" type="tel" required value={form.telefon} onChange={handleChange} placeholder={t('reserves.placeholderPhone')} />
                  </label>
                </div>
                <label>
                  <span>{t('reserves.fieldEmail')}</span>
                  <input className={inputClass} name="email" type="email" required value={form.email} onChange={handleChange} placeholder={t('reserves.placeholderEmail')} />
                </label>
                <div className="booking-form-row">
                  <label>
                    <span>{t('reserves.fieldDate')}</span>
                    <input className={`${inputClass} [color-scheme:dark]`} name="data" type="date" required value={form.data} onChange={handleChange} />
                  </label>
                  <label>
                    <span>{t('reserves.fieldGuests')}</span>
                    <select className={`${inputClass} [color-scheme:dark]`} name="persones" value={form.persones} onChange={handleChange}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => <option key={number} value={number}>{number} {number === 1 ? t('common.person') : t('common.persons')}</option>)}
                      <option value="9+">{t('common.group')}</option>
                    </select>
                  </label>
                </div>
                <label>
                  <span>{t('reserves.fieldMessage')}</span>
                  <textarea className={inputClass} name="missatge" rows="4" value={form.missatge} onChange={handleChange} placeholder={t('reserves.placeholderMessage')} />
                </label>
                <button className="booking-primary-cta" type="submit">{t('reserves.submitBtn')}</button>
                <p className="booking-form-note">{t('reserves.formNote')}</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="booking-schedule reveal" ref={scheduleRef} aria-labelledby="booking-schedule-title">
        <div className="container-max">
          <header className="booking-section-heading">
            <span className="booking-kicker">02 · {t('horaris.scheduleLabel')}</span>
            <h2 id="booking-schedule-title">{t('horaris.scheduleTitle')}</h2>
            <p>{t('horaris.scheduleIntro')}</p>
          </header>
          <div className="booking-seasons">
            {seasons.map(({ num, tag, title, rows }) => (
              <article className="booking-season" key={num}>
                <span className="booking-season-num">{num}</span>
                <span className="booking-season-tag">{tag}</span>
                <h3>{title}</h3>
                <ul>
                  {rows.map(({ days: serviceDays, service, time }) => (
                    <li key={`${serviceDays}-${service}`} className={!time ? 'is-closed' : ''}>
                      <span>{serviceDays}</span><strong>{service}</strong>{time && <em>{time}</em>}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="booking-calendar" aria-labelledby="booking-calendar-title">
            <header>
              <span className="booking-kicker">{t('horaris.calLabel')}</span>
              <h3 id="booking-calendar-title">2026</h3>
              <div className="booking-calendar-legend" role="list" aria-label={t('horaris.legendAria')}>
                <span className="is-closed" role="listitem">{t('horaris.legendClosed')}</span>
                <span className="is-lunch" role="listitem">{t('horaris.legendLunch')}</span>
                <span className="is-full" role="listitem">{t('horaris.legendLunchDinner')}</span>
              </div>
            </header>
            <div className="booking-months">
              {months.map((month, monthIndex) => (
                <article className="booking-month" key={month}>
                  <h4>{month}</h4>
                  <div className="booking-day-labels" aria-hidden="true">{days.map((day) => <span key={day}>{day}</span>)}</div>
                  <div className="booking-days">
                    {buildMonth(2026, monthIndex).map((cell, index) => cell === null
                      ? <span className="is-empty" key={`empty-${index}`} aria-hidden="true" />
                      : <span className={`status-${cell.status}`} key={cell.day} aria-label={`${cell.day} ${month}`}>{cell.day}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="booking-practical reveal" ref={practicalRef} aria-labelledby="booking-practical-title">
        <div className="container-max">
          <header className="booking-section-heading booking-section-heading-left">
            <span className="booking-kicker">03 · {t('reserves.infoEyebrow')}</span>
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
            <div><span className="booking-kicker">{t('reserves.importantTitle')}</span><p>{t('reserves.importantConfirm')}</p><span className="booking-kicker">{t('reserves.taxiTitle')}</span><p>{t('reserves.taxiBody')}</p></div>
            <article>
              <span className="booking-kicker">{t('reserves.cancellationTitle')}</span>
              <h3>{t('reserves.cancellationNotice')}</h3>
              <ol>{['cancellationGrace', 'cancellationHow', 'cancellationConfirm', 'cancellationCharge'].map((key, index) => <li key={key}><span>0{index + 1}</span>{t(`reserves.${key}`)}</li>)}</ol>
            </article>
          </div>
        </div>
      </section>

      <section className="booking-location reveal" ref={locationRef} aria-labelledby="booking-location-title">
        <div className="container-max booking-location-grid">
          <header>
            <span className="booking-kicker">04 · {t('reserves.addressLabel')}</span>
            <h2 id="booking-location-title">{t('reserves.footerHeading')}</h2>
            <address><span>{t('reserves.addressLine1')}</span><span>{t('reserves.addressLine2')}</span></address>
            <p>{t('reserves.distanceNote')}</p>
            <a className="booking-map-link" href="https://maps.google.com/?q=Carrer+dels+Forns+7,+Corçà,+Girona" target="_blank" rel="noopener noreferrer">{t('reserves.openMaps')}</a>
          </header>
          <div className="booking-map-wrap">
            <iframe title={t('reserves.addressLabel')} src="https://www.google.com/maps?q=Carrer%20dels%20Forns%207%2C%2017121%20Cor%C3%A7%C3%A0%2C%20Girona&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>
    </div>
  )
}
