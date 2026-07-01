# Bo.TiC · Gestió de Menús via Google Sheets

El client pot editar els menús directament des de Google Sheets. Els canvis apareixen a la web en un màxim de **10 minuts** (TTL de la caché), sense cap deploy ni recompilació.

---

## 1. Estructura del Google Sheet

El document ha de tenir **tres pestanyes** amb exactament aquests noms:

### Pestanya `menus`

| id | order | active | price | note_ca | note_es | note_fr | note_en | updated_at |
|----|-------|--------|-------|---------|---------|---------|---------|------------|
| degustacion | 1 | TRUE | 190 € | | | | | 2026-07-01 |
| chef | 2 | TRUE | 250 € | | | | | 2026-07-01 |
| esencia | 3 | TRUE | 90 € | Disponible al migdia de dimecres a divendres excepte festius. | Disponible al mediodía de miércoles a viernes excepto festivos. | Disponible le midi du mercredi au vendredi sauf jours fériés. | Available at lunch Wednesday to Friday except holidays. | 2026-07-01 |

### Pestanya `groups`

| id | menu_id | order | active | name_ca | name_es | name_fr | name_en |
|----|---------|-------|--------|---------|---------|---------|---------|
| deg-snacks | degustacion | 1 | TRUE | Snacks | Snacks | Snacks | Snacks |
| deg-menu | degustacion | 2 | TRUE | Menú | Menú | Menu | Menu |
| deg-postres | degustacion | 3 | TRUE | Postres | Postres | Desserts | Desserts |
| chef-snacks | chef | 1 | TRUE | Snacks | Snacks | Snacks | Snacks |
| chef-menu | chef | 2 | TRUE | Menú | Menú | Menu | Menu |
| chef-postres | chef | 3 | TRUE | Postres | Postres | Desserts | Desserts |
| ese-snacks | esencia | 1 | TRUE | Snacks | Snacks | Snacks | Snacks |
| ese-menu | esencia | 2 | TRUE | Menú | Menú | Menu | Menu |
| ese-postres | esencia | 3 | TRUE | Postres | Postres | Desserts | Desserts |

### Pestanya `dishes`

| id | menu_id | group_id | order | active | name_ca | name_es | name_fr | name_en | description_ca | description_es | description_fr | description_en | allergens | supplement | updated_at |
|----|---------|----------|-------|--------|---------|---------|---------|---------|----------------|----------------|----------------|----------------|-----------|------------|------------|
| deg-m1 | degustacion | deg-menu | 1 | TRUE | Lluç | Merluza | Merlu | Hake | | | | | gluten, peix | | 2026-07-01 |

---

## 2. Com editar plats

1. Obre el Google Sheet
2. Ves a la pestanya **`dishes`**
3. Edita les columnes `name_ca`, `name_es`, `name_fr`, `name_en`
4. Opcionalment afegeix descripció a `description_ca`, etc.
5. Desa (Ctrl+S)
6. **Els canvis apareixen a la web en un màxim de 10 minuts**

---

## 3. Com activar / desactivar un plat

- Columna `active`: escriu `TRUE` per mostrar, `FALSE` per amagar
- El plat desapareix de la web sense eliminar la fila

---

## 4. Com afegir un plat nou

1. Afegeix una fila nova a la pestanya `dishes`
2. Omple **obligatòriament**: `id` (únic, sense espais), `menu_id`, `group_id`, `order`, `active`, `name_ca`
3. L'`id` ha de ser únic (ex: `deg-m6`, `chef-m10`)
4. El `menu_id` ha de coincidir amb un `id` de la pestanya `menus`
5. El `group_id` ha de coincidir amb un `id` de la pestanya `groups`
6. La columna `order` controla l'ordre de presentació (números enters, de menor a major)

---

## 5. Com canviar el preu d'un menú

1. Ves a la pestanya **`menus`**
2. Edita la columna `price` (ex: `195 €`)
3. Desa

---

## 6. Com reordenar plats

- Canvia el número de la columna `order`
- Els plats s'ordenen de menor a major
- No cal que siguin consecutius (podeu usar 10, 20, 30... per deixar marge)

---

## 7. Com afegir traduccions

Cada plat té camps per a cada idioma:
- `name_ca` — Català *(obligatori)*
- `name_es` — Castellà
- `name_fr` — Francès
- `name_en` — Anglès
- `description_ca` / `description_es` / `description_fr` / `description_en`

Si un camp de traducció és buit, la web usa el **català com a fallback**.

---

## 8. Columnes que NO s'han de tocar

- `id` — identificador únic, **mai canviar-lo**
- `menu_id` — ha de coincidir exactament amb la pestanya `menus`
- `group_id` — ha de coincidir exactament amb la pestanya `groups`

---

## 9. Quant tarda a reflectir-se el canvi

La web té una caché de **10 minuts**. Això vol dir:

- Si un usuari ja té la pàgina oberta, veurà el canvi en recarregar
- Si un usuari entra per primera vegada, veurà les dades actuals de l'API
- En el pitjor cas, el canvi tarda **10 minuts** a ser visible per a tothom

Per veure el canvi immediatament al vostre navegador: obre la pàgina en mode incògnit, o esborra la caché del navegador.

---

## 10. Google Apps Script — configuració inicial

### Pas 1: Crear el Script

1. Al Google Sheet, ves a **Extensions → Apps Script**
2. Esborra el contingut existent i enganxa el codi següent:

