import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import { useReveal } from '../hooks/useReveal'
import { useLangRoutes } from '../i18n/LangContext'

// Calendar helpers (logic stays language-neutral; labels come from t())
// 0 = Closed  1 = Lunch  2 = Lunch + Dinner
// dow: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
function getDayStatus(month, dow) {
  if (dow === 1 || dow === 2) return 0                         // Mon/Tue: always closed
  if (month === 6 || month === 7) return 1                     // Jul/Aug: lunch only
  if (month === 5 || month === 8) return dow === 0 ? 2 : 1    // Jun/Sep: Sun=both, rest=lunch
  return (dow === 5 || dow === 6) ? 1 : 2                     // Oct-May: Fri/Sat=lunch, rest=both
}

function buildMonth(year, month) {
  const firstDow = new Date(year, month, 1).getDay()
  const offset   = firstDow === 0 ? 6 : firstDow - 1  // Monday-first grid
  const total    = new Date(year, month + 1, 0).getDate()
  const cells    = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= total; d++) {
    const dow = new Date(year, month, d).getDay()
    cells.push({ d, status: getDayStatus(month, dow) })
  }
  return cells
}

export default function Horaris() {
  const { t }       = useTranslation()
  const routes      = useLangRoutes()
  const scheduleRef = useReveal(0.10)
  const calRef      = useReveal(0.06)
  const ctaRef      = useReveal(0.18)

  const MONTHS  = t('horaris.months', { returnObjects: true })
  const DAYS    = t('horaris.days',   { returnObjects: true })

  const SEASONS_DATA = [
    {
      num: '01',
      ...t('horaris.seasons.summer', { returnObjects: true }),
    },
    {
      num: '02',
      ...t('horaris.seasons.midSeason', { returnObjects: true }),
    },
    {
      num: '03',
      ...t('horaris.seasons.lowSeason', { returnObjects: true }),
    },
  ]

  return (
    <>
      <SEO
        title={t('seo.horaris.title')}
        description={t('seo.horaris.description')}
        pageKey="horaris"
      />

      {/* ── Hero ── */}
      <section className="hor-hero">
        <img
          src="/images/restaurant-emporda-michelin-girona.webp"
          alt=""
          className="hor-hero-img"
        />
        <div className="hor-hero-overlay" aria-hidden="true" />
        <div className="container-max hor-hero-inner">
          <div className="hor-hero-content">
            <span className="hor-hero-eyebrow">
              <span className="hor-hero-line" aria-hidden="true" />
              {t('horaris.heroEyebrow')}
            </span>
            <h1 className="hor-hero-title">
              {t('horaris.heroTitle').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h1>
            <p className="hor-hero-sub">
              {t('horaris.heroSub').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </p>
            <Link to={routes.reserves} className="btn-cream hor-hero-cta">
              {t('horaris.heroBtn')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Horaris per temporada ── */}
      <section className="hor-schedule" ref={scheduleRef}>
        <div className="container-max">
          <div className="hor-schedule-header">
            <span className="hor-schedule-label">{t('horaris.scheduleLabel')}</span>
            <h2 className="hor-schedule-title">{t('horaris.scheduleTitle')}</h2>
            <p className="hor-schedule-intro">{t('horaris.scheduleIntro')}</p>
          </div>
          <div className="hor-cards-grid">
            {SEASONS_DATA.map(({ num, tag, title, rows }, i) => (
              <div key={num} className="hor-card" style={{ '--i': i }}>
                <span className="hor-card-num" aria-hidden="true">{num}</span>
                <span className="hor-card-tag">{tag}</span>
                <h3 className="hor-card-title">{title}</h3>
                <div className="hor-card-sep" aria-hidden="true" />
                <ul className="hor-card-rows">
                  {rows.map(({ days, service, time }, j) => (
                    <li key={j} className={`hor-card-row${service === t('common.closed') || service === 'Cerrado' || service === 'Fermé' || service === 'Closed' || service === 'Tancat' ? ' tancat' : ''}`}>
                      <span className="hor-row-days">{days}</span>
                      <span className="hor-row-service">{service}</span>
                      {time && <span className="hor-row-time">{time}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="hor-bridge" aria-hidden="true" />

      {/* ── Calendari 2026 ── */}
      <section className="hor-calendar reveal" ref={calRef}>
        <div className="container-max">
          <div className="hor-cal-header">
            <span className="hor-cal-label">{t('horaris.calLabel')}</span>
            <h2 className="hor-cal-title">2026</h2>
            <div className="hor-cal-legend" role="list" aria-label={t('horaris.legendAria')}>
              <span className="hor-legend-item s0" role="listitem">
                <span className="hor-legend-dot" aria-hidden="true" />{t('horaris.legendClosed')}
              </span>
              <span className="hor-legend-item s1" role="listitem">
                <span className="hor-legend-dot" aria-hidden="true" />{t('horaris.legendLunch')}
              </span>
              <span className="hor-legend-item s2" role="listitem">
                <span className="hor-legend-dot" aria-hidden="true" />{t('horaris.legendLunchDinner')}
              </span>
            </div>
          </div>

          <div className="hor-months-grid">
            {MONTHS.map((name, m) => {
              const cells = buildMonth(2026, m)
              return (
                <div key={m} className="hor-month">
                  <h3 className="hor-month-name">{name}</h3>
                  <div className="hor-day-headers" aria-hidden="true">
                    {DAYS.map(d => <span key={d}>{d}</span>)}
                  </div>
                  <div className="hor-day-grid">
                    {cells.map((cell, idx) =>
                      cell === null
                        ? <span key={`e-${idx}`} className="hor-day empty" aria-hidden="true" />
                        : <span
                            key={idx}
                            className={`hor-day s${cell.status}`}
                            aria-label={`${cell.d} ${name}`}
                          >{cell.d}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Reserva ── */}
      <section className="hor-cta-section">
        <div className="container-max reveal" ref={ctaRef}>
          <span className="label block hor-cta-eyebrow">{t('horaris.ctaEyebrow')}</span>
          <h2 className="hor-cta-title">{t('horaris.ctaHeading')}</h2>
          <p className="hor-cta-body">{t('horaris.ctaBody')}</p>
          <Link to={routes.reserves} className="btn-gold">{t('horaris.ctaBtn')}</Link>
        </div>
      </section>
    </>
  )
}
