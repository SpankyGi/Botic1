import vm from 'node:vm'
import {readFile} from 'node:fs/promises'
import {createHash,randomUUID} from 'node:crypto'

export async function createAdminFixture(){
const source=await readFile('docs/bo-tic-admin.gs','utf8')
const props=new Map([['BOTIC_ADMIN_USER','test'],['BOTIC_ADMIN_PASSWORD','test-only-password']]), cache=new Map()
const tables={
 menus:[['id','ordre','preu','actiu','nom_ca','nom_es','nom_fr','nom_en'],['one',1,190,'CERT','Menu','','','']],
 seccions:[['id','menu_id','ordre','actiu','nom_ca'],['s','one',1,'CERT','Section']],
 grups:[['id','menu_id','seccio_id','ordre','actiu','nom_ca'],['g','one','s',1,'CERT','Group']],
 plats:[['id','menu_id','grup_id','ordre','actiu','nom_ca','nom_es','nom_fr','nom_en','descripcio_ca','descripcio_es','descripcio_fr','descripcio_en','allergens','suplement','actualitzat_el'],['a','one','g',1,'CERT','First','','','','','','','','','', ''],['b','one','g',2,'CERT','Second','','','','','','','','','', '']],
 avisos:[['id','ordre','actiu','nom_ca','inici','fi'],['notice',1,'FALS','Hidden','','']],
 configuracio:[['clau','valor'],['versio',1]]
}
let rowWrites=0, failAfterWrite=false
const ss={getId:()=> 'isolated-test-copy',getSheetByName:name=>({
 getDataRange:()=>({getValues:()=>structuredClone(tables[name])}),
 getRange:(r,c,h=1,w=1)=>({getFormulas:()=>[Array(w).fill('')],setNumberFormat:()=>{},setValues:rows=>{rowWrites++;rows.forEach((row,i)=>row.forEach((v,j)=>tables[name][r-1+i][c-1+j]=v));}})
})}
const context=vm.createContext({console,Date,JSON,Utilities:{DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(a,s)=>[...createHash('sha256').update(s).digest()],base64EncodeWebSafe:a=>Buffer.from(a).toString('base64url'),getUuid:randomUUID},PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k)||null,setProperty:(k,v)=>props.set(k,v),getProperties:()=>Object.fromEntries(props),deleteProperty:k=>props.delete(k)})},CacheService:{getScriptCache:()=>({get:k=>cache.get(k)||null,put:(k,v)=>cache.set(k,v),remove:k=>cache.delete(k)})},LockService:{getScriptLock:()=>({waitLock:()=>{},hasLock:()=>true,releaseLock:()=>{}})},SpreadsheetApp:{getActiveSpreadsheet:()=>ss,flush:()=>{if(failAfterWrite){failAfterWrite=false;throw new Error('simulated lost connection after row write')}}},actualitzar_versio_interna_:()=>{}})
vm.runInContext(source,context)
const call=p=>context.adminHandle_(p,ss)
const login=()=>call({action:'login',user:'test',password:'test-only-password'})

return {call,login,tables,cache,props,get rowWrites(){return rowWrites},set failAfterWrite(v){failAfterWrite=v}}
}
