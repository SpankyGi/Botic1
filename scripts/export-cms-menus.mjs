// The current rendered menus are the source of truth. Never seed from the old CMS.
import { getOfficialMenus } from '../src/data/officialMenus.js'
import { writeFile, mkdir } from 'node:fs/promises'
const langs = ['ca', 'es', 'fr', 'en']
const source = Object.fromEntries(langs.map(l => [l, getOfficialMenus(l)]))
const titles = { ca: ['Menú Degustació', 'Menú del Xef', 'Menú Essència'], es: ['Menú Degustación', 'Menú del Chef', 'Menú Esencia'], fr: ['Menu Dégustation', 'Menu du Chef', 'Menu Essence'], en: ['Tasting Menu', 'Chef’s Menu', 'Essence Menu'] }
const data = { version: '11', temps_cache_minuts: 10, menus: [], sections: [], groups: [], dishes: [] }
const names = values => Object.fromEntries(langs.map((l, i) => [`name_${l}`, values[i]]))
source.ca.forEach((menu, mi) => {
  data.menus.push({ id: menu.id, order: mi + 1, price: menu.price, active: true, ...names(langs.map(l => titles[l][mi])) })
  menu.sections.forEach((section, si) => {
    const sectionId = `${menu.id}-s${si + 1}`
    data.sections.push({ id: sectionId, menu_id: menu.id, order: si + 1, active: true, ...names(langs.map(l => source[l][mi].sections[si].title)) })
    section.groups.forEach((group, gi) => {
      const id = `${sectionId}-g${gi + 1}`
      const groups = langs.map(l => source[l][mi].sections[si].groups[gi])
      data.groups.push({ id, menu_id: menu.id, section_id: sectionId, order: gi + 1, active: true, ...names(groups.map(g => g.title)) })
      for (let di = 0; di < Math.max(...groups.map(g => g.items.length)); di++) {
        data.dishes.push({ id: `${id}-p${di + 1}`, menu_id: menu.id, group_id: id, order: di + 1, active: true, ...names(groups.map(g => g.items[di]?.name || '')), ...Object.fromEntries(langs.map((l, i) => [`description_${l}`, groups[i].items[di]?.description || ''])), allergens: '', supplement: '' })
      }
    })
  })
})
await mkdir('src/data/generated', { recursive: true })
await writeFile('src/data/generated/menus.json', JSON.stringify(data, null, 2) + '\n')
console.log(`Exported ${data.menus.length} menus, ${data.sections.length} sections, ${data.groups.length} groups, ${data.dishes.length} lines.`)
