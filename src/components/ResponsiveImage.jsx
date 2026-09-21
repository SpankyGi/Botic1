import dimensions from '../data/imageDimensions.json'

export default function ResponsiveImage({ mobileSrc, ...imageProps }) {
  const [width, height] = dimensions[imageProps.src] || []
  const [mobileWidth, mobileHeight] = dimensions[mobileSrc] || []
  return (
    <picture className="responsive-picture">
      <source media="(max-width: 768px)" srcSet={mobileSrc?.replace(/ /g, '%20')} type="image/webp" width={mobileWidth} height={mobileHeight} />
      <img width={width} height={height} {...imageProps} />
    </picture>
  )
}
