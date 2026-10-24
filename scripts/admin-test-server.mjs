// Local-only browser harness. Never imported by the production application.
import {createServer} from 'vite'
import react from '@vitejs/plugin-react'
import {createAdminFixture} from './admin-test-fixture.mjs'
const fixture=await createAdminFixture()
let loseNextSave=false
const server=await createServer({configFile:false,plugins:[react(),{
 name:'isolated-admin-tests',
 transform(code,id){if(id.endsWith('/src/services/config.js'))return `export const loadConfig=async()=>({adminApiUrl:'http://127.0.0.1:4193/test-api',menusApiUrl:''})`},
 configureServer(server){server.middlewares.use(async(req,res,next)=>{
  const url=new URL(req.url,'http://127.0.0.1:4193')
  if(url.pathname==='/test-controls'){
   if(url.searchParams.get('action')==='lose')loseNextSave=true
   if(url.searchParams.get('action')==='expire')fixture.cache.clear()
   if(url.searchParams.get('action')==='conflict')fixture.tables.plats[1][5]='Changed by second session'
   res.setHeader('Content-Type','text/html;charset=utf-8');res.end(`<h1>Proves locals — cap dada real</h1><p>Escriptures: ${fixture.rowWrites}</p><p>Plat: ${fixture.tables.plats[1][5]}</p><a href="?action=lose">Perdre la propera resposta de desament</a><br><a href="?action=expire">Caducar les sessions de prova</a><br><a href="?action=conflict">Canvi des d’una altra sessió</a>`);return
  }
  if(url.pathname!=='/test-api')return next()
  let body='';for await(const chunk of req)body+=chunk
  const payload=JSON.parse(body);const result=fixture.call(payload)
  res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store')
  if(payload.action==='save'&&loseNextSave){loseNextSave=false;res.end(JSON.stringify({menus:[],dishes:[]}));return}
  res.end(JSON.stringify(result))
 })}
}],server:{host:'127.0.0.1',port:4193,strictPort:true}})
await server.listen();console.log('Isolated admin harness ready at http://127.0.0.1:4193/admin/ (test / test-only-password)')
