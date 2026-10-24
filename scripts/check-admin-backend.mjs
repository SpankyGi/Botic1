import assert from 'node:assert/strict'
import {randomUUID} from 'node:crypto'
import {createAdminFixture} from './admin-test-fixture.mjs'
const fixture=await createAdminFixture()
const {call,login,tables}=fixture
const sessionA=login(),sessionB=login()
assert.equal(sessionA.ok,true)
const payload=(session,table,id,values)=>({action:'save',token:session.token,table,id,values,requestId:randomUUID(),createdAt:Date.now(),recordRevision:session.snapshot.data[table].find(r=>r.id===id)._revision})
const first=payload(sessionA,'plats','a',{nom_ca:'Changed test dish'})
assert.equal(call(first).ok,true);assert.equal(fixture.rowWrites,1)
assert.equal(call(first).ok,true);assert.equal(fixture.rowWrites,1,'same receipt must not write twice')
assert.equal(call({...first,values:{nom_ca:'different'}}).ok,false)
const conflict=call(payload(sessionB,'plats','a',{nom_ca:'stale overwrite'}))
assert.equal(conflict.code,'CONFLICT');assert.equal(tables.plats[1][5],'Changed test dish')
assert.equal(call(payload(sessionB,'plats','b',{nom_ca:'Other record'})).ok,true,'different records must not conflict')
const fresh=login(),crash=payload(fresh,'menus','one',{preu:123.45})
fixture.failAfterWrite=true
const uncertain=call(crash)
assert.equal(uncertain.uncertain,true);assert.equal(tables.menus[1][2],123.45)
const count=fixture.rowWrites
assert.equal(call(crash).ok,true);assert.equal(fixture.rowWrites,count,'recover committed row without repeating write')
const receipt=call({action:'read',token:fresh.token,requestId:crash.requestId})
assert.equal(receipt.receipt.state,'done')
assert.equal(call({...crash,token:'expired'}).code,'SESSION_EXPIRED')
assert.equal(call(payload(login(),'plats','a',{nom_ca:'=IMPORTDATA("bad")'})).ok,false)
assert.equal(call(payload(login(),'menus','one',{preu:-1})).ok,false)
const old=payload(login(),'menus','one',{preu:1});old.createdAt-=86400001
assert.equal(call(old).ok,false)
assert.equal(fixture.rowWrites,count)
console.log('PASS: actual Apps Script backend; changed dishes/prices, durable replay, crash after write, same-record conflict, independent records, expired session, validation, expired requests. All in isolated memory.')
