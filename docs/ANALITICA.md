# Activació de l’analítica del Bo.TiC

Estat 14/09/2026: GTM `GTM-TLXRXFPC` creat i versió 2 «BoTiC - GA4 amb consentiment» publicada (7 etiquetes, 6 activadors, 6 variables). GA4 existent: Bo.TiC / bo-tic.com, propietat 521273336, flux 13351810979, ID `G-MNGEY9EKP7`. La nova web està configurada per activar-lo exclusivament a bo-tic.com i www.bo-tic.com amb consentiment. No s’ha desplegat la nova web al domini.

Validació: proves automatitzades de consentiment i deduplicació, build i auditoria SEO correctes. Prova controlada al navegador contra el contenidor publicat: cap petició inicial; després d’acceptar, una page_view inicial, una per nova ruta malgrat repetir-la i gift_click amb destination=myrestoo. En rebutjar, no es genera un segon clic. Les peticions /g/collect s’han observat cap a G-MNGEY9EKP7. Les proves han produït unes poques dades identificables com /analytics-check/ i títol «BoTiC Analytics verification»; excloure-les dels informes. No s’ha verificat DebugView ni la recepció final en informes. La previsualització normal continua exclosa, també després d’acceptar cookies.

GA4: desactivades les visites automàtiques per historial i les interaccions automàtiques amb formularis; es mantenen les altres opcions de mesurament millorada existents. No hi ha reserva completada mesurada: MyRestoo requereix una integració pròpia. En publicar la nova web cal repetir la comprovació al domini real amb Tag Assistant i Temps real / DebugView.

## Configuració de compilació
El fitxer versionat `.env.production` conté els identificadors públics. Les variables del procés o `.env.local` els poden sobreescriure:

```
VITE_ANALYTICS_ENABLED=true
VITE_GTM_ID=GTM-TLXRXFPC
```

Tornar a compilar. Les variables Vite són públiques i queden incorporades a la compilació. Sense identificadors vàlids no es carrega cap servei. Localhost i dominis de proves estan exclosos llevat de `VITE_ANALYTICS_DEBUG=true` explícit per a validació. Retirar aquest indicador abans de publicar.

Si hi ha GTM, NO s’injecta GA4 directament encara que hi hagi VITE_GA4_ID. Si s’opta per GA4 directe, ometre GTM i configurar VITE_GA4_ID. Es desactiva el page_view automàtic al config.

## Configuració del contenidor GTM (còpia importable: gtm-botic.json)
1. Crear una etiqueta Google amb l’ID GA4 real, `send_page_view=false`. Executar-la com a etiqueta de configuració seqüenciada abans de cada etiqueta GA4, una vegada per càrrega de pàgina, amb `analytics_storage` concedit. Els activadors de les etiquetes GA4 exigeixen també `botic_analytics=true`.
2. Crear variables de capa de dades: page_location, page_path, page_referrer, language, destination, botic_analytics, botic_marketing.
3. Crear etiquetes GA4 d’esdeveniment amb aquests mapatges exactes:

| Esdeveniment de la capa de dades | Nom enviat a GA4 |
| --- | --- |
| botic_page_view | page_view |
| botic_reservation_click | reservation_click |
| botic_gift_click | gift_click |
| botic_phone_click | phone_click |
| botic_email_click | email_click |
| botic_directions_click | directions_click |

Configurar els activadors personalitzats exactes, analytics_storage concedit i botic_analytics=true. Associar la configuració Google i garantir que s’executa abans de la primera etiqueta d’esdeveniment (seqüenciació). Mapar page_location, page_path, page_referrer i language només a page_view; page_path i destination als clics. No enviar altres variables ni text dels formularis.
4. A GA4, desactivar la detecció automàtica de canvis de pàgina basats en l’historial del navegador: el web ja envia una sola visita per canvi de ruta. Desactivar el seguiment automàtic de formularis, que no representa reserves confirmades. Evitar activadors All Pages o History Change addicionals per a visites.
5. Les etiquetes Clarity i Meta es gestionen exclusivament dins de GTM. No estan configurades pel codi del web. Exigir analytics_storage i botic_analytics per a Clarity; ad_storage, ad_user_data, ad_personalization i botic_marketing per a Meta. Fer servir les plantilles oficials/adients i revisar-ne els controls de consentiment abans de publicar. No activar etiquetes de tercers incondicionalment.
6. Marcar com a esdeveniments clau només els clics que es vulguin tractar com a objectius. Mai anomenar un clic “reserva completada”.

## Consentiment i dades
Consentiment denegat per defecte abans de carregar tags. El contenidor només es carrega si s’accepta alguna categoria opcional. Les visites i clics del web només es generen amb analítica acceptada. En retirar permisos, es guarden les preferències, s’actualitzen els senyals, s’eliminen les cookies conegudes accessibles des del domini i es recarrega la pàgina per aturar els scripts ja carregats. Cal configurar cada etiqueta del contenidor perquè respecti els permisos; el web no pot controlar un contenidor mal configurat.

No s’envien noms, correus, telèfons, missatges ni contingut dels formularis. Les visites utilitzen rutes sense query ni fragment. Els clics envien categories fixes, no URL completes ni números de telèfon. La primera visita omet el referrer extern; cal revisar atribució de campanyes quan es configurin els comptes.

## Validació abans d’activar en producció
- `node scripts/check-analytics.mjs` i `npm run build`.
- Tag Assistant en entorn autoritzat: abans de consentir i en rebutjar, cap script Google.
- Acceptar només analítica: una visita inicial, una per navegació, un esdeveniment per clic; cap etiqueta de màrqueting.
- Acceptar només màrqueting: cap visita ni esdeveniment analític.
- Retirar permisos: recàrrega, cookies conegudes retirades i absència de nous esdeveniments de la categoria rebutjada.
- Repetir acceptar/rebutjar, canvi d’idioma, enrere/endavant i càrrega directa. Confirmar dades a GA4 DebugView amb els comptes reals.
- Completar les polítiques amb els proveïdors finalment activats i les dades del titular.

Referències: https://developers.google.com/tag-platform/security/guides/consent i https://support.google.com/tagmanager/answer/10000067
