export default function BrandDot({ active = true }) {
  return (
    <svg className={`botic-item-dot${active ? '' : ' is-muted'}`} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false">
      <circle cx="5" cy="5" r="5" />
    </svg>
  )
}
