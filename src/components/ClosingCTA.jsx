import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

/**
 * Compact editorial closing action used at the end of the main routes.
 * Content and destination stay with each page; the visual rhythm stays shared.
 */
export default function ClosingCTA({
  id,
  eyebrow,
  heading,
  primaryTo,
  primaryLabel,
  secondaryTo,
  secondaryLabel,
  tone = 'light',
}) {
  const revealRef = useReveal(0.16)

  return (
    <section className={`closing-cta closing-cta--${tone}`} aria-labelledby={id}>
      <div className="container-max closing-cta__inner reveal" ref={revealRef}>
        <div className="closing-cta__copy">
          <span className="closing-cta__eyebrow">{eyebrow}</span>
          <span className="closing-cta__line" aria-hidden="true" />
          <h2 id={id}>{heading}</h2>
        </div>
        <div className="closing-cta__actions">
          <Link to={primaryTo} className="closing-cta__primary">{primaryLabel}</Link>
          {secondaryTo && secondaryLabel && (
            <Link to={secondaryTo} className="closing-cta__secondary">{secondaryLabel}</Link>
          )}
        </div>
      </div>
    </section>
  )
}
