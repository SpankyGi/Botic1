import { Link } from 'react-router-dom'
import { LANGS } from '../i18n/routes'

const MESSAGES = {
  ca: { heading: 'Pàgina no trobada', body: 'La pàgina que busqueu no existeix.', home: 'Tornar a l\'inici' },
  es: { heading: 'Página no encontrada', body: 'La página que buscáis no existe.', home: 'Volver al inicio' },
  fr: { heading: 'Page introuvable', body: 'La page que vous cherchez n\'existe pas.', home: 'Retour à l\'accueil' },
  en: { heading: 'Page not found', body: 'The page you are looking for does not exist.', home: 'Back to home' },
}

export default function NotFound() {
  const pathLang = typeof window !== 'undefined'
    ? window.location.pathname.split('/')[1]
    : 'ca'
  const lang = LANGS.includes(pathLang) ? pathLang : 'ca'
  const { heading, body, home } = MESSAGES[lang]

  return (
    <section className="bg-botic-black min-h-screen flex items-center justify-center">
      <div className="container-max text-center py-32">
        <span className="font-serif text-8xl text-botic-gold/30 block mb-8">404</span>
        <h1 className="font-serif font-light text-4xl md:text-5xl text-botic-cream mb-6 tracking-tight">
          {heading}
        </h1>
        <p className="font-sans text-sm text-botic-muted mb-10">{body}</p>
        <Link to={`/${lang}`} className="btn-gold">{home}</Link>
      </div>
    </section>
  )
}
