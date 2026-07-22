export default function MichelinStarsAnimation() {
  return (
    <div className="hero-michelin-art" aria-hidden="true">
      <svg
        className="hero-michelin-svg"
        viewBox="0 0 720 720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="michelin-copper" x1="98" y1="104" x2="624" y2="630" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E1C18B" stopOpacity="0.2" />
            <stop offset="0.48" stopColor="#C9A46A" stopOpacity="0.92" />
            <stop offset="1" stopColor="#8F2727" stopOpacity="0.45" />
          </linearGradient>
          <radialGradient id="michelin-glow">
            <stop stopColor="#E7C991" stopOpacity="0.45" />
            <stop offset="1" stopColor="#E7C991" stopOpacity="0" />
          </radialGradient>
          <filter id="michelin-soft-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <circle className="hero-michelin-halo" cx="360" cy="360" r="274" />
        <circle className="hero-michelin-orbit orbit-a" cx="360" cy="360" r="226" />
        <circle className="hero-michelin-orbit orbit-b" cx="360" cy="360" r="178" />

        <path
          className="hero-michelin-stroke stroke-main"
          pathLength="1"
          d="M109 419C173 533 320 592 445 548C558 509 625 397 595 291C566 189 464 123 357 139C260 153 181 228 172 321C164 409 223 489 310 511C389 532 477 494 511 420C541 356 519 279 460 242C408 209 336 217 295 262C257 304 259 370 299 407C336 442 396 441 432 407"
        />
        <path
          className="hero-michelin-stroke stroke-gesture"
          pathLength="1"
          d="M72 475C177 579 334 627 478 577C581 542 653 458 666 357"
        />
        <path
          className="hero-michelin-stroke stroke-axis"
          pathLength="1"
          d="M360 76V126M360 594V644M76 360H126M594 360H644"
        />

        <g className="hero-michelin-stars">
          <circle className="hero-michelin-star-glow star-one" cx="324" cy="342" r="54" />
          <circle className="hero-michelin-star-glow star-two" cx="405" cy="342" r="54" />
          <path
            className="hero-michelin-star star-one"
            pathLength="1"
            d="M324 305L334 329L360 331L340 348L346 374L324 360L302 374L308 348L288 331L314 329L324 305Z"
          />
          <path
            className="hero-michelin-star star-two"
            pathLength="1"
            d="M405 305L415 329L441 331L421 348L427 374L405 360L383 374L389 348L369 331L395 329L405 305Z"
          />
        </g>

        <circle className="hero-michelin-point point-a" cx="172" cy="321" r="3" />
        <circle className="hero-michelin-point point-b" cx="511" cy="420" r="3" />
        <circle className="hero-michelin-point point-c" cx="595" cy="291" r="2" />
      </svg>
    </div>
  )
}
