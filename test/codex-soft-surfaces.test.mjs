import assert from 'node:assert/strict'
import test from 'node:test'
import { chromium } from './helpers/chromium.mjs'
import { loadPluginInternals } from './helpers/load-plugin.mjs'

test('Codex reference uses Mocha base and a subtly raised sidebar, including glass mode', async () => {
 const { CODEX_THEME, CSS } = await loadPluginInternals(['CODEX_THEME', 'CSS'])
 const b = await chromium()
 try {
  const c = CODEX_THEME.darkColors
  const html = `<!doctype html><html data-codex-chat-look="true" data-hermes-theme="codex-chat" data-hermes-mode="dark" data-hermes-glass><head><style>:root{--theme-background-seed:${c.background};--theme-sidebar-seed:${c.sidebarBackground};--theme-foreground:${c.foreground};--ui-bg-chrome:#101018;--ui-chat-surface-background:transparent;--ui-sidebar-surface-background:transparent;--ui-text-primary:${c.foreground};--dt-font-sans:system-ui}body{margin:0;background:var(--ui-bg-chrome)}[data-slot=sidebar]{background:var(--ui-sidebar-surface-background)}${CSS}</style></head><body><div data-tree-group="grp-sessions"><div data-slot="sidebar"><button data-sidebar="menu-button" data-slot="context-menu-trigger"><span>New session</span></button></div></div></body></html>`
  await b.call('Page.setDocumentContent', { frameId: (await b.call('Page.getFrameTree')).frameTree.frame.id, html })
  const styles = await b.evaluate(`(()=>{const read=s=>{const e=document.querySelector(s),c=getComputedStyle(e);return{background:c.backgroundColor,font:c.fontSize,color:c.color}};return{body:read('body'),rail:read('[data-tree-group]'),nav:read('button'),glass:document.documentElement.hasAttribute('data-hermes-glass')}})()`)
  assert.equal(styles.body.background, 'rgb(30, 30, 46)', 'main field matches reference Mocha base, not crust black')
  assert.equal(styles.rail.background, 'rgb(34, 34, 49)', 'sidebar has its own subtly elevated surface under glass')
  assert.equal(styles.nav.font, '14px', 'new context-menu wrapper must not erase sidebar-menu styling')
  assert.equal(styles.glass, true, 'do not toggle the user glass preference')
 } finally { b.close() }
})
