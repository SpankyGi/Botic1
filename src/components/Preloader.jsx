import { useState, useEffect } from 'react'

export default function Preloader() {
  const [done, setDone] = useState(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('botic_preloader_done')) {
      return true
    }
    return false
  })

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => {
      setDone(true)
      sessionStorage.setItem('botic_preloader_done', '1')
    }, 1200)
    return () => clearTimeout(t)
  }, [done])

  if (done) return null

  return (
    <div id="preloader">
      <div className="pre-logo">
        Bo<span className="dot">.</span>TiC
      </div>
      <div className="pre-bar" />
      <div className="pre-text">Sentimiento y pasión</div>
    </div>
  )
}
