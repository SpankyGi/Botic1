import { useEffect, useState } from 'react'

const COPY = {
  ca: ['Carregant les reserves…', 'Si el formulari no es carrega, podeu reservar directament a Restoo.', 'Obrir les reserves'],
  es: ['Cargando las reservas…', 'Si el formulario no se carga, puede reservar directamente en Restoo.', 'Abrir las reservas'],
  en: ['Loading reservations…', 'If the form does not load, you can book directly with Restoo.', 'Open reservations'],
  fr: ['Chargement des réservations…', 'Si le formulaire ne se charge pas, vous pouvez réserver directement sur Restoo.', 'Ouvrir les réservations'],
}
export default function RestooBooking({ lang }) {
  const [loading, setLoading] = useState(true)
  const copy = COPY[lang] || COPY.ca
  const bookingUrl = `https://bo-tic.myrestoo.net/${lang}/reservar`
  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 20000)
    return () => clearTimeout(timeout)
  }, [lang])
  return <div className="restoo-booking">
    {loading && <p role="status">{copy[0]}</p>}
    <div className="restoo-booking-host">
      <iframe key={lang} className="restoo-legacy-frame" src={bookingUrl}
        title={copy[2]} loading="eager" allow="payment"
        onLoad={() => setLoading(false)} />
    </div>
    <p className="restoo-booking-fallback">{copy[1]} <a href={bookingUrl} target="_blank" rel="noopener noreferrer">{copy[2]} ↗</a></p>
  </div>
}
