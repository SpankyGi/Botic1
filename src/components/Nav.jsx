import BrandDot from './BrandDot'
import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang, useLangRoutes, useSwitchLang } from '../i18n/LangContext'
import { LANGS } from '../i18n/routes'
import ResponsiveImage from './ResponsiveImage'

const NAV_KEYS = ['home', 'restaurant', 'gastronomia', 'menus', 'experiencia', 'reserves']
const NAV_IMGS = [
  '/images/navigation/inici.webp',
  '/images/restaurant-sala-arcs-emporda.webp',
  '/images/navigation/gastronomia.webp',
  '/images/navigation/menus.webp',
  '/images/navigation/experiencia.webp',
  '/images/navigation/reserva.webp',
]
const NAV_POSITIONS = ['center', 'center', 'center 84%', 'center 84%', 'center 65%', 'center']

export function BoticWordmark({ className = '', ...props }) {
  return (
    <span className={`nav-logo-word ${className}`.trim()} {...props}>
      Bo<span className="nav-logo-dot">·</span>TiC
    </span>
  )
}

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
    img:   NAV_IMGS[i],
    active: location.pathname.replace(/\/$/, '') === routes[key].replace(/\/$/, ''),
  }))
  const displayedImg = activeImg ?? Math.max(0, navItems.findIndex(item => item.active))
  const currentPageKey = Object.keys(routes).find((key) => routes[key] === location.pathname.replace(/\/$/, ''))
  const currentPageLabel = currentPageKey
    ? t(['legal', 'privacy', 'cookies', 'preferences'].includes(currentPageKey)
      ? `footer.${currentPageKey === 'preferences' ? 'cookiePreferences' : currentPageKey}`
      : `nav.items.${currentPageKey}.label`)
    : ''

  // Close on route change
  useEffect(() => { setMenuOpen(false); setActiveImg(null) }, [location.pathname])

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Body scroll lock + focus management
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    let focusTimer
    if (menuOpen) {
      focusTimer = setTimeout(() => {
        const activeLink = menuRef.current?.querySelector('.nav-fs-link.is-active')
        ;(activeLink || firstLinkRef.current)?.focus()
      }, 750)
    } else {
      openBtnRef.current?.focus()
    }
    return () => { clearTimeout(focusTimer); document.body.style.overflow = '' }
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
        <div className="nav-page-context">
        <span className="nav-michelin-stars" role="img" aria-label="Dues estrelles Michelin">
          <img src="/images/michelin-star-original.webp" alt="" width="48" height="48" decoding="async" />
          <img src="/images/michelin-star-original.webp" alt="" width="48" height="48" decoding="async" />
        </span>
        {currentPageLabel && <span className="nav-current-page" aria-current="page">{currentPageLabel}</span>}
        </div>
        <a href={routes.home} className="nav-logo" onClick={handleClose}>
          <BoticWordmark />
        </a>

        <div className="nav-recognitions" aria-label="Reconeixements de Bo·TiC">
          <span className="nav-recognition"><span className="nav-recognition-michelin">★★</span> Michelin</span>
          <span className="nav-recognition">{t('topbar.repsol')}</span>
          <span className="nav-recognition">{t('topbar.nacional')}</span>
          <span className="nav-recognition">{t('topbar.premisG')}</span>
          <span className="nav-recognition-divider" aria-hidden="true" />
          <nav className="nav-recognition-langs" aria-label={t('topbar.languageNav')}>
            {LANGS.map((targetLang) => (
              <Link
                key={targetLang}
                to={switchLang(targetLang, location.pathname)}
                className={targetLang === lang ? 'is-active' : ''}
                lang={targetLang}
              >
                {targetLang.toUpperCase()}
              </Link>
            ))}
          </nav>
        </div>

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
        className={`nav-fs nav-fs--immersive${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label={t('nav.ariaDialog')}
        aria-modal="true"
      >
        <div className="nav-fs-photos" aria-hidden="true">
          {menuOpen && navItems.map((item, i) => (
            <div key={item.to}
              className={`nav-fs-photo${displayedImg === i ? ' is-active' : ''}`}
              style={{ '--photo-position': NAV_POSITIONS[i] }}>
              <ResponsiveImage src={item.img}
                mobileSrc={item.img.replace('.webp', '-mobile.webp')}
                alt="" className="nav-fs-photo-image" decoding="async" />
            </div>
          ))}
        </div>
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
                >
                  <NavLink
                    to={item.to}
                    end={item.to === routes.home}
                    ref={i === 0 ? firstLinkRef : null}
                    onClick={handleClose}
                    onFocus={() => setActiveImg(i)}
                    tabIndex={menuOpen ? 0 : -1}
                    className={({ isActive }) =>
                      `nav-fs-link${isActive ? ' is-active' : ''}`
                    }
                  >
                    <span className="nav-fs-idx"><BrandDot /></span>
                    <span className="nav-fs-name">{item.label}</span>
                    <span className="nav-fs-arrow" aria-hidden="true">
                      <span className="nav-fs-arrow-line" />
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <p className="nav-fs-caption" key={displayedImg} aria-hidden="true">
            {navItems[displayedImg].desc}
          </p>
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
