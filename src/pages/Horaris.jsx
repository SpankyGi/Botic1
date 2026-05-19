import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { useReveal } from '../hooks/useReveal'

// ── Calendar helpers ──────────────────────────────────────────────────────────
const MONTHS_CA = [
  'Gener','Febrer','Març','Abril','Maig','Juny',
  'Juliol','Agost','Setembre','Octubre','Novembre','Desembre',
]
const DAYS_ABBR = ['Dl','Dm','Dc','Dj','Dv','Ds','Dg']

// 0 = Tancat  1 = Dinar  2 = Dinar + Sopar
// dow: 0=Dg(Sun) 1=Dl(Mon) 2=Dm(Tue) 3=Dc(Wed) 4=Dj(Thu) 5=Dv(Fri) 6=Ds(Sat)
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

// ── Schedule data ─────────────────────────────────────────────────────────────
const SEASONS = [
  {
    num: '01',
    tag: 'Juliol · Agost',
    title: 'Estiu',
    rows: [
      { days: 'Dimecres — Diumenge', service: 'Dinar', time: '13:00 – 15:30' },
      { days: 'Dilluns · Dimarts',   service: 'Tancat', time: null },
    ],
  },
  {
    num: '02',
    tag: 'Juny · Setembre',
    title: 'Mitja Temporada',
    rows: [
      { days: 'Dimecres — Dissabte', service: 'Dinar',        time: '13:00 – 15:30' },
      { days: 'Diumenge',            service: 'Dinar + Sopar', time: '13:00 / 20:30' },
      { days: 'Dilluns · Dimarts',   service: 'Tancat',        time: null },
    ],
  },
  {
    num: '03',
    tag: 'Octubre — Maig',
    title: 'Temporada Baixa',
    rows: [
      { days: 'Divendres · Dissabte',        service: 'Dinar',        time: '13:00 – 15:30' },
      { days: 'Dimecres · Dijous · Diumenge', service: 'Dinar + Sopar', time: '13:00 / 20:30' },
      { days: 'Dilluns · Dimarts',            service: 'Tancat',        time: null },
    ],
  },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function Horaris() {
  const scheduleRef = useReveal(0.10)
  const calRef      = useReveal(0.06)
  const ctaRef      = useReveal(0.18)

  return (
    <>
      <SEO
        title="Horaris i Calendari · Bo.TiC · Restaurant Gastronòmic · Corçà"
        description="Consulta els horaris i el calendari d'obertura de Bo.TiC, restaurant de 2 estrelles Michelin a Corçà (Girona). Reserva taula amb antelació."
        canonical="https://www.bo-tic.com/horaris"
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
              Horaris i Calendari
            </span>
            <h1 className="hor-hero-title">
              Quan us<br />esperem
            </h1>
            <p className="hor-hero-sub">
              Dos serveis gastronòmics al llarg de l'any.<br />
              Consulta quan et podem acollir a la nostra taula.
            </p>
            <Link to="/reserves" className="btn-cream hor-hero-cta">
              Reservar taula
            </Link>
          </div>
        </div>
      </section>

      {/* ── Horaris per temporada ── */}
      <section className="hor-schedule" ref={scheduleRef}>
        <div className="container-max">
          <div className="hor-schedule-header">
            <span className="hor-schedule-label">Horaris</span>
            <h2 className="hor-schedule-title">Temporades</h2>
            <p className="hor-schedule-intro">
              Bo.TiC adapta el ritme del servei al calendari gastronòmic de l'Empordà.
              Cada temporada té la seva cadència pròpia.
            </p>
          </div>
          <div className="hor-cards-grid">
            {SEASONS.map(({ num, tag, title, rows }, i) => (
              <div key={num} className="hor-card" style={{ '--i': i }}>
                <span className="hor-card-num" aria-hidden="true">{num}</span>
                <span className="hor-card-tag">{tag}</span>
                <h3 className="hor-card-title">{title}</h3>
                <div className="hor-card-sep" aria-hidden="true" />
                <ul className="hor-card-rows">
                  {rows.map(({ days, service, time }, j) => (
                    <li key={j} className={`hor-card-row${service === 'Tancat' ? ' tancat' : ''}`}>
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

      {/* ── Transició editorial ── */}
      <div className="hor-bridge" aria-hidden="true" />

      {/* ── Calendari 2026 ── */}
      <section className="hor-calendar reveal" ref={calRef}>
        <div className="container-max">
          <div className="hor-cal-header">
            <span className="hor-cal-label">Calendari</span>
            <h2 className="hor-cal-title">2026</h2>
            <div className="hor-cal-legend" role="list" aria-label="Llegenda del calendari">
              <span className="hor-legend-item s0" role="listitem">
                <span className="hor-legend-dot" aria-hidden="true" />Tancat
              </span>
              <span className="hor-legend-item s1" role="listitem">
                <span className="hor-legend-dot" aria-hidden="true" />Dinar
              </span>
              <span className="hor-legend-item s2" role="listitem">
                <span className="hor-legend-dot" aria-hidden="true" />Dinar + Sopar
              </span>
            </div>
          </div>

          <div className="hor-months-grid">
            {MONTHS_CA.map((name, m) => {
              const cells = buildMonth(2026, m)
              return (
                <div key={m} className="hor-month">
                  <h3 className="hor-month-name">{name}</h3>
                  <div className="hor-day-headers" aria-hidden="true">
                    {DAYS_ABBR.map(d => <span key={d}>{d}</span>)}
                  </div>
                  <div className="hor-day-grid">
                    {cells.map((cell, idx) =>
                      cell === null
                        ? <span key={`e-${idx}`} className="hor-day empty" aria-hidden="true" />
                        : <span
                            key={idx}
                            className={`hor-day s${cell.status}`}
                            aria-label={`${cell.d} de ${name}`}
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
          <span className="label block hor-cta-eyebrow">Reserva</span>
          <h2 className="hor-cta-title">Assegureu la vostra taula</h2>
          <p className="hor-cta-body">
            L'aforament del restaurant és reduït. Us recomanem reservar amb antelació.
          </p>
          <Link to="/reserves" className="btn-gold">Reservar ara</Link>
        </div>
      </section>
    </>
  )
}
