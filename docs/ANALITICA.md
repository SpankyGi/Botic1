# Activació de l’analítica del Bo.TiC

Estat: codi preparat, mesurament desactivat. GA4 verificat al compte: Bo.TiC / bo-tic.com, propietat 521273336, flux web 13351810979, ID G-MNGEY9EKP7. Falta crear/configurar el contenidor GTM i validar amb Tag Assistant i GA4 DebugView. El compte de Google obert no tenia comptes GTM accessibles el 14/09/2026. No hi ha una reserva completada mesurada: MyRestoo requereix una integració pròpia.

## Configuració de compilació
Crear `.env.local` o variables del procés de compilació:

```
VITE_ANALYTICS_ENABLED=true
VITE_GTM_ID=identificador real GTM
```

Tornar a compilar. Les variables Vite són públiques i queden incorporades a la compilació. Sense identificadors vàlids no es carrega cap servei. Localhost i dominis de proves estan exclosos llevat de `VITE_ANALYTICS_DEBUG=true` explícit per a validació. Retirar aquest indicador abans de publicar.

Si hi ha GTM, NO s’injecta GA4 directament encara que hi hagi VITE_GA4_ID. Si s’opta per GA4 directe, ometre GTM i configurar VITE_GA4_ID. Es desactiva el page_view automàtic al config.

## Configurar el contenidor GTM
1. Crear una etiqueta Google amb l’ID GA4 real, `send_page_view=false`. Activar-la en l’esdeveniment personalitzat `botic_page_view`, una vegada per pàgina. Exigir `analytics_storage` concedit i variable de capa de dades `botic_analytics` igual a true.
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
