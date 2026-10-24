import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const source = (await readFile('src/services/adminApi.js', 'utf8')).replace("import { loadConfig } from './config'", "const loadConfig = async () => ({adminApiUrl:'https://example.com/exec'})")
const { adminRequest, saveAdminRecord } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
const calls = []
const validSnapshot={revision:'test',data:{menus:[],seccions:[],grups:[],plats:[],avisos:[]}}
globalThis.fetch = async (url, options) => { calls.push({url:String(url),options}); return {ok:true,json:async()=>({ok:true,snapshot:validSnapshot})} }
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
for (const action of ['login','read']) {
  let count=0
  const result=await adminRequest({action},async()=>{if(++count<3) throw new Error('lost response');return {ok:true}},async()=>{})
  assert.equal(result.ok,true);assert.equal(count,3)
}
let count=0
await assert.rejects(adminRequest({action:'save'},async()=>{count++;throw new Error('lost')},async()=>{}),/lost/)
assert.equal(count,1)
const v2={...payload,requestId:'11111111-1111-4111-8111-111111111111',recordRevision:'base',createdAt:Date.now()}
let attempts=[]
await adminRequest(v2,async p=>{attempts.push(p.requestId);if(attempts.length<3)throw new Error('response lost');return {ok:true}},async()=>{})
assert.deepEqual(attempts,[v2.requestId,v2.requestId,v2.requestId])
const receiptRecovery=await saveAdminRecord(v2,async p=>{if(p.action==='save')throw new Error('lost');return {ok:true,snapshot,receipt:{requestId:v2.requestId,state:'done'}}})
assert.equal(receiptRecovery.snapshot,snapshot)
await assert.rejects(saveAdminRecord(v2,async p=>{if(p.action==='save')throw new Error('lost');return {ok:true,snapshot,receipt:null}}),/No s’ha confirmat/)
count=0
await assert.rejects(adminRequest({action:'login'},async()=>{count++;throw Object.assign(new Error('incorrect credentials'),{confirmedRejection:true})},async()=>{}),/incorrect/)
assert.equal(count,1)
count=0
globalThis.fetch=async()=>({ok:true,json:async()=>++count===1 ? {menus:[],dishes:[]} : {ok:true,snapshot:validSnapshot}})
assert.equal((await adminRequest({action:'read'})).ok,true)
assert.equal(count,2)
globalThis.fetch=async()=>({ok:true,json:async()=>({ok:true})})
await assert.rejects(adminRequest({action:'save'}),/incompletes/)
console.log('PASS: unique requests, no cached admin responses, read-back recovery without repeated writes, mismatches and rejections remain errors.')
