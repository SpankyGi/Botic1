export default function Footer() {
  return (
    <footer className="botic-footer">
      <div className="foot-grid">
        <div>
          <div className="foot-logo">Bo<span className="dot">.</span>TiC</div>
          <div className="foot-tag">Sentimiento y pasión, desde 2007</div>
        </div>

        <div className="foot-col">
          <h4>Visitar</h4>
          <p>Av. Costa Brava, 6</p>
          <p>17121 Corçà · Girona</p>
        </div>

        <div className="foot-col">
          <h4>Contacto</h4>
          <a href="mailto:restaurant@bo-tic.com">restaurant@bo-tic.com</a>
          <a href="tel:+34972630869">+34 972 63 08 69</a>
        </div>

        <div className="foot-col">
          <h4>Síguenos</h4>
          <a href="#" rel="noopener noreferrer">Instagram</a>
          <a href="#" rel="noopener noreferrer">Facebook</a>
        </div>
      </div>

      <div className="foot-bottom">
        <span>© Bo.TiC · Restaurante</span>
        <span>Aviso legal · Política de privacidad</span>
      </div>
    </footer>
  )
}
