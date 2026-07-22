import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import { useLangRoutes } from '../i18n/LangContext'

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
  const routes = useLangRoutes()
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

      <section className="bg-[#0b0908] border-y border-botic-border py-20 md:py-28" aria-labelledby="relevant-info-title">
        <div className="container-max">
          <header className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mb-14 md:mb-20">
            <span className="label lg:col-span-3">{t('reserves.infoEyebrow')}</span>
            <h2 id="relevant-info-title" className="font-serif font-light text-4xl md:text-6xl text-botic-cream leading-[1.02] tracking-tight lg:col-span-8">
              {t('reserves.infoHeading')}
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-botic-border">
            <article className="py-10 md:pr-8 md:border-r border-botic-border">
              <span className="font-sans text-[10px] tracking-[0.25em] text-botic-gold block mb-8">01</span>
              <h3 className="font-serif text-3xl text-botic-cream mb-6">{t('reserves.restaurantTitle')}</h3>
              <div className="space-y-4 font-sans text-sm leading-relaxed text-botic-muted">
                <p>{t('reserves.restaurantPets')}</p>
                <p>{t('reserves.restaurantHours')}</p>
                <p>{t('reserves.restaurantParking')}</p>
                <a href="https://www.google.com/maps/d/viewer?mid=13ycz7ovNLHKlPEOouM13aNPLOzpPzv4&ll=41.98827961281014%2C3.016173340973789&z=17" target="_blank" rel="noopener noreferrer" className="inline-block text-[11px] tracking-[0.2em] uppercase text-botic-gold hover:text-botic-cream transition-colors">
                  {t('reserves.restaurantParkingLink')} →
                </a>
              </div>
            </article>

            <article className="py-10 md:px-8 md:border-r border-botic-border border-t md:border-t-0">
              <span className="font-sans text-[10px] tracking-[0.25em] text-botic-gold block mb-8">02</span>
              <h3 className="font-serif text-3xl text-botic-cream mb-6">{t('reserves.menusTitle')}</h3>
              <div className="space-y-4 font-sans text-sm leading-relaxed text-botic-muted">
                <p>{t('reserves.menusAllergies')}</p>
                <p>{t('reserves.menusFullTable')}</p>
                <Link to={routes.menus} className="inline-block text-[11px] tracking-[0.2em] uppercase text-botic-gold hover:text-botic-cream transition-colors">
                  {t('reserves.menusLink')} →
                </Link>
              </div>
            </article>

            <article className="py-10 md:pl-8 border-t md:border-t-0 border-botic-border">
              <span className="font-sans text-[10px] tracking-[0.25em] text-botic-gold block mb-8">03</span>
              <h3 className="font-serif text-3xl text-botic-cream mb-6">{t('reserves.childrenTitle')}</h3>
              <div className="space-y-4 font-sans text-sm leading-relaxed text-botic-muted">
                <p>{t('reserves.childrenConduct')}</p>
                <p>{t('reserves.childrenStroller')}</p>
                <p>{t('reserves.childrenHighchairs')}</p>
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-botic-border pt-14 md:pt-20">
            <div className="lg:col-span-4 space-y-12">
              <article>
                <span className="label block mb-4">{t('reserves.importantTitle')}</span>
                <p className="font-sans text-sm leading-relaxed text-botic-cream/75">{t('reserves.importantConfirm')}</p>
              </article>
              <article className="pt-10 border-t border-botic-border">
                <span className="label block mb-4">{t('reserves.taxiTitle')}</span>
                <p className="font-sans text-sm leading-relaxed text-botic-muted">{t('reserves.taxiBody')}</p>
              </article>
            </div>

            <article className="lg:col-span-8 lg:border-l lg:border-botic-border lg:pl-16">
              <span className="label block mb-5">{t('reserves.cancellationTitle')}</span>
              <h3 className="font-serif font-light text-3xl md:text-5xl text-botic-cream leading-tight mb-9">
                {t('reserves.cancellationNotice')}
              </h3>
              <ol className="space-y-0 border-t border-botic-border">
                {['cancellationGrace', 'cancellationHow', 'cancellationConfirm', 'cancellationCharge'].map((key, index) => (
                  <li key={key} className="grid grid-cols-[2rem_1fr] md:grid-cols-[3rem_1fr] gap-3 py-5 border-b border-botic-border font-sans text-sm leading-relaxed text-botic-muted">
                    <span className="text-botic-gold text-[10px] tracking-[0.2em] pt-1">0{index + 1}</span>
                    <span className={key === 'cancellationCharge' ? 'text-botic-cream' : ''}>{t(`reserves.${key}`)}</span>
                  </li>
                ))}
              </ol>
            </article>
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
