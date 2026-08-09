import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const outRef = useRef(null)
  const pos    = useRef({ mx: 0, my: 0, ox: 0, oy: 0 })
  const started = useRef(false)

  useEffect(() => {
    const dot = dotRef.current
    const out = outRef.current
    if (!dot || !out) return

    const onMove = (e) => {
      if (!started.current) {
        pos.current = { mx: e.clientX, my: e.clientY, ox: e.clientX, oy: e.clientY }
        started.current = true
        document.body.classList.add('has-custom-cursor')
      }
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
    }
    document.addEventListener('mousemove', onMove)

    let rafId
    const loop = () => {
      const { mx, my } = pos.current
      pos.current.ox += (mx - pos.current.ox) * 0.18
      pos.current.oy += (my - pos.current.oy) * 0.18
      dot.style.left = mx + 'px'
      dot.style.top  = my + 'px'
      out.style.left = pos.current.ox + 'px'
      out.style.top  = pos.current.oy + 'px'
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    // Event delegation — funciona amb elements afegits dinàmicament
    const onOver = (e) => {
      const isHoverable = e.target.closest('a, button, .hover-trigger, .cta-circle, .menu-card, .detail-cta')
      out.classList.toggle('hover', !!isHoverable)
    }
    document.addEventListener('mouseover', onOver)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.body.classList.remove('has-custom-cursor')
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-out" ref={outRef} />
    </>
  )
}
