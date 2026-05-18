import { Link } from 'react-router-dom'

export default function FloatingCTAs() {
  return (
    <div className="float-ctas">
      <a href="tel:+34972630869" className="cta-circle small hover-trigger">
        <span>Trucar</span>
      </a>
      <Link to="/reserves" className="cta-circle hover-trigger">
        <span>Reserva</span>
      </Link>
    </div>
  )
}
