import { useEffect, useRef } from 'react'

export function useReveal(threshold = 0.05, rootMargin = '0px') {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin, threshold])

  return ref
}

// La franja superior del viewport actua com a "darrer terç" de lectura.
// També funciona quan el bloc és més alt que la pantalla, com les tres
// portes de la portada en mòbil.
export function useLateReveal() {
  return useReveal(0.01, '0px 0px -76% 0px')
}
