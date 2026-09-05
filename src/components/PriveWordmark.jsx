export default function PriveWordmark({ compact = false, endorsed = false, className = '' }) {
  return (
    <span
      className={`prive-wordmark${compact ? ' prive-wordmark--compact' : ''}${endorsed ? ' prive-wordmark--endorsed' : ''}${className ? ` ${className}` : ''}`}
      aria-label="Bo·TiC Privé"
    >
      {endorsed && (
        <span className="prive-wordmark__house" aria-hidden="true">
          <span>Bo</span>
          <i className="prive-wordmark__house-dot" />
          <span>T</span>
          <span className="prive-wordmark__house-i">ı</span>
          <span>C</span>
        </span>
      )}
      <span className="prive-wordmark__core">
        <span className="prive-wordmark__name">
          <span>Pr</span><span className="prive-wordmark__prive-i">ı<i aria-hidden="true" /></span><span>vé</span>
        </span>
        {!endorsed && (
          <span className="prive-wordmark__dots" aria-hidden="true">
            <i />
            <i />
          </span>
        )}
      </span>
    </span>
  )
}
