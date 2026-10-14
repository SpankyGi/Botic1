import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import vm from 'node:vm'
import { transformSync } from 'esbuild'

function animationHarness(path, component, enabled = true) {
  const frames = new Map(), listeners = new Map(), effects = [], refs = []
  let nextId = 0, reads = 0
  const style = { removeProperty(key) { delete this[key] } }
  const element = {
    style,
    classList: { add() {}, remove() {}, toggle() {} },
    getBoundingClientRect() { reads++; return { left: 0, top: 0, width: 100, height: 50 } },
    addEventListener(name, callback) { listeners.set(`element:${name}`, callback) },
    removeEventListener(name) { listeners.delete(`element:${name}`) },
  }
  const media = { matches: enabled, addEventListener() {}, removeEventListener() {} }
  const document = {
    hidden: false, body: { classList: element.classList },
    addEventListener(name, callback) { listeners.set(name, callback) },
    removeEventListener(name) { listeners.delete(name) },
  }
  const react = {
    useEffect(callback) { effects.push(callback) },
    useRef(value) { const ref = { current: value }; refs.push(ref); return ref },
    useState(value) { return [typeof value === 'function' ? value() : value, () => {}] },
  }
  const module = { exports: {} }
  const code = transformSync(readFileSync(path, 'utf8'), { loader: 'jsx', format: 'cjs', jsx: 'automatic' }).code
  vm.runInNewContext(code, {
    module, exports: module.exports,
    require(name) { return name === 'react' ? react : { jsx() {}, jsxs() {} } },
    window: { matchMedia: () => media }, document,
    requestAnimationFrame(callback) { frames.set(++nextId, callback); return nextId },
    cancelAnimationFrame(id) { frames.delete(id) },
  })
  module.exports[component]()
  for (const ref of refs) if (ref.current === null) ref.current = element
  const cleanups = effects.map(effect => effect())
  const flush = () => {
    const batch = [...frames.values()]
    frames.clear()
    batch.forEach(callback => callback())
  }
  return {
    frames, listeners, document, flush, style,
    get reads() { return reads },
    move(x, y) { listeners.get('mousemove')?.({ clientX: x, clientY: y }) },
    cleanup() { cleanups.forEach(cleanup => cleanup?.()) },
  }
}

for (const [path, name] of [
  ['src/hooks/useMagnetic.js', 'useMagnetic'],
  ['src/components/CustomCursor.jsx', 'default'],
]) {
  const h = animationHarness(path, name)
  assert.equal(h.frames.size, 0, `${name}: idle page must not run animation frames`)
  h.move(70, 35)
  h.move(80, 40)
  assert.equal(h.frames.size, 1, `${name}: pointer events must share a frame`)
  assert.equal(h.reads, 0, `${name}: pointer event must not synchronously measure layout`)
  for (let i = 0; h.frames.size && i < 100; i++) h.flush()
  assert.equal(h.frames.size, 0, `${name}: animation must stop when settled`)
  h.move(90, 45)
  assert.equal(h.frames.size, 1)
  h.document.hidden = true
  h.listeners.get('visibilitychange')()
  assert.equal(h.frames.size, 0, `${name}: hidden tab must stop animating`)
  h.cleanup()
  assert.equal(h.listeners.size, 0, `${name}: unmount must remove listeners`)
  const reduced = animationHarness(path, name, false)
  reduced.move(80, 40)
  assert.equal(reduced.frames.size, 0, `${name}: disabled motion must not animate`)
  reduced.cleanup()
}

const assets = readdirSync('dist/assets')
const main = readFileSync(`dist/assets/${assets.find(name => /^index-.*\.js$/.test(name))}`, 'utf8')
assert(!main.includes('admin-editor'), 'Public bundle must not include the admin editor')
assert(assets.some(name => /^Admin-.*\.js$/.test(name)), 'Admin must have its own bundle')
const admin = readFileSync('dist/admin/index.html', 'utf8')
assert(admin.includes('admin-login'), 'Admin login must remain prerendered')
for (const lang of ['ca', 'es', 'en', 'fr']) {
  const home = readFileSync(`dist/${lang}/index.html`, 'utf8')
  assert(!home.includes('rel="stylesheet" crossorigin href="/assets/Admin-'), 'Public HTML must not load admin CSS')
  for (const image of home.matchAll(/<img[^>]*editorial-transparent[^>]*>/g)) {
    assert(/width="\d+"/.test(image[0]) && /height="\d+"/.test(image[0]), 'Portraits must reserve their aspect ratio')
  }
}
console.log('Performance checks passed: idle/settled/hidden/reduced-motion animation scheduling, event batching, listener cleanup, separate admin bundle and portrait dimensions.')
