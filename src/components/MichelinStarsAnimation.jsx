const petals = [0, 60, 120, 180, 240, 300]

function MichelinRosette({ x, delayClass, delay }) {
  return (
    <g className={`hero-michelin-star-wrap ${delayClass}`} transform={`translate(${x} 202)`}>
      <g className="hero-michelin-star" style={{ '--star-delay': delay }}>
        <circle className="hero-michelin-core-flash" r="23" />
        <g className="hero-michelin-rosette">
          {petals.map((rotation) => (
            <path
              key={rotation}
              className="hero-michelin-petal"
              d="M-14-12C-32-25-27-59 0-68C27-59 32-25 14-12"
              transform={`rotate(${rotation})`}
              pathLength="1"
            />
          ))}
        </g>
        <circle className="hero-michelin-glint-orbit" r="57" pathLength="1" />
      </g>
    </g>
  )
}

export default function MichelinStarsAnimation() {
  return (
    <div className="hero-michelin-art" aria-hidden="true">
      <svg className="hero-michelin-svg" viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="michelin-copper" x1="46" y1="65" x2="519" y2="337" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E7C990" stopOpacity="0" />
            <stop offset="0.36" stopColor="#D2AB69" stopOpacity="0.72" />
            <stop offset="0.78" stopColor="#A97943" stopOpacity="0.42" />
            <stop offset="1" stopColor="#A97943" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="michelin-impact" cx="50%" cy="50%" r="50%">
            <stop stopColor="#fff8e8" stopOpacity=".92" />
            <stop offset=".18" stopColor="#e0001b" stopOpacity=".55" />
            <stop offset="1" stopColor="#e0001b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="michelin-flare" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#FFF4DB" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFF4DB" stopOpacity="0.95" />
            <stop offset="1" stopColor="#FFF4DB" stopOpacity="0" />
          </linearGradient>
          <filter id="michelin-red-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <path className="hero-michelin-gesture" pathLength="1" d="M44 255C86 92 252 35 405 80C480 102 527 158 522 224C516 299 445 344 351 350" />
        <path className="hero-michelin-gesture-secondary" pathLength="1" d="M90 292C175 354 327 368 438 314" />

        <circle className="hero-michelin-impact" cx="286" cy="202" r="118" />
        <circle className="hero-michelin-shockwave wave-one" cx="286" cy="202" r="92" />
        <circle className="hero-michelin-shockwave wave-two" cx="286" cy="202" r="92" />

        <g className="hero-michelin-stars-glow" filter="url(#michelin-red-glow)">
          <circle cx="220" cy="202" r="48" />
          <circle cx="352" cy="202" r="48" />
        </g>

        <MichelinRosette x="220" delayClass="star-one" delay="2.85s" />
        <MichelinRosette x="352" delayClass="star-two" delay="3.34s" />

        <g className="hero-michelin-sparks">
          <path d="M286 92V72" /><path d="M286 332V312" />
          <path d="M154 202H134" /><path d="M438 202H418" />
          <path d="M190 106L176 92" /><path d="M396 312L382 298" />
          <path d="M382 106L396 92" /><path d="M176 312L190 298" />
        </g>
        <path className="hero-michelin-flare" d="M142 278L430 120" />

        <path className="hero-michelin-caption-rule" pathLength="1" d="M184 292H388" />
        <text className="hero-michelin-caption" x="286" y="309" textAnchor="middle">2 · MICHELIN GUIDE</text>
      </svg>
    </div>
  )
}
