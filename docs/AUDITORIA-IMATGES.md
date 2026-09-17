# Auditoria d’imatges — 17/09/2026

- Revisades 135 imatges WebP, incloses variants mòbils i imatges transparents.
- Cap imatge PNG/JPG/GIF/AVIF a `public`.
- Logotips vectorials i favicon conservats en SVG; vídeos en WebM.
- Pes total dels recursos d’imatge: 23.61 MB → 15.39 MB. És el total del catàleg, no la càrrega d’una sola pàgina.
- Retrats transparents d’Albert i Cristina convertits a WebP amb variants mòbils de 480 px i selecció responsive.
- Fotografies pesants reduïdes sense canviar l’enquadrament. Les fotografies nocturnes i d’interiors mantenen més pes per preservar-ne el detall.
- Originals preservats localment fora del directori publicat, a `output/image-audit-originals` de l’espai de treball.
- Validació: descodificació de tots els WebP, transparència dels retrats i existència de referències literals.
- Corregida una referència mòbil inexistent al component PhilosophyStrip.

## Fitxers modificats

| Fitxer | Abans (KB) | Després (KB) |
| --- | ---: | ---: |
| images/albert-sastregener-editorial-transparent.png | 1576.8 | 80.2 |
| images/botic-hero-symbol-dark.png | 12.4 | 5.0 |
| images/botic-hero-symbol-light.png | 8.8 | 3.8 |
| images/botic-logo-original.png | 18.1 | 5.6 |
| images/cristina-albert-botic-emporda-michelin.webp | 1895.4 | 332.7 |
| images/cristina-editorial-transparent-v2.png | 1957.1 | 158.3 |
| images/michelin-star-original.png | 197.4 | 29.8 |
| images/plat-cenital-botic.jpg | 303.2 | 160.2 |
| images/restaurant-botic-corca-emporda-facana-nit.webp | 829.3 | 606.6 |
| images/restaurant-botic-corca-emporda-interior-mobile.webp | 193.9 | 171.1 |
| images/restaurant-botic-corca-emporda-interior.webp | 496.4 | 364.5 |
| images/restaurant-botic-corca-emporda-sala-gastronomica-mobile.webp | 215.2 | 165.8 |
| images/restaurant-botic-corca-emporda-sala-gastronomica.webp | 487.4 | 369.7 |
| images/restaurant-botic-emporda-hero.webp | 1032.6 | 577.5 |
| images/restaurant-sala-arcs-emporda-mobile.webp | 216.6 | 165.2 |
| images/restaurant-sala-arcs-emporda.webp | 966.2 | 529.4 |
| images/restaurant-taula-xef-emporda-mobile.webp | 222.2 | 175.3 |
| images/restaurant-taula-xef-emporda.webp | 1154.7 | 636.6 |
| images/navigation/experiencia.webp | 968.4 | 453.4 |
| images/navigation/inici.webp | 780.3 | 392.5 |
