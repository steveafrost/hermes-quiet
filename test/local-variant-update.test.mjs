import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { loadPluginInternals } from './helpers/load-plugin.mjs'

test('local Catppuccin variant rejects upstream replacement and cached update offers', async () => {
  const { createSkinUpdater, UPDATE_REPO } = await loadPluginInternals(['createSkinUpdater', 'UPDATE_REPO'], { setTimeout, clearTimeout })
  let writes = 0, requests = 0
  const updater = createSkinUpdater({ get: () => null }, {
    desktopPluginsRoot: async () => '/local/desktop-plugins',
    readPluginSource: async () => ({ text: '', truncated: false }),
    writeTextFile: async () => { writes++ }
  }, async () => { requests++; throw new Error('unexpected request') }, false)
  try {
    assert.equal(updater.capable, false)
    updater.accept({ releases: [{ tag_name: 'v99.0.0', assets: [{ id: 1, name: 'plugin.js', size: 100, digest: 'sha256:' + 'a'.repeat(64), url: `https://api.github.com/repos/${UPDATE_REPO}/releases/assets/1` }] }] })
    assert.equal(updater.state.target, null)
    assert.equal(updater.state.phase, 'idle')
    await assert.rejects(updater.initialize(), /does not support local plugin updates/)
    await updater.install()
    assert.equal(writes, 0)
    assert.equal(requests, 0)
    const source = await readFile(new URL('../codex-chat-look/plugin.js', import.meta.url), 'utf8')
    assert.match(source, /createSkinUpdater\(ctx\.storage, undefined, undefined, false\)/)
  } finally { updater.dispose() }
})
