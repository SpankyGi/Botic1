import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
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
          <Route path="/"            element={<Home />} />
          <Route path="/restaurant"  element={<Restaurant />} />
          <Route path="/gastronomia" element={<Gastronomia />} />
          <Route path="/menus"        element={<Menus />} />
          <Route path="/experiencia" element={<Experiencia />} />
          <Route path="/reserves"    element={<Reserves />} />
          <Route path="/horaris"     element={<Horaris />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
