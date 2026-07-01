# Bo.TiC · Gestió de Menús via Google Sheets

El client pot editar els menús directament des de Google Sheets. Els canvis apareixen a la web en un màxim de **10 minuts** (TTL de la memòria cau), sense cap deploy ni recompilació.

---

## Endpoint actual

```
https://script.google.com/macros/s/AKfycbxpz3KxrjMNR67wivgmb-NvxqmircFUacEKfdpBO9P6Bg12ya4Mj618zEVWfxZEejMWng/exec
```

Configurat a `public/config.json`. La web el llegeix en runtime — cap variable de compilació.

---

## 1. Com editar plats

1. Obre el Google Sheet del CMS
2. Ves a la pestanya **`plats`**
3. Edita les columnes `nom_ca`, `nom_es`, `nom_fr`, `nom_en`
4. Opcionalment edita `descripcio_ca`, etc.
5. Desa (Ctrl+S)
6. **Màxim 10 minuts per veure el canvi a la web**

---

## 2. Com activar o desactivar un plat

- Columna **`actiu`**: marca la casella ✓ per mostrar, desmarca per amagar
- El plat desapareix de la web sense eliminar la fila
- **Mai eliminis una fila** si pots simplement desactivar-la

---

## 3. Com canviar l'ordre dels plats

- Columna **`ordre`**: escriu el número de posició (1 = primer, 2 = segon…)
- Pots usar 10, 20, 30… per deixar marge per a plats futurs
- Els plats s'ordenen de menor a major

---

## 4. Com canviar el preu d'un menú

1. Ves a la pestanya **`menus`**
2. Edita la columna `preu` (exemple: `195`)
3. Desa

---

## 5. Com editar traduccions

Cada plat té camps per a cada idioma:
- `nom_ca` — Català *(obligatori)*
- `nom_es` — Castellà
- `nom_fr` — Francès
- `nom_en` — Anglès
- `descripcio_ca` / `descripcio_es` / `descripcio_fr` / `descripcio_en`

Si un camp de traducció és buit, la web usa el **català com a fallback**.

---

## 6. TTL de la memòria cau

La web guarda les dades durant **10 minuts** a `localStorage` (clau: `botic_menus_v1`).

- Nous visitants: veuen les dades actualitzades des de l'API
- Visitants amb caché activa: veuen el canvi quan expiri la caché (màxim 10 min)

---

## 7. Com forçar una prova immediata

**Opció 1 — Finestra d'incògnit:**
Obre la pàgina de menús en mode incògnit. No hi ha caché prèvia.

**Opció 2 — Consola del navegador (F12):**
```javascript
localStorage.removeItem('botic_menus_v1')
```
Recarrega la pàgina. La web farà fetch immediat de l'API.

**Opció 3 — Menú del CMS (al Google Sheet):**
Bo.TiC · Menús → Actualitzar versió (força que tots els visitants recarreguin)

---

## 8. Com actualitzar el codi de l'Apps Script mantenint la mateixa URL

> ⚠️ Important: si crees una **nova implementació** al Apps Script, la URL canvia.
> Has d'actualitzar `public/config.json` i fer deploy de la web.

Per actualitzar el codi **sense canviar la URL**:
1. Al editor d'Apps Script → **Desplegar → Gestionar implementacions**
2. Clic a l'engranatge (⚙️) de la implementació activa
3. Selecciona **Versió: Nova versió**
4. Clic a **Desplegar**

La URL acaba en `/exec` i roman igual. ✓

---

## 9. Com modificar config.json si canvia l'endpoint

Si crees una nova implementació (URL nova):

**Opció A — Directament a Hostinger (sense redeploy):**
1. Hostinger → File Manager → `public_html/config.json`
2. Substitueix la URL per la nova
3. Desa — el canvi és immediat

**Opció B — Via repositori (amb redeploy):**
1. Edita `public/config.json` al projecte local
2. `npm run build`
3. Desplega `dist/` a Hostinger

---

## 10. Estructura del Google Sheet

El document té **cinc pestanyes**:

### Pestanya `menus`

| id | ordre | preu | actiu | nom_ca | nom_es | nom_fr | nom_en |
|----|-------|------|-------|--------|--------|--------|--------|
| degustacio | 1 | 190 | CERT | Menú Degustació | Menú Degustación | Menu Dégustation | Tasting Menu |

### Pestanya `grups`

| id | menu_id | seccio_id | ordre | actiu | nom_ca | … |
|----|---------|-----------|-------|-------|--------|---|
| bar | degustacio | aperitius | 1 | CERT | Bar | … |

### Pestanya `plats`

| id | menu_id | grup_id | ordre | actiu | nom_ca | nom_es | … | allergens | suplement | actualitzat_el |
|----|---------|---------|-------|-------|--------|--------|---|-----------|-----------|----------------|
| deg-b1 | degustacio | bar | 1 | CERT | Musclo i escabetx | … | | | | 01/07/2026 |

### Pestanya `configuracio`

| clau | valor | descripcio |
|------|-------|-----------|
| versio | 1 | Número de versió (s'incrementa automàticament) |
| ultima_actualitzacio | 01/07/2026 00:00:00 | Data de l'última modificació |
| api_activa | CERT | CERT = API activa, FALS = usa fallback estàtic |
| temps_cache_minuts | 10 | TTL de la memòria cau del navegador |

---

## 11. Format de la resposta de l'API

L'endpoint retorna JSON compatible amb el frontend (claus en anglès):

```json
{
  "version": "1",
  "ultima_actualitzacio": "Wed Jul 01 2026 21:25:00 GMT+0200",
  "temps_cache_minuts": 10,
  "menus": [
    { "id": "degustacio", "order": 1, "price": "190 €", "active": true,
      "name_ca": "Menú Degustació", "name_es": "Menú Degustación",
      "name_fr": "Menu Dégustation", "name_en": "Tasting Menu" }
  ],
  "groups": [
    { "id": "bar", "menu_id": "degustacio", "seccio_id": "aperitius",
      "order": 1, "active": true,
      "name_ca": "Bar", "name_es": "Bar", "name_fr": "Bar", "name_en": "Bar" }
  ],
  "dishes": [
    { "id": "deg-b1", "menu_id": "degustacio", "group_id": "bar",
      "order": 1, "active": true,
      "name_ca": "Musclo i escabetx", "name_es": "Mejillón en escabeche",
      "name_fr": "Moule en escabèche", "name_en": "Pickled mussel",
      "description_ca": "", "description_es": "", "description_fr": "", "description_en": "",
      "allergens": "", "supplement": "" }
  ]
}
```

---

## 12. Fallback local

Si l'API no respon, la web usa `src/data/generated/menus.json` (inclòs al bundle).

Cadena de prioritat:
1. Memòria cau localStorage (si TTL vigent)
2. API de Google Sheets (si `config.json` conté URL vàlida)
3. Fallback estàtic JSON (sempre disponible al bundle)

L'usuari **mai** veu una pantalla buida.

---

## 13. Eines del menú "Bo.TiC · Menús" (al Google Sheet)

| Opció | Funció |
|-------|--------|
| ⚙️ Configurar CMS | Crea o reinicia totes les pestanyes |
| ✅ Validar dades | Comprova ids duplicats, camps buits, relacions |
| 🔄 Actualitzar versió | Incrementa `versio` manualment |
| 👁️ Previsualitzar JSON | Mostra el JSON que retorna l'API |
| 📋 Obrir instruccions | Navega a la pestanya d'instruccions |
| 🔍 Comprovar errors | Detecta problemes (ids, menu_id, grup_id) |
