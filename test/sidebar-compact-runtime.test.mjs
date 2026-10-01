import assert from 'node:assert/strict'
import test from 'node:test'
import { chromium } from './helpers/chromium.mjs'
import { loadPluginInternals } from './helpers/load-plugin.mjs'

test('compact sidebar condenses rows and hides secondary navigation without losing primary actions',async()=>{
 const {CSS}=await loadPluginInternals(['CSS']);const b=await chromium()
 try{
  const html=`<html data-codex-chat-look="true" data-codex-sidebar-density="compact"><head><style>button,.row-hover{height:28px}.row-hover{display:flex} ${CSS}</style></head><body><aside data-slot="sidebar"><ul><li id="new" data-slot="sidebar-menu-item"><button data-sidebar="menu-button"><span data-tour="sidebar-nav-new-session">New session</span></button></li><li id="utility" data-slot="sidebar-menu-item"><button data-sidebar="menu-button"><span data-tour="sidebar-nav-capabilities">Capabilities</span></button></li></ul><div class="group/section"><button class="group/section-label"><span><span id="heading">Sessions</span></span></button></div><div id="row" class="row-hover"><span id="title" class="text-[0.8125rem]">A conversation</span><span id="status" role="status">Working</span></div><input id="search" type="search"/></aside><div id="outside" data-slot="sidebar-menu-item">Other pane</div></body></html>`
  await b.call('Page.setDocumentContent',{frameId:(await b.call('Page.getFrameTree')).frameTree.frame.id,html})
  const read=()=>b.evaluate(`(()=>{const s=id=>getComputedStyle(document.getElementById(id));return{row:s('row').height,title:s('title').fontSize,heading:s('heading').fontSize,utility:s('utility').display,new:s('new').display,status:s('status').display,search:s('search').display,outside:s('outside').display}})()`)
  const v=await read();assert.equal(v.row,'28px');assert.equal(v.title,'13px');assert.equal(v.heading,'12px');assert.equal(v.utility,'none');for(const k of ['new','status','search','outside'])assert.notEqual(v[k],'none')
  await b.evaluate(`document.documentElement.dataset.codexSidebarDensity='comfortable'`)
  const normal=await read();assert.equal(normal.row,'32px');assert.equal(normal.title,'14px');assert.notEqual(normal.utility,'none')
 }finally{b.close()}
})

test('compact sidebar is the default and can be restored through a persisted palette toggle',async()=>{
 const attributes=new Map(),values=new Map(),registrations=[]
 const i=await loadPluginInternals(['__pluginDefault','readSidebarDensityMode','syncSidebarDensityRoot'],{document:{documentElement:{getAttribute:k=>attributes.get(k),setAttribute:(k,v)=>attributes.set(k,v)}},window:{dispatchEvent:()=>{},Event,location:{hash:'#/theme-test'}}})
 i.__pluginDefault.register({storage:{get:(k,f)=>values.has(k)?values.get(k):f,set:(k,v)=>values.set(k,v)},register:c=>registrations.push(c),onDispose:()=>{}})
 assert.equal(i.readSidebarDensityMode(),'compact');i.syncSidebarDensityRoot();assert.equal(attributes.get('data-codex-sidebar-density'),'compact')
 const command=registrations.find(r=>r.data?.id==='codex-chat-look.toggle-sidebar-density');assert.ok(command);command.data.run();assert.equal(values.get('sidebar-density'),'comfortable');assert.equal(attributes.get('data-codex-sidebar-density'),'comfortable');command.data.run();assert.equal(values.get('sidebar-density'),'compact')
})
