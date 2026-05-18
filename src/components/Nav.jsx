import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'

const LINKS = [
  { to: '/restaurant',  label: 'Restaurant'  },
  { to: '/gastronomia', label: 'Gastronomia' },
  { to: '/menus',       label: 'Menús'       },
  { to: '/experiencia', label: 'Experiència' },
  { to: '/reserves',    label: 'Reserves'    },
]

const navLinkClass = ({ isActive }) =>
  isActive ? 'active' : undefined

export default function Nav() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`main${scrolled ? ' scrolled' : ''}`} id="mainNav">
        <Link to="/" className="logo">Bo<span className="dot">.</span>TiC</Link>

        <ul className="nav-menu">
          {LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className={navLinkClass} onClick={() => setMenuOpen(false)}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          className={`nav-mobile-toggle${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Tancar menú' : 'Obrir menú'}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`nav-mobile-overlay${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        {LINKS.map(({ to, label }) => (
          <NavLink key={to} to={to} className={navLinkClass} onClick={() => setMenuOpen(false)}>
            {label}
          </NavLink>
        ))}
      </div>
    </>
  )
}
