import assert from 'node:assert/strict'
import test from 'node:test'
import {loadPluginInternals} from './helpers/load-plugin.mjs'
import {chromium} from './helpers/chromium.mjs'

test('profile header uses live display names and the supported connection-qualified switch',async()=>{
 let active='default', calls=[]
 const {profileHeaderLabel,switchHeaderProfile}=await loadPluginInternals(['profileHeaderLabel','switchHeaderProfile'],{host:{state:{profile:{get:()=>active}},activeConnectionId:()=> 'local',ensureAgent:async(...args)=>{calls.push(args);active=args[1]}}})
 assert.equal(typeof profileHeaderLabel,'function','profile header exists')
 assert.equal(profileHeaderLabel([{name:'default',display_name:'Jeeves'}],'default'),'Jeeves')
 assert.equal(profileHeaderLabel([],'research'),'research')
 await switchHeaderProfile('default','local');assert.deepEqual(calls,[])
 await switchHeaderProfile('research','local');assert.deepEqual(calls,[['local','research']])
})

test('profile header aligns inside transformed titlebar ancestors and restores on unload',async()=>{
 const {CSS,installProfileHeaderPositioning}=await loadPluginInternals(['CSS','installProfileHeaderPositioning']);assert.equal(typeof installProfileHeaderPositioning,'function')
 const b=await chromium();try{
 await b.call('Page.setDocumentContent',{frameId:(await b.call('Page.getFrameTree')).frameTree.frame.id,html:`<html data-codex-chat-look="true"><style>${CSS}</style><style>body{margin:0}aside{position:absolute;left:20px;top:48px;width:240px;height:500px}[data-titlebar-cluster]{position:absolute;left:98px;top:4px;transform:translateY(-50%) scale(.9)}</style><body><div data-titlebar-cluster><div data-codex-profile-header><button>default</button></div></div><aside data-slot="sidebar"></aside></body></html>`})
 await b.evaluate(`window.stopHeader=(${installProfileHeaderPositioning.toString()})();new Promise(r=>setTimeout(r,120))`)
 const r=await b.evaluate(`document.querySelector('[data-codex-profile-header]').getBoundingClientRect().toJSON()`)
 assert.ok(Math.abs(r.x-36)<1,JSON.stringify(r));assert.ok(Math.abs(r.y-56)<1,JSON.stringify(r));assert.ok(Math.abs(r.width-208)<1)
 await b.evaluate(`document.querySelector('aside').style.left='80px';window.dispatchEvent(new Event('resize'));new Promise(r=>setTimeout(r,100))`)
 assert.ok(Math.abs(await b.evaluate(`document.querySelector('[data-codex-profile-header]').getBoundingClientRect().x`)-96)<1)
 await b.evaluate(`stopHeader()`);assert.equal(await b.evaluate(`document.querySelector('[data-codex-profile-header]').style.length`),0)
 }finally{b.close()}
})

test('profile header sits above compact sessions and retains keyboard focus',async()=>{
 const {CSS}=await loadPluginInternals(['CSS']);const b=await chromium()
 try{
 await b.call('Page.setDocumentContent',{frameId:(await b.call('Page.getFrameTree')).frameTree.frame.id,html:`<html data-codex-chat-look="true" data-codex-sidebar-density="compact"><style>${CSS}</style><style>body{margin:0}aside{position:absolute;left:20px;top:48px;width:240px;height:500px} [data-slot=sidebar-content]{display:flex;flex-direction:column}</style><body><aside data-slot="sidebar"><div data-slot="sidebar-content"><div id="rows">Sessions</div></div></aside><div data-titlebar-cluster><div data-codex-profile-header><button id="trigger">Jeeves <span>⌄</span></button></div></div></body></html>`})
 const r=await b.evaluate(`(()=>{const el=document.querySelector('[data-codex-profile-header]'),b=el.getBoundingClientRect(),rows=document.querySelector('#rows').getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,rowsY:rows.y,font:getComputedStyle(document.querySelector('#trigger')).fontSize}})()`)
 assert.ok(r.x>=20&&r.x<50,JSON.stringify(r));assert.ok(r.y>=48&&r.y<70,JSON.stringify(r));assert.ok(r.width<=240&&r.width>120);assert.ok(r.height>=32);assert.ok(r.rowsY>=r.y+r.height);assert.equal(r.font,'18px')
 await b.evaluate(`document.querySelector('#trigger').focus()`);assert.equal(await b.evaluate(`document.activeElement.id`),'trigger')
 }finally{b.close()}
})
