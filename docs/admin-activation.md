# Administració de menús i avisos — 9 octubre 2026

Branca: proves/admin-menus-avisos. Integració a main autoritzada el 9 octubre 2026.

Estat final: accés i desament d'un avís confirmats per l'usuari. Comparació del Sheets viu amb el codi superada en CA/ES/FR/EN (textos i preus). Compilació de 48 pàgines superada. Es conserva officialMenus.js i el fallback complet. Avís actual amb inici buit i final 17/11/2026: visible immediatament. No es modifica Restoo ni Analytics. Les notes següents documenten els passos anteriors.

## Dades sincronitzades

Full original: https://docs.google.com/spreadsheets/d/1F8f8lUNO9OM9q1zBBodL0rhet0MdniHkUgKlrvrW5YY/edit

Còpia anterior: https://docs.google.com/spreadsheets/d/16a44Cfz4ziZupPMMgfZCOFYGnEXs4uUEcPPS_TKfSc0/edit

3 menús, 9 seccions, 34 grups i 146 línies, en CA/ES/FR/EN. Preus 190/250/90 €. Font: getOfficialMenus del codi vigent. No s'han inventat traduccions; les diferències de longitud entre idiomes es conserven. Avisos: cinc espais inactius. Versió del full: 11.

## Activació pendent

1. Actualització autoritzada i desada a Apps Script el 9 d'octubre. S'ha preservat el codi existent i afegit el backend d'administració i notices a la resposta GET. El desplegament existent no s'ha actualitzat.
2. Preservar el codi remot anterior (còpia local a output/admin/apps-script-original.gs). Afegir docs/bo-tic-admin.gs al projecte i afegir notices: adminReadNotices_() a la resposta pública. No executar configurar_cms_menus(): és un inicialitzador per a fulls buits.
3. El propietari estableix BOTIC_ADMIN_USER i BOTIC_ADMIN_PASSWORD a Propietats de l'script. Contrasenya única de 9 caràcters o més, mai al repositori. Sense aquestes propietats les operacions d'administració es rebutgen.
4. Desplegament de proves autoritzat i creat: versió 3, ID AKfycbz6igo-IJiS5kRolsVJDkb88tzaM5-kIJIknyN5eXuJnQfFMQhVtW3qoRcX2Hy58TXsQA. Les dues URLs del config de la branca apunten a aquesta versió (inclou avisos); el desplegament anterior i el config de producció es conserven. GET verificat: 3 menús, 9 seccions, 34 grups, 146 línies, cap avís actiu. POST read amb token invàlid rebutjat: «Accés pendent de configurar». Encara falta que el propietari revisi els noms exactes de les dues propietats i una contrasenya de mínim 9 caràcters. No s'han llegit les credencials. Després fer una edició reversible d'un avís inactiu, verificar desament i restaurar-lo; comprovar rebuig de token invàlid i conflicte de revisió.
5. Validar el panell amb l'usuari abans de publicar la branca. L'entrada serà /admin/, fora del sitemap i amb noindex. Noindex no substitueix autenticació: cada operació POST comprova sessió al servidor.

## Comprovacions locals

npm run build

node scripts/verify-cms.mjs

El panell edita files existents, visibilitat, ordre, preus i els quatre idiomes. Encara no afegeix/elimina files. El web usa una memòria cau de fins a deu minuts i un fallback complet; cal recarregar per obtenir canvis. No modifica productes ni reserves de Restoo.

## Recuperació

Abans de publicar, cap canvi del frontend afecta producció. Si falla una versió del servidor, tornar a la versió anterior del desplegament. Si cal recuperar dades, fer una còpia de l'estat actual i restaurar les pestanyes afectades des de la còpia anterior indicada; no reinicialitzar el full.

9 octubre: mínim reduït a 9 caràcters a petició de l’usuari. Versió 4 desplegada a la mateixa URL de proves. POST amb token invàlid retorna sessió caducada: les credencials configurades ja superen la validació inicial. Entrada amb credencials reals i desament encara pendents de validar.

