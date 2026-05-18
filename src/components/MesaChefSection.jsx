import { useEffect, useRef } from 'react'
import { useReveal } from '../hooks/useReveal'

/* ── Part 1: Cinematic Hero ── */
function MesaHero() {
  const heroRef = useRef(null)
  const imgRef  = useRef(null)

  // Reveal (activa l'animació del títol via .visible)
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hero.classList.add('visible')
          obs.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  // Parallax scroll
  useEffect(() => {
    const hero = heroRef.current
    const img  = imgRef.current
    if (!hero || !img) return

    let ticking = false
    const update = () => {
      const r  = hero.getBoundingClientRect()
      const wh = window.innerHeight
      if (r.bottom < 0 || r.top > wh) { ticking = false; return }
      const progress = (wh - r.top) / (wh + r.height)
      const y = (progress - 0.5) * 80
      img.style.transform = `scale(1.1) translateY(${y}px)`
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="mesa-hero reveal" ref={heroRef}>
      <div className="mesa-hero-image" ref={imgRef} />
      <div className="mesa-hero-overlay" />
      <div className="mesa-hero-content">
        <div className="mesa-hero-top">
          <div className="mesa-hero-eyebrow">Nuestra Mesa del Chef</div>
          <div className="mesa-hero-tag">Privada · Exclusiva</div>
        </div>
        <div className="mesa-hero-bottom">
          <h2 className="mesa-hero-title">
            <span className="lineup"><span>Una</span></span>
            <span className="lineup"><span><em>auténtica</em></span></span>
            <span className="lineup"><span>experiencia</span></span>
          </h2>
          <div className="mesa-hero-meta">
            <strong>★ Capítulo 04</strong><br />
            La intimidad
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Part 2: Stats Banner ── */
function MesaStats() {
  const s1 = useReveal()
  const s2 = useReveal()
  const s3 = useReveal()

  return (
    <div className="mesa-stats">
      <div className="mesa-stats-grid">
        <div className="mesa-stat reveal" ref={s1}>
          <div className="num">04</div>
          <div className="label">
            <strong>Comensales</strong>
            máximo · íntimo
          </div>
        </div>

        <div className="mesa-stats-divider" aria-hidden="true" />

        <div className="mesa-stat featured reveal" ref={s2}>
          <div className="num">I</div>
          <div className="label">
            <strong>Único Menú</strong>
            el del Chef · 250€
          </div>
        </div>

        <div className="mesa-stats-divider" aria-hidden="true" />

        <div className="mesa-stat reveal" ref={s3}>
          <div className="num">★★</div>
          <div className="label">
            <strong>Michelin</strong>
            en cada pase
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Part 3: Beige Detail ── */
function MesaDetail() {
  const textRef  = useReveal()
  const imageRef = useReveal()

  return (
    <div className="mesa-detail">
      <div className="mesa-detail-numeral" aria-hidden="true">04</div>
      <div className="mesa-detail-grid">

        <div className="mesa-detail-text reveal" ref={textRef}>
          <div className="detail-eyebrow">La experiencia íntima</div>
          <h3 className="detail-title">
            Vive nuestra <em>cocina</em>
          </h3>
          <p className="detail-paragraph">
            Disfrutarás una propuesta gastronómica creativa, de autor,
            innovadora y comprometida, inspirada en la esencia de la cocina
            tradicional ampurdanesa, donde la experiencia y la creatividad,
            la exigencia en la selección de las mejores materias primas añadido
            a una excelente bodega, y un trato exquisito y profesional hacen
            que el resultado no deje indiferente a nadie…
          </p>
          <div className="detail-badges">
            <div className="detail-badge">
              <span className="small">Aforo</span>
              Máximo<br />4 personas
            </div>
            <div className="detail-badge">
              <span className="small">Carta</span>
              Sólo se servirá<br />el Menú del Chef
            </div>
          </div>
          <a href="#" className="detail-cta">
            <span>Reservar Mesa del Chef</span>
            <span className="detail-cta-arrow" />
          </a>
        </div>

        <div className="mesa-detail-image reveal" ref={imageRef}>
          <span className="img-corner tl" />
          <span className="img-corner br" />
          <span className="img-vlabel">Comedor privado</span>
          <span className="img-stamp">
            Bo<span style={{ color: 'rgba(154,42,42,0.4)' }}>.</span>TiC
          </span>
        </div>

      </div>
    </div>
  )
}

/* ── Composició final ── */
export default function MesaChefSection() {
  return (
    <section className="mesa-chef-section" id="mesa-chef">
      <MesaHero />
      <MesaStats />
      <MesaDetail />
    </section>
  )
}
