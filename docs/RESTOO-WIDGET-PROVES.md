# Prova del widget Restoo — 26/09/2026

Branca: `proves/restoo-widget-conversions`. No publicada a main.

## Canvi

El formulari de reserves utilitza el carregador oficial `/js/restoo-widget`, dins del modal existent. L'idioma prové de la pàgina. Els xecs regal mantenen el seu comportament actual.

El consentiment d'analítica del web es transmet al widget. En qualsevol domini diferent de bo-tic.com o www.bo-tic.com, el connector GA4 del widget queda desactivat. El desplegable de diagnòstic mostra només noms d'esdeveniments; no mostra dades personals.

## Evidència

- Build Vite i prerender de 48 rutes correctes.
- Chrome, pàgina local en català: modal carrega el formulari nou.
- Selecció de 2 adults, 27/09 i dinar arriba a les experiències disponibles, sense introduir dades personals ni enviar cap reserva.
- Rebuts `restoo:widget_mounted`, `restoo:booking_start_viewed`, `restoo:page_viewed`, `restoo:booking_start_submitted` i `restoo:booking_item_list_viewed`.
- Tancar i reobrir el modal torna a carregar el formulari.
- El navegador integrat no ha pogut accedir al servidor local; verificació feta amb Chrome.

## Fonts oficials inspeccionades

- https://bo-tic.myrestoo.net/js/restoo-widget
- https://cdn.myrestoo.net/js/tracking/v1/restooConnect.js
- https://app.myrestoo.net/api/public/v1/widget/setup?account=bo-tic

La configuració pública retorna GA4 G-MNGEY9EKP7 amb publicitat desactivada. El connector associa `booking_created` amb estat CONFIRMED a `qualify_lead`, i REQUESTED / PENDING_WAIT_LIST_BOOKING a `generate_lead`. Un estat CONFIRMED a l'URL de disponibilitat **no** demostra una reserva creada.

## Pendents abans de publicar

- Validació visual en mòbil i dels altres idiomes.
- Reserva controlada completa i recepció real de `qualify_lead` a GA4, amb consentiment, en un entorn de validació adequat. La prova local no envia aquests esdeveniments a GA4.
- Revisar atribució, absència de duplicats i marcar l'esdeveniment confirmat com a esdeveniment clau. No s'ha modificat GA4 ni el panell de Restoo.
- Revisar l'estat `restoo_widgets` que Restoo afegeix a l'URL durant el recorregut: en reobrir es genera una instància nova i comença de nou.
- Aprovació abans de fusionar amb main.
