# Branques i llançament de Bo.TiC

Separació acordada el 14 de setembre de 2026.

- `main`: web del restaurant sense Bo.TiC Privé. Base de les correccions per al llançament.
- `proves/botic-prive`: versió completa amb les tres pàgines de Privé i la seva navegació. Conserva el commit `078939a`.

El commit `dd8a13d` retira de `main` la incorporació de Privé mitjançant una reversió. No s'ha reescrit l'historial ni s'ha perdut el treball original.

## Treball posterior

Fer els ajustos del restaurant a `main`. Traslladar a la branca de proves només els commits compartits que calguin. No fusionar tota la principal a proves sense revisar la reversió de Privé.

Per integrar Privé en el futur, preparar una branca d'integració des de `main`, revertir `dd8a13d` i incorporar els ajustos posteriors de proves. Una fusió de la branca original per si sola no recupera els canvis revertits.

Una branca de GitHub no és una web de proves publicada. La previsualització de Privé s'ha de configurar separadament i mantenir protegida d'accés o indexació abans de compartir-la. El domini públic del restaurant ha de rebre únicament la compilació de `main`.

## Verificació de la separació

- Compilació de client i servidor correcta amb `npm run build`.
- 36 pàgines estàtiques generades: 9 per idioma, en català, castellà, anglès i francès.
- Sense rutes, enllaços, components ni estils de Bo.TiC Privé al resultat de la compilació ni al sitemap.
- Portada, menú, accés a reserves i canvi de català a anglès comprovats al navegador local.
- La frase francesa «parking privé» és informació d'aparcament; no pertany a Bo.TiC Privé.

## Pendents abans del llançament

- **Reserves:** `ReservationForm` a `src/pages/Reserves.jsx` només executa `setSent(true)`. Cal connectar el sistema real de reserves o substituir el formulari per l'accés al sistema existent abans de publicar.
- Revisar capçalera, navegació i composició en mòbil i escriptori.
- Verificar continguts i dades dels menús amb el CMS real.
- Comprovar el flux de cookies, les pàgines legals, les redireccions i les reserves a l'allotjament final.
- Confirmar domini i destinació de Hostinger, preparar còpia de seguretat i publicar una compilació nova de `main`.

La configuració del projecte inclou `public/.htaccess` per a Hostinger. La comprovació local amb Vite no valida aquestes regles d'Apache. No s'ha fet cap desplegament ni canvi de DNS en aquesta separació.
