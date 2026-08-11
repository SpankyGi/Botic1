export default function ResponsiveImage({ mobileSrc, ...imageProps }) {
  return (
    <picture className="responsive-picture">
      <source media="(max-width: 768px)" srcSet={mobileSrc} type="image/webp" />
      <img {...imageProps} />
    </picture>
  )
}
