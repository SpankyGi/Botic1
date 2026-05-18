import { useMemo } from 'react'
import { useReveal } from '../hooks/useReveal'
import MenuCard from './MenuCard'
import { menus } from '../data/menus'

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left:     Math.random() * 100,
        delay:    Math.random() * 12,
        duration: 10 + Math.random() * 8,
        opacity:  0.3 + Math.random() * 0.5,
      })),
    []
  )

  return (
    <div className="menu-particles" aria-hidden="true">
      {particles.map(({ id, left, delay, duration, opacity }) => (
        <div
          key={id}
          className="particle"
          style={{
            left:              left + '%',
            animationDelay:    delay + 's',
            animationDuration: duration + 's',
            opacity,
          }}
        />
      ))}
    </div>
  )
}

export default function MenuSection() {
  const headerRef = useReveal()

  return (
    <section className="menu-section" id="menu">
      <div className="menu-bg-text" aria-hidden="true">menú</div>
      <div className="menu-deco tl" aria-hidden="true" />
      <div className="menu-deco br" aria-hidden="true" />
      <Particles />

      <header className="menu-header reveal" ref={headerRef}>
        <div className="menu-eyebrow">La propuesta gastronómica</div>
        <h2 className="menu-title">
          Tres <em>experiencias</em>,<br />una sola pasión
        </h2>
        <div className="menu-flourish" aria-hidden="true">
          <span className="menu-flourish-line" />
          <span className="menu-flourish-diamond" />
          <span className="menu-flourish-line r" />
        </div>
      </header>

      <div className="menu-grid">
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
      </div>
    </section>
  )
}
