import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLang } from '../i18n/LangContext'
import RestooBooking from './RestooBooking'
import './BookingModal.css'

const CLOSE = { ca: 'Tancar reserves', es: 'Cerrar reservas', en: 'Close reservations', fr: 'Fermer les réservations' }
const GIFT = {
  ca: ['Xecs regal', 'Tancar xecs regal'],
  es: ['Cheques regalo', 'Cerrar cheques regalo'],
  en: ['Gift vouchers', 'Close gift vouchers'],
  fr: ['Chèques cadeaux', 'Fermer les chèques cadeaux'],
}
const GROUP_NOTICE = {
  ca: ['Taules de més de 6 persones', 'És obligatori sol·licitar la reserva per correu electrònic a:'],
  es: ['Mesas de más de 6 personas', 'Es obligatorio solicitar la reserva por correo electrónico a:'],
  en: ['Tables of more than 6 guests', 'Reservations must be requested by email at:'],
  fr: ['Tables de plus de 6 personnes', 'La réservation doit obligatoirement être demandée par e-mail à :'],
}
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
      if (!link || link.target === '_blank') return
      const url = new URL(link.href, window.location.href)
      const gift = url.origin === 'https://bo-tic.myrestoo.net' && /^\/(ca|es|en|fr)\/tienda\/?$/.test(url.pathname)
      const booking = RESERVATION_PAGE.test(window.location.pathname) && url.origin === window.location.origin && url.pathname === window.location.pathname && url.hash === '#reserva'
      if (!gift && !booking) return
      event.preventDefault()
      // React Router respects defaultPrevented; menu close handlers can still run.
      setOpen(gift ? 'gift' : 'booking')
    }
    document.addEventListener('click', click, true)
    return () => document.removeEventListener('click', click, true)
  }, [])
  return open ? <ReservationDialog lang={lang} mode={open} title={open === 'gift' ? GIFT[lang][0] : t('common.bookTable')} onClose={() => setOpen(false)} /> : null
}

function ReservationDialog({ lang, mode, title, onClose }) {
  const ref = useRef(null)
  const groupNotice = GROUP_NOTICE[lang] || GROUP_NOTICE.ca
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
      <button type="button" onClick={onClose} aria-label={mode === 'gift' ? GIFT[lang][1] : CLOSE[lang]}>×</button>
    </header>
    {mode === 'booking' && <aside className="booking-group-notice" aria-labelledby="booking-group-title">
      <span className="booking-group-badge" aria-hidden="true">+6</span>
      <div>
      <h3 id="booking-group-title">{groupNotice[0]}</h3>
      <p>{groupNotice[1]} <a href="mailto:restaurant@bo-tic.com">restaurant@bo-tic.com</a></p>
      </div>
    </aside>}
    <RestooBooking lang={lang} mode={mode} />
  </dialog>, document.body)
}
