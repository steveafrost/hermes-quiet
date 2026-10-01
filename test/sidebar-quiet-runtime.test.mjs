import assert from 'node:assert/strict'
import test from 'node:test'
import { chromium } from './helpers/chromium.mjs'
import { loadPluginInternals } from './helpers/load-plugin.mjs'

test('quiet sidebar keeps comfortable hit targets, restrained headings, keyboard focus and status cues', async () => {
 const { CODEX_THEME, CSS } = await loadPluginInternals(['CODEX_THEME','CSS'])
 const b=await chromium()
 try {
  const c=CODEX_THEME.darkColors
  const html=`<!doctype html><html data-codex-chat-look="true" data-hermes-theme="codex-chat" data-hermes-mode="dark"><head><style>:root{--theme-background-seed:${c.background};--theme-sidebar-seed:${c.sidebarBackground};--theme-foreground:${c.foreground};--ui-chat-surface-background:${c.background};--ui-sidebar-surface-background:${c.sidebarBackground};--ui-text-primary:${c.foreground};--dt-ring:${c.ring};--dt-primary:${c.primary};--dt-font-sans:system-ui}*{box-sizing:border-box}.row-hover,button{height:26px}button{border:0}[role=status]{display:inline-block;width:8px;height:8px;background:#a6e3a1}${CSS}</style></head><body><div data-tree-group="grp-sessions"><aside data-slot="sidebar"><button id="nav" data-sidebar="menu-button" data-slot="context-menu-trigger">New session</button><div class="group/section"><button class="group/section-label"><span><span id="heading">Sessions</span></span></button></div><div id="row" class="row-hover" tabindex="0" data-working="true"><span class="text-[0.8125rem]">Current conversation</span><span id="working" role="status" aria-label="Session running"></span><span id="done" role="status" class="bg-emerald-500"></span></div></aside></div></body></html>`
  await b.call('Page.setDocumentContent',{frameId:(await b.call('Page.getFrameTree')).frameTree.frame.id,html})
  const v=await b.evaluate(`(()=>{const s=id=>getComputedStyle(document.getElementById(id));document.getElementById('row').focus();return{nav:s('nav').height,row:s('row').height,heading:s('heading').fontWeight,focus:s('row').outlineWidth,focusColor:s('row').outlineColor,workingShadow:s('working').boxShadow,doneShadow:s('done').boxShadow,visible:['working','done'].every(id=>s(id).display!=='none'&&s(id).opacity==='1')}})()`)
  assert.equal(v.nav,'32px')
  assert.equal(v.row,'32px')
  assert.equal(v.heading,'400')
  assert.equal(v.focus,'2px')
  assert.equal(v.focusColor,'rgb(250, 179, 135)')
  assert.equal(v.workingShadow,'none')
  assert.equal(v.doneShadow,'none')
  assert.equal(v.visible,true)
 } finally {b.close()}
})
