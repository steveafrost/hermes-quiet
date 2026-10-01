import assert from 'node:assert/strict'
import test from 'node:test'
import { chromium } from './helpers/chromium.mjs'
import { loadPluginInternals } from './helpers/load-plugin.mjs'

test('session hover kebab is hidden without hiding chips, status or other menus',async()=>{
 const {CSS}=await loadPluginInternals(['CSS']);const b=await chromium()
 try{
 const html=`<html data-codex-chat-look="true"><head><style>.row-hover{width:250px;height:28px}.row-hover:hover button{display:block}${CSS}</style></head><body><aside data-slot="sidebar"><div id="row" class="row-hover"><span class="hover-marquee">A session</span><span id="status" role="status">Working</span><div data-row-actions><span id="chip">PR 12</span><button id="kebab"><i class="codicon codicon-kebab-vertical"></i></button><button id="chip-action">PR details</button></div></div><button id="section-menu"><i class="codicon-kebab-vertical"></i></button></aside><button id="outside"><i class="codicon-kebab-vertical"></i></button><script>document.getElementById('row').addEventListener('contextmenu',e=>{e.preventDefault();document.documentElement.dataset.contextOpened='true'})</script></body></html>`
 await b.call('Page.setDocumentContent',{frameId:(await b.call('Page.getFrameTree')).frameTree.frame.id,html})
 const read=()=>b.evaluate(`Object.fromEntries(['kebab','chip','status','chip-action','section-menu','outside'].map(id=>[id,getComputedStyle(document.getElementById(id)).display]))`)
 assert.equal((await read()).kebab,'none')
 const rect=await b.evaluate(`(()=>{const r=document.getElementById('row').getBoundingClientRect();return{x:r.x+10,y:r.y+10}})()`)
 await b.call('Input.dispatchMouseEvent',{type:'mouseMoved',...rect})
 const v=await read();assert.equal(v.kebab,'none');for(const id of ['chip','status','chip-action','section-menu','outside'])assert.notEqual(v[id],'none')
 await b.call('Input.dispatchMouseEvent',{type:'mousePressed',button:'right',buttons:2,clickCount:1,...rect});await b.call('Input.dispatchMouseEvent',{type:'mouseReleased',button:'right',buttons:0,clickCount:1,...rect})
 assert.equal(await b.evaluate(`document.documentElement.dataset.contextOpened`),'true')
 }finally{b.close()}
})
