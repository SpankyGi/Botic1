import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang } from '../i18n/LangContext'
import RestooBooking from './RestooBooking'
import './BookingModal.css'

const CLOSE = { ca: 'Tancar reserves', es: 'Cerrar reservas', en: 'Close reservations', fr: 'Fermer les réservations' }
const RESERVATION_PAGE = /^\/(ca\/reserves|es\/reservas|en\/reservations|fr\/reservations)\/?$/

export default function BookingModal() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const lang = useLang()
  const { t } = useTranslation()
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const click = (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target.closest?.('a[href]')
      if (!link || !RESERVATION_PAGE.test(window.location.pathname)) return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.hash !== '#reserva') return
      event.preventDefault()
      // React Router respects defaultPrevented; menu close handlers can still run.
      setOpen(true)
    }
    document.addEventListener('click', click, true)
    return () => document.removeEventListener('click', click, true)
  }, [])
  return open ? <ReservationDialog lang={lang} title={t('common.bookTable')} onClose={() => setOpen(false)} /> : null
}

function ReservationDialog({ lang, title, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    const focus = document.activeElement
    const overflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      if (focus?.isConnected) focus.focus()
    }
  }, [])
  return createPortal(<dialog ref={ref} className="booking-modal" aria-labelledby="booking-modal-title"
    onCancel={(event) => { event.preventDefault(); onClose() }}
    onClick={(event) => {
      if (event.target !== ref.current) return
      const bounds = ref.current.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
    }}>
    <header className="booking-modal-header"><div><span>BO·TIC</span><h2 id="booking-modal-title">{title}</h2></div>
      <button type="button" onClick={onClose} aria-label={CLOSE[lang]}>×</button>
    </header>
    <RestooBooking lang={lang} />
  </dialog>, document.body)
}
