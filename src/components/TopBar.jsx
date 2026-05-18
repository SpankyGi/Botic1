export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <a href="mailto:restaurant@bo-tic.com">restaurant@bo-tic.com</a>
        <span className="lang-switch">Español</span>
      </div>
      <div className="topbar-right">
        <span className="award">
          <span className="award-icon">★★</span>Michelin
        </span>
        <span className="award">Guía Repsol</span>
        <span className="award">Premio Nacional</span>
        <span className="award">Premis G!</span>
      </div>
    </div>
  )
}
