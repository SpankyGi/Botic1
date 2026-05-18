import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/restaurant',  label: 'Restaurant'  },
  { to: '/gastronomia', label: 'Gastronomia' },
  { to: '/experiencia', label: 'Experiència' },
  { to: '/contacte',    label: 'Contacte'    },
]

export default function Header() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const { pathname } = useLocation()

  // Detect scroll position
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isHome = pathname === '/'
  const forceOpaque = !isHome || scrolled || menuOpen

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          forceOpaque
            ? 'bg-botic-black/97 backdrop-blur-md border-b border-botic-border'
            : 'bg-transparent'
        }`}
      >
        <div className="container-max">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link
              to="/"
              aria-label="Bo.TiC — inici"
              className="font-serif text-2xl md:text-[1.75rem] text-botic-cream
                         tracking-wide hover:text-botic-gold transition-colors duration-300 z-10"
            >
              Bo.TiC
            </Link>

            {/* Desktop navigation */}
            <nav aria-label="Navegació principal" className="hidden md:flex items-center gap-9">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-[11px] tracking-[0.2em] uppercase font-sans font-medium
                     transition-colors duration-300 ${
                       isActive
                         ? 'text-botic-gold'
                         : 'text-botic-muted hover:text-botic-cream'
                     }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop CTA + hamburger */}
            <div className="flex items-center gap-5 z-10">
              <Link
                to="/contacte"
                className="hidden md:inline-block btn-gold !py-2.5 !px-6 !text-[10px]"
              >
                Reservar
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8
                           focus-ring rounded"
                aria-label={menuOpen ? 'Tancar menú' : 'Obrir menú'}
                aria-expanded={menuOpen}
              >
                <span
                  className={`block h-px bg-botic-cream transition-all duration-300 origin-center ${
                    menuOpen ? 'rotate-45 translate-y-[7px] w-5 mx-auto' : 'w-5 mx-auto'
                  }`}
                />
                <span
                  className={`block h-px bg-botic-cream transition-all duration-300 mx-auto ${
                    menuOpen ? 'opacity-0 w-0' : 'w-4'
                  }`}
                />
                <span
                  className={`block h-px bg-botic-cream transition-all duration-300 origin-center ${
                    menuOpen ? '-rotate-45 -translate-y-[7px] w-5 mx-auto' : 'w-5 mx-auto'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 bg-botic-black flex flex-col items-center justify-center
                    transition-all duration-500 md:hidden ${
                      menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
        aria-hidden={!menuOpen}
      >
        <nav
          aria-label="Menú mòbil"
          className="flex flex-col items-center gap-8"
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-serif text-3xl font-light transition-colors duration-300 ${
                  isActive ? 'text-botic-gold' : 'text-botic-cream hover:text-botic-gold'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <Link to="/contacte" className="btn-gold mt-6">
            Reservar taula
          </Link>
        </nav>

        {/* Bottom info */}
        <p className="absolute bottom-10 text-botic-muted text-xs tracking-[0.2em] uppercase">
          Corçà · Empordà · Girona
        </p>
      </div>
    </>
  )
}
