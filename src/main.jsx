import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import i18n from './i18n/index.js'
import App from './App.jsx'
import './index.css'

async function bootstrap() {
  const lang = window.location.pathname.split('/').filter(Boolean)[0]
  if (['ca', 'es', 'en', 'fr'].includes(lang) && i18n.language !== lang) {
    await i18n.changeLanguage(lang)
  }

  const app = (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  )
  const root = document.getElementById('root')

  // El HTML estàtic serveix SEO i compartició abans de JavaScript. L'app és
  // deliberadament client-side després de carregar per evitar desajustos amb
  // les animacions i l'estat de cada ruta.
  ReactDOM.createRoot(root).render(app)
}

bootstrap()
