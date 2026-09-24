import { Link } from 'react-router-dom'
import { useLang, useLangRoutes } from '../i18n/LangContext'
import SEO from '../components/SEO'
import ResponsiveImage from '../components/ResponsiveImage'
import content from '../data/legacyContent.json'

const frenchVideoTitles = ['Mini-menu d’amuse-bouches · 2026', 'Saveurs · 2025', 'Une journée chez Bo.TiC · 2023', 'La salle · 2022', 'Merci · 2020', 'Félicitations · 2020', 'La table du chef · 2019', 'La tradition au service de l’évolution · 2017', 'Cuisine de l’Empordanet · 2017']
const frenchDocumentTitles = ['Charte graphique', 'Bo.TiC · Signature', 'Bo.TiC · Logo']

const documents = [
  ['Brand book', 'BrandBook_Bo.TiC.pdf'],
  ['Bo.TiC · Baseline', 'logo_Bo.TiC_Baseline.pdf'],
  ['Bo.TiC · Logo', 'logo_Bo.TiC_Curt.pdf'],
]

export default function LegacyContent({ pageKey }) {
  const lang = useLang()
  const routes = useLangRoutes()
  const copy = content.copy[lang]
  const [title, description, body] = copy[pageKey]
  return (
    <article className="legacy-content container-max">
      <SEO title={copy.seo[pageKey]} description={description} pageKey={pageKey} />
      <h1>{title}</h1>
      <p className="legacy-intro">{description}</p>
      {pageKey === 'chefTable' && <>
        <ResponsiveImage src="/images/restaurant-taula-xef-emporda.webp" mobileSrc="/images/restaurant-taula-xef-emporda-mobile.webp" alt={title} className="legacy-chef-image" />
        <p>{body}</p>
        <div className="legacy-actions"><Link to={routes.menus}>{copy.menu} →</Link><Link to={routes.reserves}>{copy.reserve} →</Link></div>
      </>}
      {pageKey === 'videos' && <div className="legacy-grid">
        {content.videos.map((video, index) => <section key={video.url}>
          <h2>{lang === 'fr' ? frenchVideoTitles[index] : video.title}</h2>
          <a href={video.url} target="_blank" rel="noopener noreferrer">{copy.watch} ↗</a>
        </section>)}
      </div>}
      {pageKey === 'identity' && <div className="legacy-grid">
        {documents.map(([label, file], index) => <section key={file}><h2>{lang === 'fr' ? frenchDocumentTitles[index] : label}</h2><a href={`/pdf/${file}`}>{copy.download} ↓</a></section>)}
      </div>}
    </article>
  )
}
