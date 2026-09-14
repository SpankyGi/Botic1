# Revisió SEO prèvia al llançament — 14/09/2026

La web nova té una base tècnica correcta. Aquesta revisió correspon al codi de main i al resultat de la compilació local; no és una validació del nou web desplegat ni de la seva indexació real.

## Resultat verificat

- 40 pàgines HTML en català, castellà, anglès i francès: 36 pàgines principals i legals, més 4 de preferències de cookies.
- Un H1, una descripció i un canonical per pàgina; títols diferenciats dins de cada idioma, excepte preferències, que comparteix la política de cookies.
- Alternances hreflang dels quatre idiomes i x-default cap al català, amb destinacions existents.
- 28 URL indexables al sitemap. Avís legal i privacitat, encara incomplets, tenen noindex i queden fora del sitemap. Preferències també té noindex.
- Imatges amb atribut alt; les decoratives mantenen alt buit. Enllaços interns, imatges, variants mòbils i imatges socials comprovats contra els fitxers generats.
- JSON-LD de Restaurant i BreadcrumbList al mateix HTML de les pàgines Restaurant. FAQPage amb les nou preguntes al mateix HTML dels Menús; els textos s'actualitzen amb l'idioma. Això no garanteix resultats enriquits de FAQ a Google.
- Pàgina 404 amb noindex i sense canonical incorrecte cap a la portada. El codi HTTP 404 depèn de la configuració Apache que s'haurà de validar al servidor.
- Comprovació al navegador: adreça actualitzada, un sol esquema, canonical i metadades socials en canviar de català a anglès, FAQ en anglès i entrada al Restaurant sense preloader.

## Correccions aplicades

- Unificat el domini SEO a https://bo-tic.com, coherent amb la web actual, que redirigeix des de www. Actualitzats canonical, hreflang, sitemap, robots i imatges socials.
- Preparades redireccions 301 a .htaccess: www cap al domini sense www; /restaurant/ cap a /ca/restaurant/; /menus/ cap a /ca/menus/; /horari/ cap a /ca/reserves/. Es conserven les redireccions d'horaris dels quatre idiomes i la de l'arrel.
- Adreça confirmada pel titular de la tasca: Av. Costa Brava, 6. Actualitzada als quatre idiomes, peu, reserves, mapes i dades estructurades.
- Metadades Twitter i og:locale reactives a la navegació; robots restablert quan se surt d'una pàgina noindex.
- Generació de les quatre rutes de preferències, abans disponibles només amb navegació client.
- Corregits espais sense codificar a srcset que trencaven la interpretació d'algunes imatges mòbils.
- Preloader: eliminada l'espera d'un esdeveniment d'un vídeo inexistent. Ara espera la primera imatge, amb límit d'1,5 segons més la transició, i no bloqueja l'entrada directa a pàgines interiors. No s'ha mesurat una puntuació PageSpeed ni Core Web Vitals.

## Pendent de llançament

1. Completar raó social, NIF/CIF, domicili i altres dades requerides de l'avís legal, i el correu de privacitat. Després revisar el noindex i el sitemap; noindex no substitueix completar el contingut.
2. Acordar què passa amb /taula-del-xef/ i /videos/ de la web actual. No s'han redirigit a una pàgina sense contingut equivalent, ni s'ha recuperat Privé a main. Ampliar el mapa d'URL amb Search Console o un inventari/exportació de la web antiga, incloent PDF i altres enllaços antics que rebin trànsit.
3. Desplegar el contingut complet de dist, inclòs .htaccess. Verificar HTTPS, redireccions 301, barra final, resposta 200 de cada URL canònica, resposta 404 real d'una URL inexistent i absència de bloquejos del hosting. El servidor de previsualització Vite no executa .htaccess.
4. Protegir les previsualitzacions i la branca Privé de la indexació amb configuració específica del hosting; no s'ha modificat aquella branca ni el seu allotjament.
5. A Google Search Console: verificar la propietat, enviar /sitemap.xml, inspeccionar pàgines de cada idioma i seguir errors/404 i indexació. No s'ha accedit a Search Console en aquesta revisió.
6. Revisar Google Business Profile: adreça, telèfon, reserves i horaris especials de vacances, amb dates concretes de cada any. No s'ha modificat la fitxa.
7. Mesurar PageSpeed/Core Web Vitals en mòbil al domini definitiu, especialment portada amb galeria, fonts i pàgines amb vídeos. No hi ha dades reals de rendiment del nou desplegament encara.

## Com repetir la comprovació

Executar `npm run build` i després `node scripts/check-seo.mjs`. El comprovador inspecciona l'HTML generat i falla si troba metadades incoherents, destinacions inexistents, errors d'indexació o esquemes absents/malformats.

## Fonts consultades

- [Google: versions localitzades](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: dades d'establiments locals](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Web actual: domini i dades de contacte](https://bo-tic.com/)
- [Restaurant actual](https://bo-tic.com/restaurant/), [Menús](https://bo-tic.com/menus/), [Horaris](https://bo-tic.com/horari/) i [Taula del Xef](https://bo-tic.com/taula-del-xef/)
