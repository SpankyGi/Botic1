import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { LangProvider } from './i18n/LangContext'
import { ROUTE_SLUGS, LANGS, DEFAULT_LANG } from './i18n/routes'

import CustomCursor  from './components/CustomCursor'
import Preloader     from './components/Preloader'
import TopBar        from './components/TopBar'
import Nav           from './components/Nav'
import FloatingCTAs  from './components/FloatingCTAs'
import Footer        from './components/Footer'

import Home          from './pages/Home'
import Restaurant    from './pages/Restaurant'
import Gastronomia   from './pages/Gastronomia'
import Experiencia   from './pages/Experiencia'
import Menus         from './pages/Menus'
import Reserves      from './pages/Reserves'
import Horaris       from './pages/Horaris'
import NotFound      from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Wrapper that sets language context for a subtree of routes
function LangLayout({ lang, children }) {
  return <LangProvider lang={lang}>{children}</LangProvider>
}

// Fos + lleuger blur entre pàgines. Es desactiva sol si l'usuari prefereix
// menys moviment (useReducedMotion de framer-motion llegeix el media query).
function PageTransition({ children }) {
  const reduceMotion = useReducedMotion()

if (reduceMotion) return children

return (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(6px)' }}
    animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.19, 1, 0.22, 1] } }}
    exit={{ opacity: 0, filter: 'blur(6px)', transition: { duration: 0.32, ease: [0.4, 0, 1, 1] } }}
    >
    {children}
  </motion.div>
  )
}

// Generate route elements for a given language
function LangRoutes({ lang }) {
  const s = ROUTE_SLUGS[lang]
    const location = useLocation()
      
      return (
        <LangLayout lang={lang}>
        <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
        <Route index                  element={<PageTransition><Home /></PageTransition>} />
        <Route path={s.restaurant}    element={<PageTransition><Restaurant /></PageTransition>} />
        <Route path={s.gastronomia}   element={<PageTransition><Gastronomia /></PageTransition>} />
        <Route path={s.menus}         element={<PageTransition><Menus /></PageTransition>} />
        <Route path={s.experiencia}   element={<PageTransition><Experiencia /></PageTransition>} />
        <Route path={s.reserves}      element={<PageTransition><Reserves /></PageTransition>} />
        <Route path={s.horaris}       element={<PageTransition><Horaris /></PageTransition>} />
        <Route path="*"               element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
        </AnimatePresence>
        </LangLayout>
        )
}
</motion.div>
  function AppContent() {
    return (
  <>
  <ScrollToTop />
  <CustomCursor />
  <Preloader />
  <TopBar />
  <Nav />
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
</>
