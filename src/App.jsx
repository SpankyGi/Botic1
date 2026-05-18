import CustomCursor  from './components/CustomCursor'
import Preloader     from './components/Preloader'
import TopBar        from './components/TopBar'
import Nav           from './components/Nav'
import FloatingCTAs  from './components/FloatingCTAs'
import Footer        from './components/Footer'
import Home          from './pages/Home'

export default function App() {
  return (
    <>
      <CustomCursor />
      <Preloader />
      <TopBar />
      <Nav />
      <FloatingCTAs />
      <main>
        <Home />
      </main>
      <Footer />
    </>
  )
}
