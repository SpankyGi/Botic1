import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { LANGS, ROUTE_SLUGS } from '../src/i18n/routes.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const serverEntry = pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href
const { getStaticSeo, render } = await import(serverEntry)
const template = await readFile(join(dist, 'index.html'), 'utf8')

const routes = LANGS.flatMap(lang => [
  `/${lang}/`,
  ...Object.values(ROUTE_SLUGS[lang]).map(slug => `/${lang}/${slug}/`),
])

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

function withStaticHead(html, seo) {
  const alternateLinks = [
    ...seo.alternates.map(({ lang, href }) => `<link rel="alternate" hreflang="${lang}" href="${href}">`),
    `<link rel="alternate" hreflang="x-default" href="${seo.alternates.find(({ lang }) => lang === 'ca').href}">`,
  ].join('\n    ')
  const staticHead = `
    <link rel="canonical" href="${seo.canonical}">
    ${alternateLinks}
    <meta property="og:url" content="${seo.canonical}">
    <meta property="og:image" content="${seo.ogImage}">
    <meta property="og:image:alt" content="Bo.TiC · Restaurant gastronòmic a Corçà">
    <meta name="twitter:title" content="${escapeHtml(seo.title)}">
    <meta name="twitter:description" content="${escapeHtml(seo.description)}">
    <meta name="twitter:image" content="${seo.ogImage}">`

  return html
    .replace(/<html lang="[^"]*">/, `<html lang="${seo.lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escapeHtml(seo.description)}">`)
    .replace(/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${escapeHtml(seo.title)}">`)
    .replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escapeHtml(seo.description)}">`)
    .replace(/<meta\s+property="og:image"[^>]*>/, '')
    .replace('</head>', `${staticHead}\n  </head>`)
}

for (const route of routes) {
  const seo = getStaticSeo(route)
  const appHtml = await render(route)
  const output = withStaticHead(template, seo).replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
  const outputFile = join(dist, route, 'index.html')
  await mkdir(dirname(outputFile), { recursive: true })
  await writeFile(outputFile, output)
}

const pageKeys = ['home', 'restaurant', 'gastronomia', 'menus', 'experiencia', 'reserves', 'horaris']
const sitemapEntries = pageKeys.flatMap(pageKey => LANGS.map(lang => {
  const seo = getStaticSeo(`/${lang}/${pageKey === 'home' ? '' : ROUTE_SLUGS[lang][pageKey]}/`)
  const alternates = [
    ...seo.alternates.map(({ lang: alternateLang, href }) => `    <xhtml:link rel="alternate" hreflang="${alternateLang}" href="${href}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${seo.alternates.find(({ lang: alternateLang }) => alternateLang === 'ca').href}"/>`,
  ].join('\n')
  return `  <url>\n    <loc>${seo.canonical}</loc>\n${alternates}\n  </url>`
})).join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries}\n</urlset>\n`
await writeFile(join(dist, 'sitemap.xml'), sitemap)

const notFoundHtml = withStaticHead(template, getStaticSeo('/ca/'))
  .replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex, follow">')
  .replace('<div id="root"></div>', `<div id="root">${await render('/ca/pagina-no-trobada/')}</div>`)
await writeFile(join(dist, '404.html'), notFoundHtml)

await rm(join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`Prerendered ${routes.length} routes.`)
