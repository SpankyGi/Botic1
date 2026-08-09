import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang, useLangRoutes, useSwitchLang } from '../i18n/LangContext'
import { LANGS } from '../i18n/routes'

const NAV_KEYS = ['restaurant', 'gastronomia', 'menus', 'experiencia', 'reserves', 'horaris']
const NAV_IMGS = [
  '/images/restaurant-emporda-botic-michelin.webp',
  '/images/albert-sastregener-cuina-emporda-girona.webp',
  '/images/Albert Sastregener-empordà-botic-restaurant.webp',
  '/images/cristina-albert-botic-emporda-michelin.webp',
  '/images/restaurant-emporda-michelin-girona.webp',
  '/images/restaurant-emporda-botic-michelin.webp',
]
const NAV_IDX = ['01', '02', '03', '04', '05', '06']

export default function Nav() {
  const { t }         = useTranslation()
  const lang          = useLang()
  const routes        = useLangRoutes()
  const switchLang    = useSwitchLang()
  const location      = useLocation()
  const isHome        = location.pathname === routes.home

  const [scrolled,    setScrolled]   = useState(false)
  const [menuOpen,    setMenuOpen]   = useState(false)
  const [activeImg,   setActiveImg]  = useState(null)
  const openBtnRef   = useRef(null)
  const firstLinkRef = useRef(null)
  const menuRef      = useRef(null)

  const navItems = NAV_KEYS.map((key, i) => ({
    to:    routes[key],
    label: t(`nav.items.${key}.label`),
    desc:  t(`nav.items.${key}.desc`),
    idx:   NAV_IDX[i],
    img:   NAV_IMGS[i],
  }))

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
        className={`nav-header${isHome ? ' nav-home' : ''}${scrolled ? ' nav-scrolled' : ''}${menuOpen ? ' nav-menu-is-open' : ''}`}
        role="banner"
      >
        <Link to={routes.home} className="nav-logo" onClick={handleClose}>
          Bo<span className="nav-logo-dot">·</span>TiC
        </Link>

        <button
          ref={openBtnRef}
          className={`nav-toggle${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? t('nav.ariaClose') : t('nav.ariaOpen')}
          aria-expanded={menuOpen}
          aria-controls="nav-fullscreen"
        >
          <span className="nav-toggle-label" aria-hidden="true">
            {menuOpen ? t('nav.close') : t('nav.menu')}
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
        aria-label={t('nav.ariaDialog')}
        aria-modal="true"
      >
        <div className="nav-fs-bg" aria-hidden="true" />

        <div className="nav-fs-layout">

          {/* LEFT — navigation list */}
          <nav className="nav-fs-left" aria-label={t('nav.ariaNav')}>
            <ul className="nav-fs-list">
              {navItems.map((item, i) => (
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
              <div className={`nav-fs-img-panel${activeImg === null ? ' is-active' : ''}`}>
                <img
                  src={navItems[0].img}
                  alt=""
                  className="nav-fs-img"
                  fetchpriority="high"
                />
                <div className="nav-fs-img-overlay" />
              </div>
              {navItems.map((item, i) => (
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
        <footer className="nav-fs-footer" aria-label={t('nav.ariaFooter')}>
          <div className="nav-fs-footer-inner">
            <div className="nav-fs-footer-col">
              <span className="nav-fs-footer-label">{t('nav.location')}</span>
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

              {/* Language switcher */}
              <div className="nav-fs-langs">
                {LANGS.map((l) => (
                  <Link
                    key={l}
                    to={switchLang(l, location.pathname)}
                    onClick={handleClose}
                    tabIndex={menuOpen ? 0 : -1}
                    className={`nav-fs-lang-btn${l === lang ? ' is-active' : ''}`}
                    aria-current={l === lang ? 'true' : undefined}
                    lang={l}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
            <div className="nav-fs-footer-col nav-fs-footer-col--right">
              <Link
                to={routes.reserves}
                onClick={handleClose}
                className="nav-fs-reserva"
                tabIndex={menuOpen ? 0 : -1}
              >
                {t('nav.book')}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
