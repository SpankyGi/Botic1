import { useEffect, useRef, useState } from 'react'

const CURSOR_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 769px) and (prefers-reduced-motion: no-preference)'

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(CURSOR_QUERY).matches
  )
  const dotRef = useRef(null)
  const outRef = useRef(null)
  const pos    = useRef({ mx: 0, my: 0, ox: 0, oy: 0 })
  const started = useRef(false)

  useEffect(() => {
    const media = window.matchMedia(CURSOR_QUERY)
    const update = () => setEnabled(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const out = outRef.current
    if (!dot || !out) return
    started.current = false
    let rafId = null

    const loop = () => {
      rafId = null
      const { mx, my } = pos.current
      pos.current.ox += (mx - pos.current.ox) * 0.18
      pos.current.oy += (my - pos.current.oy) * 0.18
      const settled = Math.abs(mx - pos.current.ox) < 0.1 && Math.abs(my - pos.current.oy) < 0.1
      if (settled) { pos.current.ox = mx; pos.current.oy = my }
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`
      out.style.transform = `translate3d(${pos.current.ox}px, ${pos.current.oy}px, 0) translate(-50%, -50%)`
      if (!settled) rafId = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      if (!started.current) {
        pos.current = { mx: e.clientX, my: e.clientY, ox: e.clientX, oy: e.clientY }
        started.current = true
        document.body.classList.add('has-custom-cursor')
      }
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
      if (rafId === null && !document.hidden) rafId = requestAnimationFrame(loop)
    }
    document.addEventListener('mousemove', onMove)

    const onVisibility = () => {
      if (document.hidden && rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Event delegation — funciona amb elements afegits dinàmicament
    const onOver = (e) => {
      const isHoverable = e.target.closest('a, button, .hover-trigger, .cta-circle, .menu-card, .detail-cta')
      out.classList.toggle('hover', !!isHoverable)
    }
    document.addEventListener('mouseover', onOver)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('visibilitychange', onVisibility)
      document.body.classList.remove('has-custom-cursor')
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-out" ref={outRef} />
    </>
  )
}
