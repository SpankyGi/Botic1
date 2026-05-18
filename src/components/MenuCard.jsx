import { useState, useEffect, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

function SnackGroup({ cat, items }) {
  return (
    <div className="snack-group">
      <div className="cat">{cat}</div>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

/*
  Dish gestiona la seva pròpia apertura.
  `visible` és controlat per MenuCard per preservar la classe `in`
  a través dels re-renders de React (que sobreescriuria classList.add).
*/
function Dish({ num, name, description, visible, animDelay }) {
  const [open, setOpen] = useState(false)
  const hasDesc = !!description?.length

  return (
    <div
      className={[
        'dish',
        hasDesc  ? 'expandable' : '',
        open     ? 'open'       : '',
        visible  ? 'in'         : '',
      ].filter(Boolean).join(' ')}
      style={animDelay !== undefined ? { animationDelay: animDelay + 'ms' } : undefined}
      onClick={hasDesc ? () => setOpen(o => !o) : undefined}
      aria-expanded={hasDesc ? open : undefined}
    >
      <span className="dish-num">{num}</span>

      {hasDesc ? (
        <div className="dish-name-wrap">
          <h4 className="dish-name">{name}</h4>
          <span className="dish-toggle" aria-hidden="true">▾</span>
        </div>
      ) : (
        <h4 className="dish-name">{name}</h4>
      )}

      {hasDesc && (
        <div className="dish-expand">
          <div className="dish-expand-inner">
            <ul className="dish-expand-list">
              {description.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MenuCard({ menu }) {
  const { id, variant, tag, title, price, aperitivoGroups, platos, postres } = menu

  const cardRef  = useRef(null)
  const revealRef = useReveal()

  // `visible` controla la classe `in` via React (no classList imperatiu)
  // per evitar que re-renders per `open` esborrin la classe.
  const [visible, setVisible] = useState(false)

  // Stagger d'entrada: ara establim animationDelay com a estat
  const allDishes = [...(platos || []), ...(postres || [])]
  const [delays, setDelays] = useState([])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Calculem delays per ordre de tots els .dish del DOM
          const domDishes = Array.from(card.querySelectorAll('.dish'))
          const newDelays = {}
          domDishes.forEach((d, i) => {
            // Identifiquem cada dish pel seu num (data attribute no tenim,
            // usem posició)
            newDelays[i] = i * 60
          })
          setDelays(newDelays)
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(card)
    return () => obs.disconnect()
  }, [])

  // Tilt 3D
  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const r  = card.getBoundingClientRect()
    const x  = e.clientX - r.left
    const y  = e.clientY - r.top
    const cx = r.width  / 2
    const cy = r.height / 2
    const rx = ((y - cy) / cy) * -4
    const ry = ((x - cx) / cx) *  4
    card.style.transform = `perspective(1500px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`
    card.style.setProperty('--mx', (x / r.width  * 100) + '%')
    card.style.setProperty('--my', (y / r.height * 100) + '%')
  }

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  // Index global per assignar delay correcte a cada dish (plats + postres)
  let dishIndex = 0

  return (
    <article
      ref={(el) => { cardRef.current = el; revealRef.current = el }}
      className={`menu-card${variant ? ' ' + variant : ''} tilt reveal`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      id={id}
    >
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />

      <header className="card-head">
        <div className="card-tag">{tag}</div>
        <h3 className="card-title">{title}</h3>
        <div className="card-flourish">
          <span className="line" />
          <span className="dot" />
          <span className="line" />
        </div>
      </header>

      <div className="card-body">
        <div className="section-label">Aperitivos</div>
        {aperitivoGroups.map((g) => (
          <SnackGroup key={g.cat} cat={g.cat} items={g.items} />
        ))}

        <div className="section-label">Menú</div>
        {platos.map((d) => {
          const idx = dishIndex++
          return (
            <Dish
              key={d.num}
              num={d.num}
              name={d.name}
              description={d.description}
              visible={visible}
              animDelay={delays[idx] ?? idx * 60}
            />
          )
        })}

        <div className="section-label">Postres</div>
        {postres.map((d) => {
          const idx = dishIndex++
          return (
            <Dish
              key={d.num}
              num={d.num}
              name={d.name}
              description={d.description}
              visible={visible}
              animDelay={delays[idx] ?? idx * 60}
            />
          )
        })}
      </div>

      <footer className="card-foot">
        <div className="price-medallion">
          <div className="price-ring-outer" />
          <div className="price-ring-inner" />
          <span className="price-value">{price}</span>
        </div>
        <div className="card-signature">Bo<span>.</span>TiC</div>
      </footer>
    </article>
  )
}
