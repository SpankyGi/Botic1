import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { LangProvider } from './i18n/LangContext'
import { ROUTE_SLUGS, LANGS, DEFAULT_LANG } from './i18n/routes'

import CustomCursor  from './components/CustomCursor'
import Preloader     from './components/Preloader'
import Nav           from './components/Nav'
import ScrollProgress from './components/ScrollProgress'
import FloatingCTAs  from './components/FloatingCTAs'
import Footer        from './components/Footer'

import Home          from './pages/Home'
import Restaurant    from './pages/Restaurant'
import Gastronomia   from './pages/Gastronomia'
import Experiencia   from './pages/Experiencia'
import Menus         from './pages/Menus'
import Reserves      from './pages/Reserves'
import NotFound      from './pages/NotFound'
import Legal         from './pages/Legal'
import CookieConsent from './consent/CookieConsent'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Wrapper that sets language context for a subtree of routes
function LangLayout({ lang, children }) {
  return <LangProvider lang={lang}>{children}</LangProvider>
}

// Generate route elements for a given language
function LangRoutes({ lang }) {
  const s = ROUTE_SLUGS[lang]
  return (
    <LangLayout lang={lang}>
      <Routes>
        <Route index                  element={<Home />} />
        <Route path={s.restaurant}    element={<Restaurant />} />
        <Route path={s.gastronomia}   element={<Gastronomia />} />
        <Route path={s.menus}         element={<Menus />} />
        <Route path={s.experiencia}   element={<Experiencia />} />
        <Route path={s.reserves}      element={<Reserves />} />
        <Route path={s.horaris}       element={<Navigate to={`../${s.reserves.split('/').pop()}`} relative="path" replace />} />
        <Route path={s.legal}         element={<Legal type="legal" />} />
        <Route path={s.privacy}       element={<Legal type="privacy" />} />
        <Route path={s.cookies}       element={<Legal type="cookies" />} />
        <Route path={s.preferences}   element={<Legal type="preferences" />} />
        <Route path="*"               element={<NotFound />} />
      </Routes>
    </LangLayout>
  )
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <CustomCursor />
      <Preloader />
      <Nav />
      <ScrollProgress />
      <FloatingCTAs />
      <main>
        <Routes>
          {/* Root redirect → /ca */}
          <Route path="/" element={<Navigate to={`/${DEFAULT_LANG}`} replace />} />

          {/* Language-prefixed routes */}
          {LANGS.map(lang => (
            <Route key={lang} path={`/${lang}/*`} element={<LangRoutes lang={lang} />} />
          ))}

          {/* Global 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const currentLang = pathname.split('/').filter(Boolean)[0]
  const lang = LANGS.includes(currentLang) ? currentLang : DEFAULT_LANG

  return (
    <LangProvider lang={lang}>
      <AppContent />
    </LangProvider>
  )
}
