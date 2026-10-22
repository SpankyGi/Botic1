# Revisió de dependències — 22/10/2026

Branca: `fix/security-dependencies-october`, preparada inicialment sobre `e110987`
i rebasada sobre el main publicat `750f0cd` abans de publicar, amb autorització
de l'usuari. Cap canvi a les dades de Restoo o Sheets.

## Canvis

- React Router DOM 7.18.4; adaptació de la importació de StaticRouter per al prerender.
- Vite 6.4.5, plugin React 4.7.0 i PostCSS 8.5.31.
- Lockfile actualitzat, incloent Babel 7.29.7, Browserslist 4.29.4,
  source-map-js 1.2.2, nanoid 3.3.20 i baseline-browser-mapping 2.11.31.
- Override de postcss-selector-parser 7.1.7 per corregir la dependència de
  Tailwind 3 i postcss-nested sense migrar el sistema de disseny a Tailwind 4.
- Les dades de menús, preus, traduccions, configuració CMS i codi de reserves
  no s'han modificat.

React Router 7 requereix Node >=20. Proves locals amb Node 24.15.0.
Node 22 confirmat a Hostinger abans de publicar (buildSettings i logs).
Després del rebase passen de nou build, CMS, analítica, SEO, migració,
launch audit i check-performance; menús i obertura Restoo revalidats en navegador.
Versió de retorn anterior: `750f0cd754fcd45c659cf86b2f4272fbba64add4`.

## Validació realitzada

- `npm run build`: correcte, 48 rutes prerenderitzades.
- `node scripts/verify-cms.mjs`: dades de reserva locals dels menús coincidents
  amb els menús oficials en quatre idiomes; límits de dates dels avisos;
  sintaxi de l'administrador i noindex correctes.
- `node scripts/check-analytics.mjs`: consentiment, navegació SPA i atribució.
- `node scripts/check-seo.mjs`, `check-launch-audit.mjs` i
  `check-migration.mjs`: correctes. La prova de migració és local, no una
  comprovació dels redirects del servidor públic.
- Comparació abans/després dels 55 HTML generats: idèntics després d'excloure
  els noms hash dels assets i l'atribut `data-discover` afegit pel router.
- Navegador local: selecció dels tres menús i desplegament de plats; preus
  190/250/90 EUR; navegació CA/ES/EN/FR; acordions mòbils a 390x844.
- El navegador carrega contingut actual del CMS, incloent els plats de tardor
  d'Essència, i l'avís de vacances. No s'ha sobreescrit el CMS amb el fallback.
- Finestra de reserves: obertura/tancament, formulari real Restoo i calendari
  visibles en català/escriptori i francès/mòbil. Cap formulari enviat, cap
  reserva creada, cap cobrament provat. Això verifica l'accés al motor, no
  una transacció completa de reserva.
- Administrador: pantalla d'accés carregada sense errors de consola. No s'ha
  iniciat sessió ni provat un desament en producció.
- Cap error de consola capturat en les comprovacions de navegador.
- `git diff --check`: correcte.

## Auditoria i risc residual

`npm audit --omit=dev`: 0 vulnerabilitats conegudes a les dependències de producció.
No és una garantia d'absència de qualsevol vulnerabilitat de l'aplicació.

L'auditoria completa retorna cinc dependències marcades com a high:
braces, chokidar, micromatch, fast-glob i tailwindcss. Deriven d'un únic
avís, GHSA-vfj7-8cjw-p6xm (esgotament de pila amb patrons profundament niats).
La versió publicada més recent de braces consultada és 3.0.3 i continua afectada.
S'utilitzen a la compilació; no s'ha identificat cap entrada de patrons del
visitant cap a aquestes eines. No s'han fet proves d'explotació sobre producció.
Cal mantenir controlades les fonts/patrons de compilació i revisar quan hi hagi
una correcció compatible. No s'ha executat `npm audit fix --force`, que proposa
una migració major de Tailwind amb més abast i risc de regressions visuals.

L'escaneig de Hostinger continua referint-se a la versió publicada; no baixarà
pel fet d'haver corregit aquesta branca local. Després d'una futura publicació
autoritzada caldrà tornar a comprovar-lo.

Referències:
- https://github.com/remix-run/react-router/security/advisories/GHSA-wrjc-x8rr-h8h6
- https://github.com/vitejs/vite/security/advisories/GHSA-rq7h-c2jc-7f22
- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
