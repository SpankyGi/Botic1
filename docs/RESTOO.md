# Reserves integrades amb Restoo

Integració del 17/09/2026 segons https://restoo.mintlify.app/es/widget/migration-embedded-install i les pàgines advanced-installation i consent.

- Compte: `bo-tic`. Càrrega del mòdul oficial `https://bo-tic.myrestoo.net/js/restoo-widget` només a la pàgina de reserves.
- Formulari INLINE, idioma ca/es/en/fr segons la pàgina. Instància estable `botic-reservations` per conservar els enllaços profunds de Restoo.
- Es neteja el contenidor en sortir de la ruta; Restoo elimina les instàncies desconnectades en tornar a muntar. No s'utilitzen mètodes de destrucció no documentats.
- Enllaç alternatiu al portal allotjat sempre disponible, també sense JavaScript. Les dades i els pagaments es gestionen al formulari de Restoo, no al servidor del web.
- Es respecta la decisió d'analítica del banner i els seus canvis. Publicitat i record opcional del client desactivats; seguretat activa. Cap acceptació d'analítica és necessària per reservar.
- GA4/GTM de Restoo desactivats fora de bo-tic.com/www.bo-tic.com. En producció es conserven les destinacions configurades al compte de Restoo: encara cal verificar-les amb el titular abans de donar per mesurades les reserves completades.
- No s'ha creat cap reserva real ni s'han introduït dades personals durant les proves.

Validació: compilació i comprovacions SEO/migració/analítica; formulari real en Chrome en català a escriptori i castellà a 390 px, consulta de data i servei, navegació a Restaurant i retorn. El navegador integrat de Codex deixava els iframes externs en blanc; Chrome carregava correctament el calendari. La confirmació final i el pagament no s'han provat.

Els textos legals continuen pendents de les dades del titular; s'ha corregit la descripció tècnica de cookies perquè reflecteixi el formulari incrustat i les eines realment activades.
