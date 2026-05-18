import { useEffect } from 'react'

/**
 * Updates document title and meta tags per page.
 * For production SSR/SSG, replace with React Helmet or Next.js <Head>.
 */
export default function SEO({ title, description, canonical, ogImage }) {
  useEffect(() => {
    if (title) document.title = title

    const setMeta = (key, value, isProperty = false) => {
      if (!value) return
      const attr = isProperty ? `property` : `name`
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    setMeta('description', description)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    if (ogImage) setMeta('og:image', ogImage, true)

    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }
  }, [title, description, canonical, ogImage])

  return null
}
