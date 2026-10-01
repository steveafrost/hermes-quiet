import assert from 'node:assert/strict'
import test from 'node:test'
import { chromium } from './helpers/chromium.mjs'
import { loadPluginInternals } from './helpers/load-plugin.mjs'

test('flat sessions retain active dots on the right instead of ages without a leading gutter', async()=>{
 const {CSS}=await loadPluginInternals(['CSS']);const b=await chromium()
 try{
 const lead=(grab)=>`<${grab?'button':'span'} id="lead${grab}" ${grab?'data-reorder-handle':''} class="grid size-3.5 shrink-0"><span id="dot${grab}" role="status" aria-label="Working" class="size-1.5 bg-(--ui-accent)"></span></${grab?'button':'span'}>`
 const row=grab=>`<div class="row-hover"><div class="cluster">${lead(grab)}<span class="title"><button><span class="hover-marquee">A conversation</span></button></span></div><div data-row-actions><div data-row-actions><span>25k<span class="tail"><time>31m</time></span></span><button aria-label="Session actions">⋮</button></div></div></div>`
 const html=`<html data-codex-chat-look="true" data-codex-sidebar-density="compact"><head><style>.row-hover{display:grid;grid-template-columns:minmax(0,1fr) auto;width:252px}.cluster{display:flex;padding:0 8px;gap:6px;align-items:center}.title{flex:1;min-width:0}.grid{display:grid;width:14px;height:14px}.size-1{display:block;width:4px;height:4px;background:grey}[data-row-actions]{display:flex;align-items:center}button{padding:0}${CSS}</style></head><body><aside data-slot="sidebar">${row(true)}${row(false)}</aside><time id="outside">3h</time></body></html>`
 await b.call('Page.setDocumentContent',{frameId:(await b.call('Page.getFrameTree')).frameTree.frame.id,html})
 const v=await b.evaluate(`(()=>{const rows=[...document.querySelectorAll('.row-hover')];return rows.map(r=>{const l=r.querySelector('.cluster').firstElementChild,t=r.querySelector('.title'),d=l.querySelector('span');return{lead:l.getBoundingClientRect().x,title:t.getBoundingClientRect().x,inset:t.getBoundingClientRect().x-r.getBoundingClientRect().x,dot:getComputedStyle(d).display,age:getComputedStyle(r.querySelector('time')).display,menu:getComputedStyle(r.querySelector('[aria-label]')).display}})})()`)
 for(const r of v){assert.ok(r.lead>r.title,'dot must be to the right of title');assert.ok(r.inset<=10,'no blank lead gutter');assert.notEqual(r.dot,'none');assert.equal(r.age,'none');assert.notEqual(r.menu,'none')}
 assert.notEqual(await b.evaluate(`getComputedStyle(document.getElementById('outside')).display`),'none')
 }finally{b.close()}
})
