const items = [
  'Cocina de autor',
  'Producto de proximidad',
  'Tradición evolucionada',
  'Empordà',
  'Desde 2007',
]

function Track() {
  return (
    <span>
      {items.map((item, i) => (
        <span key={i}>
          {item} <span className="marquee-dot">·</span>{' '}
        </span>
      ))}
    </span>
  )
}

export default function MarqueeStrip() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <Track />
        <Track />
      </div>
    </div>
  )
}
