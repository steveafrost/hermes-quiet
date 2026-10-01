import assert from 'node:assert/strict'
import test from 'node:test'
import { chromium } from './helpers/chromium.mjs'
import { loadPluginInternals } from './helpers/load-plugin.mjs'

test('hidden sidebar extras remove only API, Photon and rail, with a reversible visible mode', async () => {
 const { CSS }=await loadPluginInternals(['CSS'])
 const b=await chromium()
 try {
  const html=`<!doctype html><html data-codex-chat-look="true" data-codex-sidebar-extras="hidden"><head><style>${CSS}</style></head><body><aside data-slot="sidebar"><div id="api" data-slot="sidebar-group" data-codex-sidebar-extra="api">API</div><div id="photon" data-slot="sidebar-group" data-codex-sidebar-extra="photon">PHOTON</div><div id="cron" data-slot="sidebar-group">Cron jobs</div><div id="telegram" data-slot="sidebar-group">Telegram</div><div id="rail-wrapper"><div id="rail" data-slot="profile-rail">Switcher</div></div></aside><div id="outside" data-slot="profile-rail">Other pane</div><footer id="statusbar" data-slot="statusbar">Status</footer></body></html>`
  await b.call('Page.setDocumentContent',{frameId:(await b.call('Page.getFrameTree')).frameTree.frame.id,html})
  const displays=()=>b.evaluate(`Object.fromEntries(['api','photon','cron','telegram','rail-wrapper','outside','statusbar'].map(id=>[id,getComputedStyle(document.getElementById(id)).display]))`)
  const hidden=await displays()
  assert.equal(hidden.api,'none');assert.equal(hidden.photon,'none');assert.equal(hidden['rail-wrapper'],'none')
  for(const id of ['cron','telegram','outside','statusbar'])assert.notEqual(hidden[id],'none',`${id} stays visible`)
  await b.evaluate(`document.documentElement.dataset.codexSidebarExtras='visible'`)
  const shown=await displays()
  for(const id of ['api','photon','rail-wrapper'])assert.notEqual(shown[id],'none',`${id} can be restored`)
 }finally{b.close()}
})

test('sidebar extras mark exact platform headings, not conversation titles or other groups', async () => {
 const {reconcileSidebarExtras}=await loadPluginInternals(['reconcileSidebarExtras'])
 const b=await chromium()
 try{
  const html=`<aside data-slot="sidebar">${['API','PHOTON','Telegram','Cron jobs'].map((s,i)=>`<div id="g${i}" data-slot="sidebar-group"><button class="group/section-label"><span aria-hidden="true"></span><span>${s}</span></button><div class="row-hover">API</div></div>`).join('')}</aside><div id="outside" data-slot="sidebar-group"><button class="group/section-label"><span>API</span></button></div>`
  await b.call('Page.setDocumentContent',{frameId:(await b.call('Page.getFrameTree')).frameTree.frame.id,html})
  await b.evaluate(`(${reconcileSidebarExtras.toString()})()`)
  assert.deepEqual(await b.evaluate(`['g0','g1','g2','g3','outside'].map(id=>document.getElementById(id).getAttribute('data-codex-sidebar-extra'))`),['api','photon',null,null,null])
  await b.evaluate(`document.querySelector('#g0 button > span:last-child').textContent='Projects'; (${reconcileSidebarExtras.toString()})()`)
  assert.equal(await b.evaluate(`document.getElementById('g0').getAttribute('data-codex-sidebar-extra')`),null)
 }finally{b.close()}
})

test('sidebar extras default hidden and the palette toggle persists restoration', async () => {
 const attributes=new Map(),values=new Map(),registrations=[]
 const i=await loadPluginInternals(['__pluginDefault','readSidebarExtrasMode','syncSidebarExtrasRoot','setSidebarExtrasMode'],{document:{documentElement:{getAttribute:k=>attributes.get(k),setAttribute:(k,v)=>attributes.set(k,v)}},window:{dispatchEvent:()=>{},Event,location:{hash:'#/theme-test'}}})
 i.__pluginDefault.register({storage:{get:(k,f)=>values.has(k)?values.get(k):f,set:(k,v)=>values.set(k,v)},register:c=>registrations.push(c),onDispose:()=>{}})
 assert.equal(i.readSidebarExtrasMode(),'hidden');i.syncSidebarExtrasRoot()
 assert.equal(attributes.get('data-codex-sidebar-extras'),'hidden')
 const command=registrations.find(r=>r.data?.id==='codex-chat-look.toggle-sidebar-extras')
 assert.ok(command,'restoration remains reachable from the palette')
 command.data.run();assert.equal(values.get('sidebar-extras'),'visible');assert.equal(attributes.get('data-codex-sidebar-extras'),'visible')
 command.data.run();assert.equal(values.get('sidebar-extras'),'hidden')
})
