# Actualització executada — 21/09/2026

Aquest apartat substitueix els pendents històrics que es detallen més avall quan hi ha discrepància.

- Autoritzada la retirada de la botiga antiga: 4 URL de botiga redirigeixen amb 301 a Restoo en l’idioma corresponent; 14 URL de comptes, compra, cistella i devolucions retornen 410. Cap dada de WordPress s’ha esborrat. El mapa JSON és la font actual.
- 23 imatges originals recuperades, convertides a WebP i preservades amb redireccions exactes. Només queda fora el placeholder del connector d’Instagram. Mapa: migration-image-map.json.
- Search Console i GA4 vinculats correctament el 21/09: propietat https://bo-tic.com/, flux 13351810979.
- Atribució: conservats els paràmetres de campanya permesos i la procedència inicial; exclosos paràmetres arbitraris i fragments. Proves de consentiment i navegació SPA superades.
- 19 imatges existents optimitzades: de 6500,8 a 5146,2 KiB, aproximadament un 21% menys. Comparacions visuals revisades. Les 6 variants mòbils revisades queden sota 150 KiB; algunes fotografies grans d’escriptori mantenen 360–454 KiB per preservar detall.
- Pendents que depenen del domini: certificat, host canònic, resposta robots efectiva, sitemap a Search Console, preservació de verificació, prova Analytics/Tag Assistant en producció i conversions completades de Restoo.
- Encara cal contrastar URL òrfenes amb exportacions històriques de Search Console. La migració no garanteix absència de fluctuacions de posicionament.

---

# Migració SEO de bo-tic.com — 17/09/2026

## Abast i límits

Rastreig públic de 56 URL: navegació, quatre idiomes, sitemap de WordPress, alternatives d’idioma, enllaços de peu, PDF i pàgines comercials descobertes. Comprovats 24 enllaços externs i l’URL de sitemap `/?page_id=65`. No hi ha accés a Search Console, analítica històrica, registre del servidor ni exportació de backlinks: aquest inventari no garanteix descobrir URL òrfenes ni conservar una posició concreta a Google.

El mapa complet és `migration-url-map.json`. Estat `DECISION_REQUIRED` vol dir que la migració d’aquella URL no està resolta; no es redirigeix enganyosament a la portada.

## Corregit i preparat

- Conservades les URL castellanes, angleses i franceses de Restaurant, Menús, Taula del Xef, Vídeos i Identitat.
- Redireccions permanents de les URL catalanes sense prefix a les noves URL /ca/.
- Horaris de tots els idiomes dirigits a la pàgina de reserves corresponent, incloent /en/opening-hours/.
- Recuperades pàgines de Taula del Xef, vídeos (nou enllaços de reproducció localitzats) i identitat en quatre idiomes. Enllaços al peu i equivalents d’idioma.
- Taula del Xef conserva la descripció del servei, capacitat publicada i enllaç al menú actual; no duplica un menú antic que podria quedar desactualitzat.
- Tres PDF públics conservats amb les mateixes adreces i bytes originals.
- Sitemaps antics redirigits a /sitemap.xml. Eliminat el fallback genèric amb resposta 200 de `_redirects`, que amagava pàgines inexistents.
- Canonicals, hreflang, HTML prerenderitzat, H1, metadades, enllaços i recursos verificats per les proves SEO.
- Corregits Instagram i Facebook perquè coincideixin amb els de la web actual.
- Regala ara obre MyRestoo en l’idioma seleccionat.
- Formulari de reserves simulat retirat: mostrava confirmació sense enviar dades. Substituït per l’enllaç de reserva MyRestoo existent i verificat. La integració del widget continua pendent.
- Imatge social estàtica de Restaurant corregida perquè coincideixi amb la nova portada nocturna.

## Abans de canviar el domini

1. **Botiga i comptes antics:** el rastreig troba botigues buides, cistelles, comptes i recuperació de contrasenya. Confirmar amb l’antic gestor si hi ha comandes, usuaris o obligacions de servei. Decidir redirecció de botiga a MyRestoo i tractament dels comptes; preservar/exportar dades abans de retirar WordPress. No s’ha modificat ni consultat cap dada privada.
2. **Devolucions:** /reemborsaments_devolucions/ publica la plantilla anglesa de WooCommerce amb camps de mostra. Cal política real validada pel titular; no copiar la plantilla.
3. **Històric SEO:** exportar de Search Console les pàgines amb impressions/clics, enllaços externs i URL indexades; completar el mapa amb qualsevol URL no enllaçada que aparegui. No emprar l’eina de canvi d’adreça si es manté bo-tic.com.
4. **Fitxers antics:** demanar còpia íntegra de WordPress, especialment wp-content/uploads i altres directoris públics. Els tres PDF ja es conserven, però no s’han migrat totes les URL històriques d’imatges: les URL d’imatges que tinguin trànsit o backlinks han de continuar servint-se o tenir una equivalència comprovada.
5. **Allotjament:** confirmar que Hostinger aplica .htaccess i conserva aquests fitxers durant el desplegament. Vite preview no executa regles Apache: les proves locals comproven sintaxi/mapeig/destinacions, però els 301/404 s’han de comprovar per HTTP a l’allotjament final.
6. **Domini i correu:** mantenir bo-tic.com, certificat HTTPS i registres de correu; no cancel·lar l’allotjament antic abans de comprovar el nou. Revisar www/HTTPS i evitar cadenes de redirecció.
7. **Entorn de proves:** protegir el subdomini de proves contra indexació amb autenticació o X-Robots-Tag: noindex específic del host. No copiar un bloqueig global al domini de producció.
8. Després de publicar: enviar /sitemap.xml a Search Console, comprovar URL antigues, reserves/regals i 404 reals; observar cobertura, clics i errors els dies i setmanes següents. No es pot prometre absència de fluctuacions de posicionament.

