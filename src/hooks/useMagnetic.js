import { useEffect, useRef } from 'react'

// Decorative motion runs only while a fine pointer is moving nearby or settling.
export function useMagnetic(strength = 0.35, radius = 90) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame = null
    let targetX = 0, targetY = 0, curX = 0, curY = 0
    let pointer = null

    const loop = () => {
      frame = null
      if (pointer) {
        const rect = el.getBoundingClientRect()
        // Remove our own translation so the attraction does not feed back.
        const dx = pointer.x - (rect.left - curX + rect.width / 2)
        const dy = pointer.y - (rect.top - curY + rect.height / 2)
        const nearby = Math.hypot(dx, dy) < radius + Math.max(rect.width, rect.height) / 2
        targetX = nearby ? dx * strength : 0
        targetY = nearby ? dy * strength : 0
        pointer = null
      }
      curX += (targetX - curX) * 0.2
      curY += (targetY - curY) * 0.2
      const settled = Math.abs(targetX - curX) < 0.1 && Math.abs(targetY - curY) < 0.1
      if (settled) { curX = targetX; curY = targetY }
      el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`
      if (!settled) frame = requestAnimationFrame(loop)
    }
    const schedule = () => {
      if (frame === null && media.matches && !document.hidden) frame = requestAnimationFrame(loop)
    }
    const onMove = event => {
      if (!media.matches) return
      pointer = { x: event.clientX, y: event.clientY }
      schedule()
    }
    const onLeave = () => { pointer = null; targetX = 0; targetY = 0; schedule() }
    const reset = () => {
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
      pointer = null
      targetX = targetY = curX = curY = 0
      el.style.removeProperty('transform')
    }
    const onVisibility = () => { if (document.hidden) reset() }
    document.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    media.addEventListener('change', reset)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      media.removeEventListener('change', reset)
      document.removeEventListener('visibilitychange', onVisibility)
      reset()
    }
  }, [strength, radius])

  return ref
}
