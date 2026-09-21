import assert from 'node:assert/strict'
import { createTracking, classifyLink } from '../src/analytics/tracking.js'
function setup(options = {}) {
  const scripts = []
  const win = { location: { origin: 'https://bo-tic.com' } }
  const doc = { createElement: () => ({}), head: { appendChild: s => scripts.push(s) } }
  return { win, scripts, tracking: createTracking({ win, doc, enabled: true, gtmId: 'GTM-ABC123', ...options }) }
}
const a = setup({ gaId: 'G-ABC123' })
a.tracking.page('/ca')
a.tracking.event('phone_click')
a.tracking.applyConsent({ analytics: false, marketing: false })
assert.equal(a.scripts.length, 0)
assert.equal(a.win.dataLayer.filter(x => x.event === 'botic_page_view').length, 0)
a.tracking.applyConsent({ analytics: true, marketing: false })
a.tracking.page('/ca')
a.tracking.page('/ca')
a.tracking.page('/ca/menus')
assert.equal(a.scripts.length, 1)
assert.match(a.scripts[0].src, /gtm\.js/)
assert.equal(a.win.dataLayer.filter(x => x.event === 'botic_page_view').length, 2)
assert.equal(a.win.dataLayer.some(x => x[0] === 'config'), false, 'GTM must not also load direct GA4')
a.tracking.applyConsent({ analytics: false, marketing: false })
const before = a.win.dataLayer.length
a.tracking.page('/ca/reserves'); a.tracking.event('phone_click')
assert.equal(a.win.dataLayer.length, before, 'No measurement after withdrawal')
const marketing = setup()
marketing.tracking.applyConsent({ analytics: false, marketing: true })
marketing.tracking.page('/ca')
assert.equal(marketing.win.dataLayer.some(x => x.event === 'botic_page_view'), false)
const disabled = setup({ enabled: false })
disabled.tracking.applyConsent({ analytics: true, marketing: true })
assert.equal(disabled.scripts.length, 0)
const absent = setup({ gtmId: '', gaId: '' })
absent.tracking.applyConsent({ analytics: true })
assert.equal(absent.scripts.length, 0)
const ga = setup({ gtmId: '', gaId: 'G-ABC123' })
ga.tracking.applyConsent({ analytics: true }); ga.tracking.page('/ca')
assert.equal(ga.win.dataLayer.find(x => x[0] === 'config')[2].send_page_view, false)
assert.equal(ga.win.dataLayer.filter(x => x[0] === 'event' && x[1] === 'page_view').length, 1)
assert.deepEqual(classifyLink('tel:+34972630869', 'https://bo-tic.com'), { event: 'phone_click' })
assert.equal(classifyLink('https://bo-tic.myrestoo.net/ca/tienda?email=private', 'https://bo-tic.com').event, 'gift_click')
assert.equal(classifyLink('https://bo-tic.com/es/reservas', 'https://bo-tic.com').event, 'reservation_click')
assert.equal(classifyLink('https://bo-tic.myrestoo.net.evil.test/ca', 'https://bo-tic.com'), null)
assert.equal(classifyLink('https://www.google.com/maps/d/viewer?mid=test', 'https://bo-tic.com').event, 'directions_click')
console.log('Analytics checks passed: consent gating, withdrawal, SPA deduplication, GTM/GA exclusivity, disabled mode, click classification.')
const campaignWin = { location: { origin: 'https://bo-tic.com', search: '?utm_source=instagram&utm_medium=social&utm_campaign=autumn&email=private&token=secret' } }
const campaignDoc = { referrer: 'https://www.google.com/search?q=private', createElement: () => ({}), head: { appendChild() {} } }
const campaign = createTracking({ win: campaignWin, doc: campaignDoc, enabled: true, gtmId: 'GTM-ABC123' })
campaign.page('/ca/')
assert.equal(campaignWin.dataLayer.some(x => x.event === 'botic_page_view'), false)
campaign.applyConsent({ analytics: true })
campaign.page('/ca/')
const landing = campaignWin.dataLayer.find(x => x.event === 'botic_page_view')
assert.equal(landing.page_location, 'https://bo-tic.com/ca/?utm_source=instagram&utm_medium=social&utm_campaign=autumn')
assert.equal(landing.page_referrer, 'https://www.google.com/search')
campaignWin.location.search = ''
campaign.page('/ca/menus/')
const next = campaignWin.dataLayer.filter(x => x.event === 'botic_page_view').at(-1)
assert.equal(next.page_location, 'https://bo-tic.com/ca/menus/')
assert.equal(next.page_referrer, landing.page_location)
assert.equal(JSON.stringify(campaignWin.dataLayer).includes('secret'), false)
assert.equal(JSON.stringify(campaignWin.dataLayer).includes('private'), false)
console.log('Campaign attribution and referrer tests passed without forwarding arbitrary query parameters.')
