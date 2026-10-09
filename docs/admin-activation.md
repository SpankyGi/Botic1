# Administració de menús i avisos — 9 octubre 2026

Branca: proves/admin-menus-avisos. No publicada a main.

## Dades sincronitzades

Full original: https://docs.google.com/spreadsheets/d/1F8f8lUNO9OM9q1zBBodL0rhet0MdniHkUgKlrvrW5YY/edit

Còpia anterior: https://docs.google.com/spreadsheets/d/16a44Cfz4ziZupPMMgfZCOFYGnEXs4uUEcPPS_TKfSc0/edit

3 menús, 9 seccions, 34 grups i 146 línies, en CA/ES/FR/EN. Preus 190/250/90 €. Font: getOfficialMenus del codi vigent. No s'han inventat traduccions; les diferències de longitud entre idiomes es conserven. Avisos: cinc espais inactius. Versió del full: 11.

## Activació pendent

1. Aprovar l'actualització de l'Apps Script existent. La revisió automàtica ha bloquejat el desament; el servidor remot no s'ha modificat.
2. Preservar el codi remot anterior (còpia local a output/admin/apps-script-original.gs). Afegir docs/bo-tic-admin.gs al projecte i afegir notices: adminReadNotices_() a la resposta pública. No executar configurar_cms_menus(): és un inicialitzador per a fulls buits.
3. El propietari estableix BOTIC_ADMIN_USER i BOTIC_ADMIN_PASSWORD a Propietats de l'script. Contrasenya única de 20 caràcters o més, mai al repositori. Sense aquestes propietats les operacions d'administració es rebutgen.
4. Desplegar una versió de proves i configurar adminApiUrl a public/config.json amb l'URL /exec. Preservar menusApiUrl. Fer una edició reversible d'un avís inactiu, verificar desament i restaurar-lo; comprovar rebuig de token invàlid i conflicte de revisió.
5. Validar el panell amb l'usuari abans de publicar la branca. L'entrada serà /admin/, fora del sitemap i amb noindex. Noindex no substitueix autenticació: cada operació POST comprova sessió al servidor.

## Comprovacions locals

npm run build

node scripts/verify-cms.mjs

El panell edita files existents, visibilitat, ordre, preus i els quatre idiomes. Encara no afegeix/elimina files. El web usa una memòria cau de fins a deu minuts i un fallback complet; cal recarregar per obtenir canvis. No modifica productes ni reserves de Restoo.

## Recuperació

Abans de publicar, cap canvi del frontend afecta producció. Si falla una versió del servidor, tornar a la versió anterior del desplegament. Si cal recuperar dades, fer una còpia de l'estat actual i restaurar les pestanyes afectades des de la còpia anterior indicada; no reinicialitzar el full.
