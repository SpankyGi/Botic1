import { useState, useEffect } from 'react'

export default function Preloader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div id="preloader" className={done ? 'done' : ''}>
      <div className="pre-logo">
        Bo<span className="dot">.</span>TiC
      </div>
      <div className="pre-bar" />
      <div className="pre-text">Sentimiento y pasión</div>
    </div>
  )
}
