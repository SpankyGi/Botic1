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
const GIFT_CHECKOUT = {
  ca: ['Regaleu una experiència Bo.TiC.', 'Trieu el vostre xec regal i completeu la compra a la botiga de Bo.TiC a Restoo.', 'Comprar un xec regal', 'La botiga s’obrirà en una pestanya nova.'],
  es: ['Regale una experiencia Bo.TiC.', 'Elija su cheque regalo y complete la compra en la tienda de Bo.TiC en Restoo.', 'Comprar un cheque regalo', 'La tienda se abrirá en una pestaña nueva.'],
  en: ['Give the gift of Bo.TiC.', 'Choose your gift voucher and complete your purchase in the Bo.TiC shop on Restoo.', 'Buy a gift voucher', 'The shop will open in a new tab.'],
  fr: ['Offrez une expérience Bo.TiC.', 'Choisissez votre chèque cadeau et finalisez votre achat dans la boutique Bo.TiC sur Restoo.', 'Acheter un chèque cadeau', 'La boutique s’ouvrira dans un nouvel onglet.'],
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
  // Restoo checkout requires a first-party session; embedded checkout can
  // silently return to the catalogue when third-party cookies are blocked.
  if (mode === 'gift') {
    const gift = GIFT_CHECKOUT[lang] || GIFT_CHECKOUT.ca
    return <div className="restoo-gift-checkout" style={{ padding: 'clamp(24px, 5vw, 48px)' }}>
      <h3 style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: 18 }}>{gift[0]}</h3>
      <p style={{ lineHeight: 1.7, marginBottom: 28 }}>{gift[1]}</p>
      <a className="btn-gold" href={bookingUrl} target="_blank" rel="noopener noreferrer">{gift[2]} ↗</a>
      <p style={{ fontSize: 13, marginTop: 18 }}>{gift[3]}</p>
    </div>
  }
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
