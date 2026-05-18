import { Link } from 'react-router-dom'

/**
 * Full-width call-to-action block.
 * @param {'dark'|'gold'|'light'} theme
 */
export default function CTA({
  eyebrow,
  heading,
  body,
  linkTo = '/reserves',
  linkLabel = 'Reservar taula',
  theme = 'dark',
  secondaryLink,
  secondaryLabel,
}) {
  const isDark  = theme === 'dark'
  const isGold  = theme === 'gold'
  const isLight = theme === 'light'

  const bg = isDark ? 'bg-botic-dark' : isGold ? 'bg-botic-gold' : 'bg-botic-ivory'
  const headingColor = isDark
    ? 'text-botic-cream'
    : isGold
    ? 'text-botic-black'
    : 'text-botic-text'
  const bodyColor = isDark
    ? 'text-botic-muted'
    : isGold
    ? 'text-botic-black/70'
    : 'text-botic-text/60'
  const eyebrowColor = isDark || isLight ? 'text-botic-gold' : 'text-botic-black/60'
  const btn = isDark ? 'btn-gold' : isGold ? 'btn-dark' : 'btn-dark'
  const btnSecondary = isDark ? 'btn-cream' : 'btn-dark'

  return (
    <section className={`${bg} py-24 md:py-32`}>
      <div className="container-max text-center">
        {eyebrow && (
          <span className={`text-[11px] tracking-[0.28em] uppercase font-sans font-medium ${eyebrowColor} block mb-5`}>
            {eyebrow}
          </span>
        )}
        <h2 className={`font-serif font-light text-4xl md:text-5xl lg:text-6xl leading-tight ${headingColor} mb-6`}>
          {heading}
        </h2>
        {body && (
          <p className={`font-sans text-sm md:text-base leading-relaxed ${bodyColor} max-w-xl mx-auto mb-10`}>
            {body}
          </p>
        )}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to={linkTo} className={btn}>
            {linkLabel}
          </Link>
          {secondaryLink && (
            <Link to={secondaryLink} className={btnSecondary}>
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
