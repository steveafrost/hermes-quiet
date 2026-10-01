import assert from 'node:assert/strict'
import test from 'node:test'
import {chromium} from './helpers/chromium.mjs'
import {loadPluginInternals} from './helpers/load-plugin.mjs'

test('reference typography uses regular sidebar labels, quiet captions and unflattened prose emphasis',async()=>{
 const {CSS}=await loadPluginInternals(['CSS']);const b=await chromium()
 try{
 const html=`<html data-codex-chat-look="true" data-hermes-theme="codex-chat" data-hermes-mode="dark" data-codex-sidebar-density="compact"><head><style>:root{--dt-font-sans:system-ui;--theme-foreground:#cdd6f4;--theme-background-seed:#1e1e2e;--theme-sidebar-seed:#222231;--ui-sidebar-surface-background:#222231;--ui-chat-surface-background:#1e1e2e;--ui-text-primary:#cdd6f4}.row-hover{height:28px}.native{font-weight:600;font-size:10px;letter-spacing:1px;text-transform:uppercase}.text-\\[0\\.8125rem\\]{font-weight:500}strong{font-weight:700}code{font-family:monospace}${CSS}</style></head><body><aside data-slot="sidebar"><div class="group/section"><button class="group/section-label"><span><span id="heading">Projects</span></span></button></div><div class="row-hover" id="row"><span id="title" class="hover-marquee text-[0.8125rem]">tiny-gifs</span><span id="status" role="status" style="color:rgb(64,194,119)">Working</span></div><div class="group/workspace"><button><span id="project" class="text-[0.8125rem]">Development</span></button><span id="date" class="native text-[0.64rem]">Yesterday</span></div></aside><div data-slot="aui_assistant-message-content"><div class="aui-md"><p id="body">Most are finished: <strong id="strong">done</strong> <code id="code">command</code></p></div></div></body></html>`
 await b.call('Page.setDocumentContent',{frameId:(await b.call('Page.getFrameTree')).frameTree.frame.id,html})
 const v=await b.evaluate(`(()=>{const s=id=>{const e=document.getElementById(id),c=getComputedStyle(e);return{size:c.fontSize,weight:c.fontWeight,color:c.color,ink:(()=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');ctx.fillStyle=c.color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].slice(0,3)})(),tracking:c.letterSpacing,case:c.textTransform,line:c.lineHeight,family:c.fontFamily}};return Object.fromEntries(['title','project','heading','date','body','strong','code','status'].map(id=>[id,s(id)]))})()`)
 for(const id of ['title','project']){assert.equal(v[id].size,'14px');assert.equal(v[id].weight,'400');assert.ok(v[id].ink.every((x,i)=>Math.abs(x-[180,187,215][i])<=2),'label tint matches sampled reference within rounding')}
 assert.equal(v.heading.size,'14px');assert.equal(v.heading.weight,'400');assert.ok(v.heading.ink.every((x,i)=>Math.abs(x-[99,101,122][i])<=2),'caption tint matches sampled reference within rounding')
 assert.equal(v.date.size,'12px');assert.equal(v.date.weight,'400');assert.equal(v.date.tracking,'normal');assert.equal(v.date.case,'none')
 assert.equal(v.body.color,'rgb(205, 214, 244)');assert.equal(v.body.weight,'400');assert.equal(v.body.size,'14px');assert.equal(v.body.line,'22px');assert.equal(v.strong.weight,'600');assert.equal(v.code.family,'monospace');assert.equal(v.status.color,'rgb(64, 194, 119)')
 assert.equal(await b.evaluate(`getComputedStyle(document.getElementById('row')).height`),'28px')
 await b.evaluate(`document.documentElement.style.setProperty('--dt-font-sans','Arial')`)
 assert.equal(await b.evaluate(`getComputedStyle(document.getElementById('body')).fontFamily`),'Arial')
 }finally{b.close()}
})
