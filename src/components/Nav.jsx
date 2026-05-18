import { useState, useEffect } from 'react'

const LINKS = [
  { href: '#',        label: 'Restaurante'   },
  { href: '#menu',    label: 'Menús'         },
  { href: '#mesa-chef', label: 'Mesa del Chef' },
  { href: '#',        label: 'Horarios'      },
  { href: '#',        label: 'Vídeos'        },
]

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
        <a href="#" className="logo">Bo<span className="dot">.</span>TiC</a>

        <ul className="nav-menu">
          {LINKS.map(({ href, label }) => (
            <li key={label}>
              <a href={href} onClick={() => setMenuOpen(false)}>{label}</a>
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

      {/* Mobile overlay */}
      <div className={`nav-mobile-overlay${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        {LINKS.map(({ href, label }) => (
          <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
      </div>
    </>
  )
}
