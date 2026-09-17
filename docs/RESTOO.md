# Reserves amb Restoo

Actualització 17/09/2026: el widget nou s'ha desactivat després de reproduir «No està permès realitzar aquesta acció» en enviar dades personals autoritzades. No s'ha rebut confirmació de reserva. La causa del rebuig no està identificada.

La finestra pròpia es conserva, inclòs l'avís de taules de més de 6 persones per correu a restaurant@bo-tic.com. Ara carrega en un iframe el portal anterior https://bo-tic.myrestoo.net/{lang}/reservar, el mateix destí enllaçat per la web actual. Els enllaços generals continuen portant a la pàgina de reserves i els botons locals #reserva obren la finestra.

Idiomes: ca/es/en/fr. Enllaç alternatiu al portal en una pestanya nova si el navegador impedeix el funcionament incrustat. Les dades de reserva es tracten a Restoo. No es carrega Restoo.js ni es transmet consentiment o configuració d'analítica mitjançant la seva API nova; el portal anterior gestiona les seves pròpies preferències. No es dona per verificada cap conversió de reserva completada.

Cal validar l'enviament final del portal anterior dins del modal abans de considerar resolt el problema de reserves. No s'ha de confondre la càrrega del formulari amb una reserva confirmada.

Validació en Chrome (17/09/2026): portal anterior dins del modal local, 4 adults diumenge 20/09 a les 13:00, Menú del Xef Sala. Enviament de dades expressament autoritzat: supera el pas que fallava a v2 i arriba a la garantia de cancel·lació de Stripe (400 euros). No s'ha confirmat ni garantit la reserva: pas financer deixat al titular. Compilació correcta (48 rutes).
