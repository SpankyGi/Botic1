import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const source = (await readFile('src/services/adminApi.js', 'utf8')).replace("import { loadConfig } from './config'", "const loadConfig = async () => ({adminApiUrl:'https://example.com/exec'})")
const { adminRequest, saveAdminRecord } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
const calls = []
globalThis.fetch = async (url, options) => { calls.push({url:String(url),options}); return {ok:true,json:async()=>({ok:true})} }
await adminRequest({action:'read'}); await adminRequest({action:'read'})
assert.notEqual(calls[0].url,calls[1].url)
assert.equal(calls[0].options.cache,'no-store')
const payload={action:'save',token:'test',table:'grups',id:'test',values:{nom_ca:'POMA',ordre:2,actiu:'CERT'}}
const snapshot={data:{grups:[{id:'test',nom_ca:'POMA',ordre:2,actiu:true}]},revision:'test'}
let actions=[]
const recovered=await saveAdminRecord(payload, async p=>{actions.push(p.action); if(p.action==='save') throw new Error('lost response'); return {ok:true,snapshot} })
assert.equal(recovered.snapshot,snapshot); assert.deepEqual(actions,['save','read'])
await assert.rejects(saveAdminRecord(payload,async p=>{if(p.action==='save')throw new Error('lost'); return {ok:true,snapshot:{data:{grups:[{id:'test',nom_ca:'MADUIXA'}]}}}}), /No s’ha confirmat/)
actions=[]
await assert.rejects(saveAdminRecord(payload,async p=>{actions.push(p.action); throw Object.assign(new Error('conflict'),{confirmedRejection:true})}),/conflict/)
assert.deepEqual(actions,['save'])
console.log('PASS: unique requests, no cached admin responses, read-back recovery without repeated writes, mismatches and rejections remain errors.')
