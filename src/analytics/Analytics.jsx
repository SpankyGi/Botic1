import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getTracking } from './client'
import { classifyLink } from './tracking'

export default function Analytics() {
  const { pathname } = useLocation()
  useEffect(() => { getTracking().page(pathname) }, [pathname])
  useEffect(() => {
    const onClick = (event) => {
      if (event.button > 1) return
      const link = event.target.closest?.('a[href]')
      if (!link) return
      const action = classifyLink(link.href, window.location.origin)
      if (!action) return
      const { event: name, ...params } = action
      getTracking().event(name, { ...params, page_path: window.location.pathname })
    }
    document.addEventListener('click', onClick)
    document.addEventListener('auxclick', onClick)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('auxclick', onClick)
    }
  }, [])
  return null
}
