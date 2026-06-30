import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  {
    to: '/restaurant',
    label: 'Restaurant',
    idx: '01',
    img: '/images/restaurant-emporda-botic-michelin.webp',
    desc: "L'espai. La cuina. El territori.",
  },
  {
    to: '/gastronomia',
    label: 'Gastronomia',
    idx: '02',
    img: '/images/albert-sastregener-cuina-emporda-girona.webp',
    desc: 'Producte, tècnica i memòria.',
  },
  {
    to: '/menus',
    label: 'Menús',
    idx: '03',
    img: '/images/Albert Sastregener-empordà-botic-restaurant.webp',
    desc: "L'experiència completa a taula.",
  },
  {
    to: '/experiencia',
    label: 'Experiència',
    idx: '04',
    img: '/images/cristina-albert-botic-emporda-michelin.webp',
    desc: 'Albert i Cristina. El projecte.',
  },
  {
    to: '/reserves',
    label: 'Reserves',
    idx: '05',
    img: '/images/restaurant-emporda-michelin-girona.webp',
    desc: 'Reserveu la vostra taula.',
  },
  {
    to: '/horaris',
    label: 'Horaris',
    idx: '06',
    img: '/images/restaurant-emporda-botic-michelin.webp',
    desc: 'Consulta la nostra disponibilitat.',
  },
]

export default function Nav() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [activeImg,  setActiveImg]  = useState(null)
  const openBtnRef  = useRef(null)
  const firstLinkRef = useRef(null)
  const menuRef      = useRef(null)
  const location     = useLocation()

  // Close on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Body scroll lock + focus management
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (menuOpen) {
      setTimeout(() => firstLinkRef.current?.focus(), 750)
    } else {
      openBtnRef.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && menuOpen) setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Focus trap
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return
    const focusable = Array.from(
      menuRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => el.tabIndex !== -1)
    if (!focusable.length) return
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    const trap = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [menuOpen])

  const handleClose = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      {/* ===== HEADER ===== */}
      <header
        className={`nav-header${scrolled ? ' nav-scrolled' : ''}${menuOpen ? ' nav-menu-is-open' : ''}`}
        role="banner"
      >
        <Link to="/" className="nav-logo" onClick={handleClose}>
          Bo<span className="nav-logo-dot">.</span>TiC
        </Link>

        <button
          ref={openBtnRef}
          className={`nav-toggle${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Tancar menú' : 'Obrir menú'}
          aria-expanded={menuOpen}
          aria-controls="nav-fullscreen"
        >
          <span className="nav-toggle-label" aria-hidden="true">
            {menuOpen ? 'Tanca' : 'Menú'}
          </span>
          <span className="nav-toggle-lines" aria-hidden="true">
            <span className="nav-toggle-line nav-toggle-line-1" />
            <span className="nav-toggle-line nav-toggle-line-2" />
          </span>
        </button>
      </header>

      {/* ===== FULLSCREEN MENU ===== */}
      <div
        id="nav-fullscreen"
        ref={menuRef}
        className={`nav-fs${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Menú principal"
        aria-modal="true"
      >
        <div className="nav-fs-bg" aria-hidden="true" />

        <div className="nav-fs-layout">

          {/* LEFT — navigation list */}
          <nav className="nav-fs-left" aria-label="Navegació principal">
            <ul className="nav-fs-list">
              {NAV_ITEMS.map((item, i) => (
                <li
                  key={item.to}
                  className={`nav-fs-item${activeImg !== null && activeImg !== i ? ' is-sibling' : ''}`}
                  style={{ '--stagger': `${300 + i * 65}ms` }}
                  onMouseEnter={() => setActiveImg(i)}
                  onMouseLeave={() => setActiveImg(null)}
                >
                  <NavLink
                    to={item.to}
                    ref={i === 0 ? firstLinkRef : null}
                    onClick={handleClose}
                    onFocus={() => setActiveImg(i)}
                    onBlur={() => setActiveImg(null)}
                    tabIndex={menuOpen ? 0 : -1}
                    className={({ isActive }) =>
                      `nav-fs-link${isActive ? ' is-active' : ''}`
                    }
                  >
                    <span className="nav-fs-idx">{item.idx}</span>
                    <span className="nav-fs-name">{item.label}</span>
                    <span className="nav-fs-arrow" aria-hidden="true">
                      <span className="nav-fs-arrow-line" />
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT — image panels */}
          <div className="nav-fs-right" aria-hidden="true">
            <div className="nav-fs-img-wrap">
              {/* default: first image when nothing hovered */}
              <div className={`nav-fs-img-panel${activeImg === null ? ' is-active' : ''}`}>
                <img
                  src={NAV_ITEMS[0].img}
                  alt=""
                  className="nav-fs-img"
                  fetchpriority="high"
                />
                <div className="nav-fs-img-overlay" />
              </div>
              {/* per-item images */}
              {NAV_ITEMS.map((item, i) => (
                <div
                  key={item.to}
                  className={`nav-fs-img-panel${activeImg === i ? ' is-active' : ''}`}
                >
                  <img
                    src={item.img}
                    alt=""
                    loading="lazy"
                    className="nav-fs-img"
                  />
                  <div className="nav-fs-img-overlay" />
                  <p className="nav-fs-img-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM footer */}
        <footer className="nav-fs-footer" aria-label="Informació de contacte">
          <div className="nav-fs-footer-inner">
            <div className="nav-fs-footer-col">
              <span className="nav-fs-footer-label">Corçà · Empordà</span>
              <a
                href="tel:+34972630869"
                className="nav-fs-footer-link"
                tabIndex={menuOpen ? 0 : -1}
              >
                +34 972 630 869
              </a>
            </div>
            <div className="nav-fs-footer-col nav-fs-footer-col--center">
              <a
                href="https://www.instagram.com/restaurantbotic"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-fs-footer-link"
                tabIndex={menuOpen ? 0 : -1}
              >
                Instagram
              </a>
              <span className="nav-fs-sep" aria-hidden="true">·</span>
              <span className="nav-fs-lang" tabIndex={menuOpen ? 0 : -1}>
                Español
              </span>
            </div>
            <div className="nav-fs-footer-col nav-fs-footer-col--right">
              <Link
                to="/reserves"
                onClick={handleClose}
                className="nav-fs-reserva"
                tabIndex={menuOpen ? 0 : -1}
              >
                Reservar
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
