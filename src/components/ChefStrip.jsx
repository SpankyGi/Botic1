import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

export default function ChefStrip() {
  const textRef = useReveal(0.15)
  const imgRef  = useReveal(0.08)

  return (
    <section className="chef-section">

      {/* Imatge — dreta */}
      <div className="chef-photo-wrap" ref={imgRef}>
        <img
          src="/images/cristina-albert-botic-emporda-michelin.webp"
          alt="Albert Sastregener i Cristina Torrent, chef i sommelier de Bo.TiC"
          className="chef-photo-img"
        />
        <div className="chef-photo-overlay" aria-hidden="true" />
      </div>

      {/* Text — esquerra */}
      <div className="container-max chef-container">
        <div className="chef-content reveal" ref={textRef}>

          <span className="chef-eyebrow">Dos Estrellas Michelin</span>

          <h2 className="chef-title">
            Nos apasiona<br />lo que hacemos
          </h2>

          <div className="chef-sep" aria-hidden="true" />

          <p className="chef-body">
            Albert Sastregener y Cristina Torrent, chef y sumiller respectivamente,
            ofrecen desde 2007 una propuesta gastronómica de autor y creativa,
            comprometida con la esencia de la cocina tradicional catalana.
          </p>

          <Link to="/restaurant" className="chef-cta">
            Saber más
          </Link>

        </div>
      </div>

    </section>
  )
}
