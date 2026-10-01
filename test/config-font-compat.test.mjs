import assert from 'node:assert/strict'
import test from 'node:test'
import { chromium } from './helpers/chromium.mjs'
import { loadPluginInternals } from './helpers/load-plugin.mjs'

test('chat font honors Hermes live font token while retaining its theme fallback', async () => {
  const { CSS } = await loadPluginInternals(['CSS'])
  const b = await chromium()
  try {
    await b.call('Page.setDocumentContent', { frameId: (await b.call('Page.getFrameTree')).frameTree.frame.id, html: `<!doctype html><html data-codex-chat-look="true"><head><style>${CSS}</style></head><body><div data-slot="aui_assistant-message-content"><p class="aui-md">Chat</p></div><input data-slot="composer-rich-input"><button>Control</button></body></html>` })
    const families = () => b.evaluate(`['body','p','input','button'].map(s => getComputedStyle(document.querySelector(s)).fontFamily)`)
    const fallback = await families()
    assert.ok(fallback.every(f => f.includes('system-ui')))
    await b.evaluate(`document.documentElement.style.setProperty('--dt-font-sans', '"Atkinson Hyperlegible", serif')`)
    assert.ok((await families()).every(f => f.includes('Atkinson Hyperlegible')))
    await b.evaluate(`document.documentElement.style.setProperty('--dt-font-sans', '"OpenDyslexic", sans-serif')`)
    assert.ok((await families()).every(f => f.includes('OpenDyslexic')))
  } finally { b.close() }
})
