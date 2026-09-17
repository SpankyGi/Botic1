import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export const CAREERS_COPY = {
  ca: { title: 'Treballa amb nosaltres', intro: 'La cuina, la sala i l’hospitalitat es construeixen en equip. Si comparteixes la passió per la gastronomia i la cura pels detalls, ens agradarà conèixer-te.', name: 'Nom i cognoms', email: 'Correu electrònic', phone: 'Telèfon (opcional)', message: 'Explica’ns una mica de tu', placeholder: 'En quin àmbit t’agradaria treballar? Quina experiència i disponibilitat tens?', close: 'Tancar', privacy: 'Política de privacitat' },
  es: { title: 'Trabaja con nosotros', intro: 'La cocina, la sala y la hospitalidad se construyen en equipo. Si compartes la pasión por la gastronomía y el cuidado por los detalles, nos encantará conocerte.', name: 'Nombre y apellidos', email: 'Correo electrónico', phone: 'Teléfono (opcional)', message: 'Cuéntanos un poco sobre ti', placeholder: '¿En qué área te gustaría trabajar? ¿Qué experiencia y disponibilidad tienes?', close: 'Cerrar', privacy: 'Política de privacidad' },
  en: { title: 'Work with us', intro: 'Our kitchen, dining room and hospitality are built on teamwork. If you share our passion for gastronomy and attention to detail, we would love to meet you.', name: 'Full name', email: 'Email address', phone: 'Phone (optional)', message: 'Tell us a little about yourself', placeholder: 'Which role interests you? Tell us about your experience and availability.', close: 'Close', privacy: 'Privacy policy' },
  fr: { title: 'Rejoignez notre équipe', intro: 'La cuisine, la salle et l’hospitalité se construisent en équipe. Si vous partagez notre passion pour la gastronomie et le souci du détail, nous serons ravis de vous connaître.', name: 'Nom et prénom', email: 'Adresse e-mail', phone: 'Téléphone (facultatif)', message: 'Parlez-nous un peu de vous', placeholder: 'Quel poste vous intéresse ? Quelle est votre expérience et votre disponibilité ?', close: 'Fermer', privacy: 'Politique de confidentialité' },
}

const AVAILABILITY = {
  ca: 'El formulari de candidatures estarà disponible aviat. Mentrestant, pots enviar-nos la teva candidatura per correu electrònic:',
  es: 'El formulario de candidaturas estará disponible próximamente. Mientras tanto, puedes enviarnos tu candidatura por correo electrónico:',
  en: 'Our application form will be available soon. In the meantime, you can email us your application:',
  fr: 'Le formulaire de candidature sera bientôt disponible. En attendant, vous pouvez nous envoyer votre candidature par e-mail :',
}

export default function CareersDialog({ lang, privacyUrl, onClose }) {
  const dialog = useRef(null)
  const copy = CAREERS_COPY[lang] || CAREERS_COPY.ca
  useEffect(() => {
    const element = dialog.current
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [])
  return createPortal(<dialog className="careers-dialog" ref={dialog} aria-labelledby="careers-title"
    onCancel={(event) => { event.preventDefault(); onClose() }}
    onClick={(event) => { if (event.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose() } }}>
    <button type="button" className="careers-close" aria-label={copy.close} onClick={onClose}>×</button>
    <span className="careers-brand">BO·TIC · CORÇÀ</span>
    <h2 id="careers-title">{copy.title}</h2>
    <p className="careers-intro">{copy.intro}</p>
    <div className="careers-availability">
      <p>{AVAILABILITY[lang] || AVAILABILITY.ca}</p>
      <a className="careers-email" href="mailto:restaurant@bo-tic.com">restaurant@bo-tic.com</a>
    </div>
    <p className="careers-note"><a className="careers-privacy" href={privacyUrl} target="_blank" rel="noopener noreferrer">{copy.privacy} ↗</a></p>
  </dialog>, document.body)
}
