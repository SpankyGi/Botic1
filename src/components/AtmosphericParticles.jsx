// Definit fora del component — posicions fixes, sense re-render drift
const PARTICLES = [
  { id:  0, x:  8, y: 72, s: 1.5, dur: 22, delay:  0 },
  { id:  1, x: 18, y: 45, s: 1.0, dur: 19, delay:  4 },
  { id:  2, x: 27, y: 83, s: 2.0, dur: 26, delay:  1 },
  { id:  3, x: 35, y: 30, s: 1.0, dur: 21, delay:  8 },
  { id:  4, x: 43, y: 60, s: 1.5, dur: 24, delay:  2 },
  { id:  5, x: 52, y: 78, s: 1.0, dur: 17, delay: 11 },
  { id:  6, x: 61, y: 25, s: 2.0, dur: 28, delay:  5 },
  { id:  7, x: 68, y: 50, s: 1.0, dur: 20, delay:  9 },
  { id:  8, x: 75, y: 68, s: 1.5, dur: 23, delay:  3 },
  { id:  9, x: 83, y: 38, s: 1.0, dur: 25, delay: 13 },
  { id: 10, x: 90, y: 82, s: 2.0, dur: 18, delay:  6 },
  { id: 11, x: 22, y: 15, s: 1.0, dur: 30, delay: 15 },
  { id: 12, x: 58, y: 90, s: 1.5, dur: 22, delay:  7 },
  { id: 13, x: 78, y: 10, s: 1.0, dur: 27, delay: 10 },
]

export default function AtmosphericParticles() {
  return (
    <div className="atm-particles" aria-hidden="true">
      {PARTICLES.map(({ id, x, y, s, dur, delay }) => (
        <span
          key={id}
          className="atm-particle"
          style={{
            left:                `${x}%`,
            top:                 `${y}%`,
            width:               `${s}px`,
            height:              `${s}px`,
            animationDuration:   `${dur}s`,
            animationDelay:      `-${delay}s`,
          }}
        />
      ))}
    </div>
  )
}
