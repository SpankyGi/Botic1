/**
 * Image wrapper with graceful fallback when the file is missing.
 * The container bg-color shows if the image fails to load.
 */
export default function Img({ src, alt, className = '', containerClass = '', lazy = true }) {
  const handleError = (e) => {
    e.target.style.opacity = '0'
  }

  return (
    <div className={`img-wrap ${containerClass}`}>
      <img
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        className={`img-cover ${className}`}
        onError={handleError}
      />
    </div>
  )
}
