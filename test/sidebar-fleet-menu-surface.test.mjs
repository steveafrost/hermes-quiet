import assert from 'node:assert/strict'
import test from 'node:test'
import {chromium} from './helpers/chromium.mjs'
import {loadPluginInternals} from './helpers/load-plugin.mjs'
test('fleet menu paints an opaque Catppuccin surface and peach selection using actual host tokens',async()=>{
const {CSS}=await loadPluginInternals(['CSS']);const b=await chromium();try{
await b.call('Page.setDocumentContent',{frameId:(await b.call('Page.getFrameTree')).frameTree.frame.id,html:`<html data-codex-chat-look="true" data-hermes-theme="codex-chat" data-hermes-mode="dark"><style>${CSS}</style><style>html{--theme-elevated-seed:rgb(49,50,68);--theme-foreground:rgb(205,214,244);--dt-primary:rgb(250,179,135);--theme-background-seed:rgb(30,30,46)}</style><body><div data-codex-profile-menu><div role="menuitemradio" data-codex-fleet-choice="local::default"><span class="codex-fleet-check">✓</span><span class="codex-fleet-choice-detail">This Mac</span></div></div></body></html>`})
const styles=await b.evaluate(`(()=>{const menu=document.querySelector('[data-codex-profile-menu]');return {background:getComputedStyle(menu).backgroundColor,radius:getComputedStyle(menu).borderRadius,check:getComputedStyle(document.querySelector('.codex-fleet-check')).color,shadow:getComputedStyle(menu).boxShadow}})()`)
assert.equal(styles.background,'rgb(49, 50, 68)');assert.equal(styles.check,'rgb(250, 179, 135)');assert.equal(styles.radius,'12px');assert.notEqual(styles.shadow,'none')
}finally{b.close()}
})
