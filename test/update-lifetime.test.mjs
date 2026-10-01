import assert from 'node:assert/strict'
import test from 'node:test'
import {loadPluginInternals} from './helpers/load-plugin.mjs'

async function fixture(){
 const effects=[],entries=[],disposers=[]
 const {plugin}=await loadPluginInternals([],{
  jsx:(type,props)=>({type,props}),useEffect:run=>effects.push(run),useQuery:()=>({}),
  TITLEBAR_AREAS:{center:'titleBar.center',left:'titleBar.left',right:'titleBar.right'}
 })
 plugin.register({storage:{get:(_k,f)=>f,set:()=>{},remove:()=>{}},register:e=>entries.push(e),onDispose:fn=>disposers.push(fn)})
 const element=entries.find(e=>e.id==='update-runtime').render()
 const mount=()=>{effects.length=0;element.type(element.props);const cleanup=effects.map(fn=>fn()).filter(fn=>typeof fn==='function');return()=>cleanup.forEach(fn=>fn())}
 const offer=id=>({checkedAt:Date.now(),releases:[{id,tag_name:'v9.0.'+id,draft:false,prerelease:false,assets:[{id:201,name:'plugin.js',size:100,digest:'sha256:'+'a'.repeat(64),url:'https://api.github.com/repos/steveafrost/hermes-quiet/releases/assets/201'}]}]})
 return{entries,disposers,updater:element.props.updater,mount,offer}
}

test('plugin services do not claim page-owned titlebar chrome',async()=>{
 const f=await fixture()
 assert.ok(f.entries.filter(e=>e.id!=='profile-header').every(e=>!e.area.startsWith('titleBar.')))
 assert.equal(f.entries.find(e=>e.id==='profile-header').area,'titleBar.left')
 assert.equal(f.entries.find(e=>e.id==='update-runtime').area,'composer.leading')
 f.disposers.forEach(fn=>fn())
})

test('view remount and StrictMode cleanup cannot enable upstream replacement of the local variant',async()=>{
 const f=await fixture()
 for(let id=1;id<=3;id++){
  const leave=f.mount()
  f.updater.accept(f.offer(id))
  assert.equal(f.updater.state.target,null,'remount must preserve the local variant replacement guard')
  leave()
 }
 assert.equal(f.disposers.length,2,'updater and styles each clean up on plugin unload, not view navigation')
 f.disposers.forEach(fn=>fn())
 f.updater.accept(f.offer(4))
 assert.equal(f.updater.state.target,null,'unloading cannot enable replacement either')
})
