function MichelinRosette({ x, delayClass }) {
  const rotations = [0, 60, 120, 180, 240, 300]

  return (
    <g className={`hero-michelin-star ${delayClass}`} transform={`translate(${x} 202)`}>
      <g className="hero-michelin-rosette">
        {rotations.map((rotation) => (
          <path
            key={rotation}
            pathLength="1"
            transform={`rotate(${rotation})`}
            d="M0-8C-17-18-22-42-9-57C-4-63 4-63 9-57C22-42 17-18 0-8Z"
          />
        ))}
      </g>
    </g>
  )
}

export default function MichelinStarsAnimation() {
  return (
    <div className="hero-michelin-art" aria-hidden="true">
      <svg
        className="hero-michelin-svg"
        viewBox="0 0 560 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="michelin-copper" x1="46" y1="65" x2="519" y2="337" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E7C990" stopOpacity="0" />
            <stop offset="0.36" stopColor="#D2AB69" stopOpacity="0.72" />
            <stop offset="0.78" stopColor="#A97943" stopOpacity="0.42" />
            <stop offset="1" stopColor="#A97943" stopOpacity="0" />
          </linearGradient>
          <filter id="michelin-red-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <path
          className="hero-michelin-gesture"
          pathLength="1"
          d="M44 255C86 92 252 35 405 80C480 102 527 158 522 224C516 299 445 344 351 350"
        />
        <path
          className="hero-michelin-gesture-secondary"
          pathLength="1"
          d="M90 292C175 354 327 368 438 314"
        />

        <g className="hero-michelin-stars-glow">
          <ellipse cx="238" cy="202" rx="60" ry="60" />
          <ellipse cx="334" cy="202" rx="60" ry="60" />
        </g>

        <MichelinRosette x="238" delayClass="star-one" />
        <MichelinRosette x="334" delayClass="star-two" />

        <path className="hero-michelin-caption-rule" pathLength="1" d="M202 282H370" />
        <text className="hero-michelin-caption" x="286" y="305" textAnchor="middle">
          2 · MICHELIN GUIDE
        </text>
      </svg>
    </div>
  )
}