## Incidències externes i antigues

- Notícia de Fòrum Girona / Professionals de Sala: 404 a la web antiga. Cal demanar l’enllaç nou o mantenir la menció sense enllaç.
- Guia Repsol: 403 per al comprovador automatitzat; això no prova que sigui un enllaç trencat per a una persona.
- Guia Michelin: 202; resposta acceptada, no prova de càrrega visual completa.
- /?page_id=65: 404 actual malgrat aparèixer al sitemap antic; no s’ha inventat una equivalència.
- Les vuit destinacions MyRestoo (reserva i regal, quatre idiomes) responen 200. No s’ha fet cap reserva de prova ni cap compra.

## Resultat per URL

| URL antiga | Destinació | Tractament |
| --- | --- | --- |
| / | /ca/ | 301 |
| /en/ | /en/ | 200 |
| /es/ | /es/ | 200 |
| /fr/ | /fr/ | 200 |
| /en/chefs-table/ | /en/chefs-table/ | 200 |
| /en/menus/ | /en/menus/ | 200 |
| /en/opening-hours/ | /en/reservations/ | 301 |
| /en/restaurant/ | /en/restaurant/ | 200 |
| /en/videos/ | /en/videos/ | 200 |
| /es/horarios/ | /es/reservas/ | 301 |
| /es/menus/ | /es/menus/ | 200 |
| /es/mesa-del-chef/ | /es/mesa-del-chef/ | 200 |
| /es/restaurante/ | /es/restaurante/ | 200 |
| /es/videos/ | /es/videos/ | 200 |
| /fr/horaires/ | /fr/reservations/ | 301 |
| /fr/la-table-du-chef/ | /fr/la-table-du-chef/ | 200 |
| /fr/menus/ | /fr/menus/ | 200 |
| /fr/restaurant/ | /fr/restaurant/ | 200 |
| /fr/videos/ | /fr/videos/ | 200 |
| /horari/ | /ca/reserves/ | 301 |
| /menus/ | /ca/menus/ | 301 |
| /restaurant/ | /ca/restaurant/ | 301 |
| /taula-del-xef | /ca/taula-del-xef/ | 301 |
| /taula-del-xef/ | /ca/taula-del-xef/ | 301 |
| /videos/ | /ca/videos/ | 301 |
| /botiga/ | Pendent de decisió | DECISION_REQUIRED |
| /cistella/ | Pendent de decisió | DECISION_REQUIRED |
| /el-meu-compte/ | Pendent de decisió | DECISION_REQUIRED |
| /finalitza-la-compra/ | Pendent de decisió | DECISION_REQUIRED |
| /identitat/ | /ca/identitat/ | 301 |
| /reemborsaments_devolucions/ | Pendent de decisió | DECISION_REQUIRED |
| /el-meu-compte/lost-password/ | Pendent de decisió | DECISION_REQUIRED |
| /en/cart/ | Pendent de decisió | DECISION_REQUIRED |
| /en/identity/ | /en/identity/ | 200 |
| /en/my-account/ | Pendent de decisió | DECISION_REQUIRED |
| /en/shop/ | Pendent de decisió | DECISION_REQUIRED |
| /es/carrito/ | Pendent de decisió | DECISION_REQUIRED |
| /es/identidad/ | /es/identidad/ | 200 |
| /es/mi-cuenta/ | Pendent de decisió | DECISION_REQUIRED |
| /es/tienda/ | Pendent de decisió | DECISION_REQUIRED |
| /fr/boutique/ | Pendent de decisió | DECISION_REQUIRED |
| /fr/identite/ | /fr/identite/ | 200 |
| /fr/mon-compte/ | Pendent de decisió | DECISION_REQUIRED |
| /fr/panier/ | Pendent de decisió | DECISION_REQUIRED |
| /pdf/BrandBook_Bo.TiC.pdf | /pdf/BrandBook_Bo.TiC.pdf | 200 |
| /pdf/logo_Bo.TiC_Baseline.pdf | /pdf/logo_Bo.TiC_Baseline.pdf | 200 |
| /pdf/logo_Bo.TiC_Curt.pdf | /pdf/logo_Bo.TiC_Curt.pdf | 200 |
| /en/my-account/lost-password/ | Pendent de decisió | DECISION_REQUIRED |
| /es/mi-cuenta/lost-password/ | Pendent de decisió | DECISION_REQUIRED |
| /fr/mon-compte/lost-password/ | Pendent de decisió | DECISION_REQUIRED |
