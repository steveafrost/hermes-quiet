import assert from 'node:assert/strict'
import test from 'node:test'
import { loadPluginInternals } from './helpers/load-plugin.mjs'

test('register and render use contributions without touching native DOM, bridge, storage or network', async () => {
  const forbidden = new Proxy({}, { get() { throw new Error('Forbidden native access') } })
  let density = 'detailed'
  const registrations = []
  const atom = value => ({ get: () => value })
  const host = {
    state: { profile: atom('default'), gateway: atom('open') },
    activeConnectionId: () => 'local',
    settings: { get: key => { assert.equal(key, 'sessionListDensity'); return density }, set: (key, value) => { assert.equal(key, 'sessionListDensity'); density = value } }
  }
  const { plugin } = await loadPluginInternals([], {
    document: forbidden, window: forbidden, fetch: () => { throw new Error('Unexpected request') }, host,
    useValue: atom => atom.get(), useState: value => [value, () => {}], useRef: value => ({ current: value }),
    useQuery: () => ({ data: { connections: [{ id: 'local', kind: 'local', label: 'Local' }], roster: {} } }),
    jsx: (type, props) => ({ type, props }), DropdownMenu: 'menu', DropdownMenuTrigger: 'trigger', DropdownMenuContent: 'content', DropdownMenuItem: 'item', DropdownMenuSeparator: 'separator', Codicon: 'icon'
  })
  plugin.register({ storage: forbidden, register: entry => registrations.push(entry) })
  assert.deepEqual(registrations.map(r => r.area).sort(), ['palette', 'themes', 'titleBar.left'])
  const theme = registrations.find(r => r.area === 'themes').data
  assert.equal(plugin.id, 'codex-chat-look'); assert.equal(theme.name, 'codex-chat')
  for (const colors of [theme.colors, theme.darkColors]) for (const value of Object.values(colors)) assert.match(value, /^#[0-9a-f]{6}$/i)
  const command = registrations.find(r => r.area === 'palette').data
  assert.equal(command.detail(), 'detailed'); command.run(); assert.equal(density, 'compact'); command.run(); assert.equal(density, 'comfortable'); command.run(); assert.equal(density, 'detailed')
  const slot = registrations.find(r => r.area === 'titleBar.left').render()
  const rendered = slot.type(slot.props)
  assert.equal(rendered.props.children.props.children[0].props.children.props['aria-label'], 'Switch gateway or profile: Laptop')
})

test('switching uses connection-qualified host routes and is inert for the already active route', async () => {
  const calls = []
  const { switchHeaderProfile } = await loadPluginInternals(['switchHeaderProfile'], { host: {
    state: { profile: { get: () => 'default' } }, activeConnectionId: () => 'local',
    ensureAgent: async (...args) => calls.push(args)
  } })
  await switchHeaderProfile('default', 'local'); assert.equal(calls.length, 0)
  await switchHeaderProfile('default', 'remote'); await switchHeaderProfile('media', 'remote')
  assert.deepEqual(calls, [['remote', 'default'], ['remote', 'media']])
})
