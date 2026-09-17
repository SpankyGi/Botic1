import { useEffect, useState } from 'react'

const COPY = {
  ca: ['Carregant les reserves…', 'Si el formulari no es carrega, podeu reservar directament a Restoo.', 'Obrir les reserves'],
  es: ['Cargando las reservas…', 'Si el formulario no se carga, puede reservar directamente en Restoo.', 'Abrir las reservas'],
  en: ['Loading reservations…', 'If the form does not load, you can book directly with Restoo.', 'Open reservations'],
  fr: ['Chargement des réservations…', 'Si le formulaire ne se charge pas, vous pouvez réserver directement sur Restoo.', 'Ouvrir les réservations'],
}
const GIFT_COPY = {
  ca: ['Carregant els xecs regal…', 'Si la botiga no es carrega, podeu obrir-la directament a Restoo.', 'Obrir els xecs regal'],
  es: ['Cargando los cheques regalo…', 'Si la tienda no se carga, puede abrirla directamente en Restoo.', 'Abrir los cheques regalo'],
  en: ['Loading gift vouchers…', 'If the shop does not load, you can open it directly with Restoo.', 'Open gift vouchers'],
  fr: ['Chargement des chèques cadeaux…', 'Si la boutique ne se charge pas, vous pouvez l’ouvrir directement sur Restoo.', 'Ouvrir les chèques cadeaux'],
}

export default function RestooBooking({ lang, mode = 'booking' }) {
  const [loading, setLoading] = useState(true)
  const translations = mode === 'gift' ? GIFT_COPY : COPY
  const copy = translations[lang] || translations.ca
  const bookingUrl = `https://bo-tic.myrestoo.net/${lang}/${mode === 'gift' ? 'tienda' : 'reservar'}`
  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 20000)
    return () => clearTimeout(timeout)
  }, [lang, mode])
  return <div className="restoo-booking">
    {loading && <p role="status">{copy[0]}</p>}
    <div className="restoo-booking-host">
      <iframe key={`${lang}-${mode}`} className="restoo-legacy-frame" src={bookingUrl}
        title={copy[2]} loading="eager" allow="payment"
        onLoad={() => setLoading(false)} />
    </div>
    <p className="restoo-booking-fallback">{copy[1]} <a href={bookingUrl} target="_blank" rel="noopener noreferrer">{copy[2]} ↗</a></p>
  </div>
}
