import assert from 'node:assert/strict'
import test from 'node:test'

import { loadPluginInternals } from './helpers/load-plugin.mjs'

function rootFixture() {
  const attributes = new Map()

  return {
    attributes,
    document: {
      documentElement: {
        getAttribute: name => attributes.get(name) ?? null,
        removeAttribute: name => attributes.delete(name),
        setAttribute: (name, value) => attributes.set(name, String(value))
      }
    }
  }
}

async function pluginFixture(initialStorage = {}) {
  const values = new Map(Object.entries(initialStorage))
  const registrations = []
  const root = rootFixture()
  const internals = await loadPluginInternals(
    ['__pluginDefault', 'CSS', 'readTitlebarIconsMode', 'setTitlebarIconsMode', 'syncTitlebarIconsRoot'],
    {
      document: root.document,
      window: {
        dispatchEvent: () => {},
        Event,
        location: { hash: '#/theme-test' }
      }
    }
  )

  internals.__pluginDefault.register({
    storage: {
      get: (key, fallback) => values.has(key) ? values.get(key) : fallback,
      set: (key, value) => values.set(key, value)
    },
    onDispose: () => {},
    register: contribution => registrations.push(contribution)
  })

  return { internals, registrations, root, values }
}

test('Titlebar icons default to Hidden', async () => {
  const fixture = await pluginFixture()

  assert.equal(fixture.internals.readTitlebarIconsMode(), 'hidden')
  assert.equal(fixture.internals.syncTitlebarIconsRoot(), 'hidden')
  assert.equal(fixture.root.attributes.get('data-codex-titlebar-icons'), 'hidden')
})

test('palette setting toggles the titlebar icons back to All and persists it', async () => {
  const fixture = await pluginFixture()
  const command = fixture.registrations.find(item => item.id === 'toggle-titlebar-icons')

  assert.ok(command)
  assert.equal(command.data.label, 'Codex Skin: Titlebar icons')
  assert.equal(command.data.detail(), 'Hidden')

  command.data.run()
  assert.equal(fixture.values.get('titlebar-icons'), 'all')
  assert.equal(fixture.root.attributes.get('data-codex-titlebar-icons'), 'all')
  assert.equal(command.data.detail(), 'All')

  const reloaded = await pluginFixture({ 'titlebar-icons': fixture.values.get('titlebar-icons') })
  assert.equal(reloaded.internals.readTitlebarIconsMode(), 'all')
  assert.equal(reloaded.internals.syncTitlebarIconsRoot(), 'all')

  reloaded.internals.setTitlebarIconsMode('hidden')
  assert.equal(reloaded.values.get('titlebar-icons'), 'hidden')
  assert.equal(reloaded.root.attributes.get('data-codex-titlebar-icons'), 'hidden')
})

test('an unknown stored value falls back to Hidden', async () => {
  const fixture = await pluginFixture({ 'titlebar-icons': 'nonsense' })

  assert.equal(fixture.internals.readTitlebarIconsMode(), 'hidden')
})

test('the stylesheet hides every titlebar tool, the settings gear included', async () => {
  const fixture = await pluginFixture()
  const css = fixture.internals.CSS

  // Direct children of the fixed clusters only: slotted plugin contributions and
  // the right-rail pane tools keep rendering.
  assert.ok(
    css.includes(
      "html[data-codex-chat-look='true'][data-codex-titlebar-icons='hidden'] [data-titlebar-cluster] > button"
    )
  )
  assert.ok(!css.includes('codicon-settings-gear'), 'no titlebar glyph is spared')
  assert.ok(css.includes("[data-titlebar-cluster] > button {"))
  assert.ok(css.includes('display: none !important;'))
})
