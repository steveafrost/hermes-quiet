import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
const source = await readFile(new URL('../codex-chat-look/plugin.js', import.meta.url))
const check = spawnSync(process.execPath, ['--check', '--input-type=module'], { input: source, encoding: 'utf8' })
if (check.status !== 0) throw new Error(check.stderr || 'Plugin did not parse')
await writeFile(new URL('../codex-chat-look/desktop/plugin.js', import.meta.url), source)
const digest = createHash('sha256').update(source).digest('hex')
await writeFile(new URL('../CHECKSUMS.sha256', import.meta.url), `${digest}  codex-chat-look/plugin.js\n${digest}  codex-chat-look/desktop/plugin.js\n`)
console.log(JSON.stringify({ digest, bytes: source.length }))
