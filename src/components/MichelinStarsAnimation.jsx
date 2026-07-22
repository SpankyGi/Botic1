function MichelinRosette({ x, delayClass, delay }) {
  return (
    <g transform={`translate(${x} 202)`}>
      <g className={`hero-michelin-star ${delayClass}`} style={{ '--star-delay': delay }}>
        <use
          className="hero-michelin-reference"
          href="#michelin-star-reference"
          x="-66"
          y="-67"
          width="132"
          height="135"
        />
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
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="michelin-cutout" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.89
                      0 0 0 0 0
                      0 0 0 0 0.10
                      2.2 0 0 0 -0.28"
            />
          </filter>
          <linearGradient id="michelin-flare" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#FFF4DB" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFF4DB" stopOpacity="0.95" />
            <stop offset="1" stopColor="#FFF4DB" stopOpacity="0" />
          </linearGradient>
          <symbol id="michelin-star-reference" viewBox="200 155 200 205">
            <image
              href="/images/michelin-star-reference.webp"
              width="600"
              height="600"
              filter="url(#michelin-cutout)"
            />
          </symbol>
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

        <g className="hero-michelin-stars-glow" filter="url(#michelin-red-glow)">
          <ellipse cx="220" cy="202" rx="66" ry="66" />
          <ellipse cx="352" cy="202" rx="66" ry="66" />
        </g>

        <MichelinRosette x="220" delayClass="star-one" delay="3.05s" />
        <MichelinRosette x="352" delayClass="star-two" delay="3.48s" />

        <path className="hero-michelin-flare" d="M157 276L415 129" />

        <path className="hero-michelin-caption-rule" pathLength="1" d="M184 292H388" />
        <text className="hero-michelin-caption" x="286" y="305" textAnchor="middle">
          2 · MICHELIN GUIDE
        </text>
      </svg>
    </div>
  )
}
