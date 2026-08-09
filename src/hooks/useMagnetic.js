import { useEffect, useRef } from 'react'

// Fa que un element s'atregui cap al cursor quan hi és a prop (efecte
// magnètic típic de webs premium). No fa res si l'usuari prefereix menys
// moviment, ni en dispositius sense hover (mòbil/tàctil).
export function useMagnetic(strength = 0.35, radius = 90) {
  const ref = useRef(null)

useEffect(() => {
  const el = ref.current
  if (!el) return

          const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const noHover = window.matchMedia('(hover: none)').matches
  if (reduceMotion || noHover) return

          let rafId = null
  let targetX = 0
  let targetY = 0
  let curX = 0
  let curY = 0

          const loop = () => {
            curX += (targetX - curX) * 0.2
            curY += (targetY - curY) * 0.2
            el.style.transform = `translate(${curX.toFixed(2)}px, ${curY.toFixed(2)}px)`
            rafId = requestAnimationFrame(loop)
          }

          const onMove = (e) => {
            const rect = el.getBoundingClientRect()
            const cx = rect.left + rect.width / 2
            const cy = rect.top + rect.height / 2
            const dx = e.clientX - cx
            const dy = e.clientY - cy
            const dist = Math.hypot(dx, dy)

            if (dist < radius + Math.max(rect.width, rect.height) / 2) {
              targetX = dx * strength
              targetY = dy * strength
            } else {
              targetX = 0
              targetY = 0
            }
          }

          const onLeave = () => {
            targetX = 0
            targetY = 0
          }

          document.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)
  rafId = requestAnimationFrame(loop)

          return () => {
            document.removeEventListener('mousemove', onMove)
            el.removeEventListener('mouseleave', onLeave)
            cancelAnimationFrame(rafId)
          }
}, [strength, radius])

return ref
}
