import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Track({ items }) {
  return (
    <span className="marquee-copy">
      {items.map((item, i) => (
        <span key={i} className="marquee-item">
          {item}
          <span className="marquee-dot" aria-hidden="true">·</span>
        </span>
      ))}
    </span>
  )
}

export default function MarqueeStrip() {
  const { t, i18n } = useTranslation()
  const items = useMemo(
    () => shuffle(t('marquee.items', { returnObjects: true })),
    [i18n.language, t],
  )
  // ~5s per item keeps the same premium pace regardless of list length
  const duration = `${items.length * 5}s`

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" style={{ animationDuration: duration }}>
        <Track items={items} />
        <Track items={items} />
      </div>
    </div>
  )
}
