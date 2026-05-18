import { useState } from 'react'
import SEO from '../components/SEO.jsx'

const HOURS = [
  { day: 'Dimecres',  lunch: '13:00 – 15:00', dinner: '20:30 – 22:00' },
  { day: 'Dijous',    lunch: '13:00 – 15:00', dinner: '20:30 – 22:00' },
  { day: 'Divendres', lunch: '13:00 – 15:00', dinner: '20:30 – 22:00' },
  { day: 'Dissabte',  lunch: '13:00 – 15:00', dinner: '20:30 – 22:00' },
  { day: 'Diumenge',  lunch: '13:00 – 15:00', dinner: '—'              },
]

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

export default function Contacte() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    nom: '', email: '', telefon: '', persones: '2', data: '', missatge: '',
  })

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Connectar aquí amb el backend de reserves (Netlify Forms, API, etc.)
    setSent(true)
  }

  const inputClass = `w-full bg-transparent border border-botic-border text-botic-cream
    font-sans text-sm px-4 py-3 focus:outline-none focus:border-botic-gold
    transition-colors duration-300 placeholder:text-botic-muted`

  return (
    <>
      <SEO
        title="Contacte i Reserves · Bo.TiC · Restaurant Gastronòmic Corçà"
        description="Reserveu taula al restaurant Bo.TiC de Corçà, Girona. Telèfon, email, adreça i horaris. Restaurant gastronòmic Michelin a l'Empordà."
        canonical="https://www.bo-tic.com/contacte"
      />

      {/* ── Header de pàgina ── */}
      <section className="bg-botic-black pt-36 md:pt-44 pb-16 md:pb-20">
        <div className="container-max">
          <span className="label">Contacte i reserves</span>
          <h1 className="font-serif font-light text-5xl md:text-6xl lg:text-7xl
                         text-botic-cream leading-[1.05] tracking-tight max-w-2xl">
            Veniu a taula
          </h1>
        </div>
      </section>

      {/* ── Contingut ── */}
      <section className="bg-botic-black pb-20 md:pb-28">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Informació de contacte */}
            <div>
              <ContactItem label="Adreça">
                <address className="not-italic">
                  <p>Carrer dels Forns, 7</p>
                  <p>17121 Corçà (Girona)</p>
                  <a
                    href="https://maps.google.com/?q=Carrer+dels+Forns+7,+Corçà,+Girona"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-[11px] tracking-[0.2em] uppercase
                               text-botic-gold hover:text-botic-cream transition-colors duration-300"
                  >
                    Veure al mapa →
                  </a>
                </address>
              </ContactItem>

              <ContactItem label="Telèfon">
                <a
                  href="tel:+34972630869"
                  className="hover:text-botic-cream transition-colors duration-300"
                >
                  +34 972 630 869
                </a>
              </ContactItem>

              <ContactItem label="Correu electrònic">
                <a
                  href="mailto:reserves@bo-tic.com"
                  className="hover:text-botic-cream transition-colors duration-300"
                >
                  reserves@bo-tic.com
                </a>
              </ContactItem>

              <ContactItem label="Horaris d'obertura">
                <div className="space-y-2">
                  {HOURS.map(({ day, lunch, dinner }) => (
                    <div key={day} className="grid grid-cols-3 gap-2 text-xs">
                      <span className="text-botic-cream">{day}</span>
                      <span>{lunch}</span>
                      <span>{dinner}</span>
                    </div>
                  ))}
                  <p className="text-xs text-botic-border mt-4 pt-4 border-t border-botic-border">
                    Dilluns i dimarts: tancat
                  </p>
                </div>
              </ContactItem>

              {/* Mapa embedded (placeholder amb link) */}
              <div className="mt-8">
                <div
                  className="bg-botic-surface h-48 flex items-center justify-center
                             border border-botic-border"
                  aria-label="Mapa de localització del restaurant Bo.TiC"
                >
                  <a
                    href="https://maps.google.com/?q=Carrer+dels+Forns+7,+Corçà,+Girona"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold !py-2.5 !px-6"
                  >
                    Obrir Google Maps
                  </a>
                </div>
                <p className="mt-2 text-xs text-botic-muted">
                  A 15 min de Girona · A 30 min de Figueres · A 20 min de Palamós
                </p>
              </div>
            </div>

            {/* Formulari de reserves */}
            <div>
              <h2 className="font-serif font-light text-3xl md:text-4xl
                             text-botic-cream tracking-tight mb-2">
                Sol·licitud de reserva
              </h2>
              <p className="font-sans text-sm text-botic-muted leading-relaxed mb-8">
                Empleneu el formulari i us contactarem per confirmar la disponibilitat.
                Per a reserves urgents, truqueu directament al restaurant.
              </p>

              {sent ? (
                <div className="border border-botic-gold p-8 text-center">
                  <span className="font-serif text-4xl text-botic-gold block mb-4">✦</span>
                  <h3 className="font-serif font-light text-2xl text-botic-cream mb-3">
                    Sol·licitud rebuda
                  </h3>
                  <p className="font-sans text-sm text-botic-muted">
                    Us contactarem en les pròximes hores per confirmar
                    la vostra reserva. Gràcies per triar Bo.TiC.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  name="reserves"
                  method="POST"
                  data-netlify="true"
                  className="space-y-4"
                  aria-label="Formulari de reserva Bo.TiC"
                >
                  <input type="hidden" name="form-name" value="reserves" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nom" className="text-[11px] tracking-[0.2em] uppercase
                                                      text-botic-muted font-sans block mb-1.5">
                        Nom i cognoms *
                      </label>
                      <input
                        id="nom"
                        name="nom"
                        type="text"
                        required
                        value={form.nom}
                        onChange={handleChange}
                        placeholder="Joan Garcia"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="telefon" className="text-[11px] tracking-[0.2em] uppercase
                                                          text-botic-muted font-sans block mb-1.5">
                        Telèfon *
                      </label>
                      <input
                        id="telefon"
                        name="telefon"
                        type="tel"
                        required
                        value={form.telefon}
                        onChange={handleChange}
                        placeholder="+34 600 000 000"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="text-[11px] tracking-[0.2em] uppercase
                                                      text-botic-muted font-sans block mb-1.5">
                      Correu electrònic *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="joan@exemple.com"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="data" className="text-[11px] tracking-[0.2em] uppercase
                                                       text-botic-muted font-sans block mb-1.5">
                        Data preferida *
                      </label>
                      <input
                        id="data"
                        name="data"
                        type="date"
                        required
                        value={form.data}
                        onChange={handleChange}
                        className={`${inputClass} [color-scheme:dark]`}
                      />
                    </div>
                    <div>
                      <label htmlFor="persones" className="text-[11px] tracking-[0.2em] uppercase
                                                           text-botic-muted font-sans block mb-1.5">
                        Nombre de persones
                      </label>
                      <select
                        id="persones"
                        name="persones"
                        value={form.persones}
                        onChange={handleChange}
                        className={`${inputClass} [color-scheme:dark] cursor-pointer`}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'persona' : 'persones'}
                          </option>
                        ))}
                        <option value="9+">Grup (9+)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="missatge" className="text-[11px] tracking-[0.2em] uppercase
                                                         text-botic-muted font-sans block mb-1.5">
                      Missatge (opcional)
                    </label>
                    <textarea
                      id="missatge"
                      name="missatge"
                      rows={4}
                      value={form.missatge}
                      onChange={handleChange}
                      placeholder="Al·lèrgies, intoleràncies, celebracions especials..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-gold w-full text-center !py-4"
                  >
                    Enviar sol·licitud
                  </button>

                  <p className="text-xs text-botic-muted leading-relaxed">
                    La reserva es confirmarà per telèfon o correu en un termini de
                    24 hores. Consulteu la política d'anul·lació abans de reservar.
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-botic-ivory py-16 md:py-20">
        <div className="container-max text-center">
          <h2 className="font-serif font-light text-3xl md:text-4xl text-botic-text
                         tracking-tight mb-4">
            Us esperem a Corçà
          </h2>
          <p className="font-sans text-sm text-botic-text/60 max-w-md mx-auto leading-relaxed">
            Bo.TiC és a 15 minuts de Girona, al centre de l'Empordà.
            Un destí en si mateix.
          </p>
        </div>
      </section>
    </>
  )
}