```javascript
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId()

function doGet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID)
    const menusSheet  = ss.getSheetByName('menus')
    const groupsSheet = ss.getSheetByName('groups')
    const dishesSheet = ss.getSheetByName('dishes')

    if (!menusSheet || !groupsSheet || !dishesSheet) {
      throw new Error('Falten pestanyes: menus, groups o dishes')
    }

    const menus  = parseSheet(menusSheet)
    const groups = parseSheet(groupsSheet)
    const dishes = parseSheet(dishesSheet)

    // Filtrar inactius
    const activeMenus  = menus .filter(r => isActive(r.active))
    const activeGroups = groups.filter(r => isActive(r.active))
    const activeDishes = dishes.filter(r => isActive(r.active))

    // Ordenar
    activeMenus .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    activeGroups.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    activeDishes.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))

    // Validar relacions
    const menuIds  = new Set(activeMenus .map(m => m.id))
    const groupIds = new Set(activeGroups.map(g => g.id))
    const validGroups = activeGroups.filter(g => menuIds .has(g.menu_id))
    const validDishes = activeDishes.filter(d => menuIds .has(d.menu_id) && groupIds.has(d.group_id))

    const response = {
      version:  new Date().toISOString(),
      menus:    activeMenus .map(sanitize),
      groups:   validGroups .map(sanitize),
      dishes:   validDishes .map(sanitize),
    }

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    const errorResponse = { error: true, message: err.message }
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function isActive(val) {
  if (val === true || val === 1) return true
  if (typeof val === 'string') return val.toUpperCase() === 'TRUE'
  return false
}

function sanitize(obj) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      // Elimina HTML per evitar XSS
      out[k] = v.replace(/<[^>]*>/g, '').trim()
    } else if (typeof v === 'boolean' || typeof v === 'number') {
      out[k] = v
    } else {
      out[k] = String(v ?? '').trim()
    }
  }
  return out
}

function parseSheet(sheet) {
  const data = sheet.getDataRange().getValues()
  if (data.length < 2) return []
  const headers = data[0].map(h => String(h).trim().toLowerCase().replace(/\s+/g, '_'))
  return data
    .slice(1)
    .filter(row => row.some(cell => cell !== '' && cell !== null))
    .map(row => {
      const obj = {}
      headers.forEach((key, i) => {
        const val = row[i]
        if (key === 'active') {
          obj[key] = isActive(val)
        } else if (key === 'order' || key === 'supplement') {
          obj[key] = Number(val) || 0
        } else {
          obj[key] = (val === null || val === undefined) ? '' : String(val)
        }
      })
      return obj
    })
}
```

### Pas 2: Desplegar com a Web App

1. Clic a **Desplegar → Nova implementació**
2. Tipus: **Aplicació web**
3. Executar com: **Jo (el vostre compte)**
4. Qui té accés: **Tothom** *(necessari perquè la web pugui llegir-ho sense autenticació)*
5. Clic a **Desplegar**
6. Copieu l'URL que apareix (té la forma `https://script.google.com/macros/s/ABC.../exec`)

### Pas 3: Configurar la variable d'entorn

`VITE_MENUS_API_URL` és una **variable de build-time**: Vite la incrusta al bundle durant `npm run build`. No és una variable de servidor en temps d'execució. Si no s'estableix abans del build, la web usa el fallback JSON inclòs en el bundle.

#### Per a desenvolupament local

Crea un fitxer `.env.local` a l'arrel del projecte (no es commiteja a git):

```
VITE_MENUS_API_URL=https://script.google.com/macros/s/ABC.../exec
```

#### Per al deploy a Hostinger via GitHub Actions

La URL s'ha d'injectar com a **secret de GitHub** durant el pas de build del CI:

1. Ves a **GitHub → SpankyGi/Botic1 → Settings → Secrets and variables → Actions**
2. Crea un secret nou: nom `VITE_MENUS_API_URL`, valor = la URL completa del script
3. Edita el fitxer de workflow (`.github/workflows/deploy.yml`) i afegeix la variable al pas de build:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_MENUS_API_URL: ${{ secrets.VITE_MENUS_API_URL }}
```

Sense aquest secret al CI, el bundle es genera sense la URL i la web mostra el fallback JSON (contingut estàtic del build anterior) fins que es fa un nou deploy amb la variable correcta.

**Important:** cada vegada que modifiqueu el codi del script, heu de crear una **nova implementació** (no "gestionar implementació"). La URL canvia — caldrà actualitzar el secret de GitHub.

---

## 11. Provar els canvis

### Prova bàsica (sense deploy)
1. Feu un canvi al Sheet (ex: canvieu el nom d'un plat)
2. Espereu uns 30 segons (el script actualitza)
3. Obriu un **mode incògnit** i aneu a `https://bo-tic.com/ca/menus`
4. Verifiqueu que el canvi és visible

### Forçar actualització immediata (per a proves)
1. Obriu les DevTools del navegador (F12)
2. A la consola, executeu: `localStorage.removeItem('botic_menus_v1')`
3. Recarregueu la pàgina
4. La web farà fetch immediat de l'API

### Verificar que l'API funciona
Obriu directament la URL del script al navegador. Heu de veure un JSON com:
```json
{
  "version": "2026-07-01T10:00:00.000Z",
  "menus": [...],
  "groups": [...],
  "dishes": [...]
}
```

---

## 12. Fallback i robustesa

- Si l'API no respon, la web mostra les dades incloses en el build (última versió compilada)
- Si la caché és vàlida, la web no fa cap petició a l'API
- Cap error tècnic és visible per a l'usuari final
- Els quatre idiomes funcionen sempre, amb català com a fallback si falta una traducció
