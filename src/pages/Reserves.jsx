import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO.jsx'

function ContactItem({ label, children }) {
  return (
    <div className="border-b border-botic-border pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
      <span className="text-[11px] tracking-[0.25em] uppercase text-botic-gold
                       font-sans block mb-2">
        {label}
      </span>
      <div className="font-sans text-botic-muted text-sm md:text-base leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export default function Reserves() {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    nom: '', email: '', telefon: '', persones: '2', data: '', missatge: '',
  })

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  const inputClass = `w-full bg-transparent border border-botic-border text-botic-cream
    font-sans text-sm px-4 py-3 focus:outline-none focus:border-botic-gold
    transition-colors duration-300 placeholder:text-botic-muted`

  const HOURS = [
    { day: t('reserves.days.Dimecres'), lunch: '13:00 – 15:00', dinner: '20:30 – 22:00' },
    { day: t('reserves.days.Dijous'),   lunch: '13:00 – 15:00', dinner: '20:30 – 22:00' },
    { day: t('reserves.days.Divendres'),lunch: '13:00 – 15:00', dinner: '20:30 – 22:00' },
    { day: t('reserves.days.Dissabte'), lunch: '13:00 – 15:00', dinner: '20:30 – 22:00' },
    { day: t('reserves.days.Diumenge'), lunch: '13:00 – 15:00', dinner: '—' },
  ]

  return (
    <>
      <SEO
        title={t('seo.reserves.title')}
        description={t('seo.reserves.description')}
        pageKey="reserves"
      />

      <section className="bg-botic-black pt-36 md:pt-44 pb-16 md:pb-20">
        <div className="container-max">
          <span className="label block mb-4">{t('reserves.heroLabel')}</span>
          <h1 className="font-serif font-light text-5xl md:text-6xl lg:text-7xl
                         text-botic-cream leading-[1.05] tracking-tight max-w-2xl">
            {t('reserves.heroHeading')}
          </h1>
        </div>
      </section>

      <section className="bg-botic-black pb-20 md:pb-28">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            <div>
              <ContactItem label={t('reserves.addressLabel')}>
                <address className="not-italic">
                  <p>{t('reserves.addressLine1')}</p>
                  <p>{t('reserves.addressLine2')}</p>
                  <a
                    href="https://maps.google.com/?q=Carrer+dels+Forns+7,+Corçà,+Girona"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-[11px] tracking-[0.2em] uppercase
                               text-botic-gold hover:text-botic-cream transition-colors duration-300"
                  >
                    {t('reserves.mapLink')}
                  </a>
                </address>
              </ContactItem>

              <ContactItem label={t('reserves.phoneLabel')}>
                <a href="tel:+34972630869" className="hover:text-botic-cream transition-colors duration-300">
                  +34 972 630 869
                </a>
              </ContactItem>

              <ContactItem label={t('reserves.emailLabel')}>
                <a href="mailto:reserves@bo-tic.com" className="hover:text-botic-cream transition-colors duration-300">
                  reserves@bo-tic.com
                </a>
              </ContactItem>

              <ContactItem label={t('reserves.hoursLabel')}>
                <div className="space-y-2">
                  {HOURS.map(({ day, lunch, dinner }) => (
                    <div key={day} className="grid grid-cols-3 gap-2 text-xs">
                      <span className="text-botic-cream">{day}</span>
                      <span>{lunch}</span>
                      <span>{dinner}</span>
                    </div>
                  ))}
                  <p className="text-xs text-botic-border mt-4 pt-4 border-t border-botic-border">
                    {t('reserves.closedNote')}
                  </p>
                </div>
              </ContactItem>

              <div className="mt-8">
                <div className="bg-botic-surface h-48 flex items-center justify-center border border-botic-border">
                  <a
                    href="https://maps.google.com/?q=Carrer+dels+Forns+7,+Corçà,+Girona"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold"
                  >
                    {t('reserves.openMaps')}
                  </a>
                </div>
                <p className="mt-2 text-xs text-botic-muted">{t('reserves.distanceNote')}</p>
              </div>
            </div>

            <div>
              <h2 className="font-serif font-light text-3xl md:text-4xl text-botic-cream tracking-tight mb-2">
                {t('reserves.formHeading')}
              </h2>
              <p className="font-sans text-sm text-botic-muted leading-relaxed mb-8">
                {t('reserves.formIntro')}
              </p>

              {sent ? (
                <div className="border border-botic-gold p-8 text-center">
                  <span className="font-serif text-4xl text-botic-gold block mb-4">{t('reserves.confirmGlyph')}</span>
                  <h3 className="font-serif font-light text-2xl text-botic-cream mb-3">{t('reserves.confirmHeading')}</h3>
                  <p className="font-sans text-sm text-botic-muted">{t('reserves.confirmBody')}</p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  name="reserves"
                  method="POST"
                  data-netlify="true"
                  className="space-y-4"
                  aria-label={t('reserves.formAria')}
                >
                  <input type="hidden" name="form-name" value="reserves" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nom" className="text-[11px] tracking-[0.2em] uppercase text-botic-muted font-sans block mb-1.5">
                        {t('reserves.fieldName')}
                      </label>
                      <input id="nom" name="nom" type="text" required value={form.nom}
                        onChange={handleChange} placeholder={t('reserves.placeholderName')} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="telefon" className="text-[11px] tracking-[0.2em] uppercase text-botic-muted font-sans block mb-1.5">
                        {t('reserves.fieldPhone')}
                      </label>
                      <input id="telefon" name="telefon" type="tel" required value={form.telefon}
                        onChange={handleChange} placeholder={t('reserves.placeholderPhone')} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="text-[11px] tracking-[0.2em] uppercase text-botic-muted font-sans block mb-1.5">
                      {t('reserves.fieldEmail')}
                    </label>
                    <input id="email" name="email" type="email" required value={form.email}
                      onChange={handleChange} placeholder={t('reserves.placeholderEmail')} className={inputClass} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="data" className="text-[11px] tracking-[0.2em] uppercase text-botic-muted font-sans block mb-1.5">
                        {t('reserves.fieldDate')}
                      </label>
                      <input id="data" name="data" type="date" required value={form.data}
                        onChange={handleChange} className={`${inputClass} [color-scheme:dark]`} />
                    </div>
                    <div>
                      <label htmlFor="persones" className="text-[11px] tracking-[0.2em] uppercase text-botic-muted font-sans block mb-1.5">
                        {t('reserves.fieldGuests')}
                      </label>
                      <select id="persones" name="persones" value={form.persones}
                        onChange={handleChange} className={`${inputClass} [color-scheme:dark] cursor-pointer`}>
                        {[1,2,3,4,5,6,7,8].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? t('common.person') : t('common.persons')}
                          </option>
                        ))}
                        <option value="9+">{t('common.group')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="missatge" className="text-[11px] tracking-[0.2em] uppercase text-botic-muted font-sans block mb-1.5">
                      {t('reserves.fieldMessage')}
                    </label>
                    <textarea id="missatge" name="missatge" rows={4} value={form.missatge}
                      onChange={handleChange} placeholder={t('reserves.placeholderMessage')}
                      className={`${inputClass} resize-none`} />
                  </div>

                  <button type="submit" className="btn-gold w-full text-center"
                    style={{ padding: '16px', justifyContent: 'center' }}>
                    {t('reserves.submitBtn')}
                  </button>

                  <p className="text-xs text-botic-muted leading-relaxed">{t('reserves.formNote')}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-botic-ivory py-16 md:py-20">
        <div className="container-max text-center">
          <h2 className="font-serif font-light text-3xl md:text-4xl text-botic-text tracking-tight mb-4">
            {t('reserves.footerHeading')}
          </h2>
          <p className="font-sans text-sm text-botic-text/60 max-w-md mx-auto leading-relaxed">
            {t('reserves.footerBody')}
          </p>
        </div>
      </section>
    </>
  )
}
