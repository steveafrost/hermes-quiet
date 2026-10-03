# Hermes Quiet

A Catppuccin theme and native gateway/profile dropdown for Hermes Desktop.
Independently maintained by steveafrost, derived from FPSUnleashed's MIT-licensed
Codex Skin. Version 2.0.0 is a catalog-compatible source candidate.

The plugin contributes Latte/Mocha palettes with peach accents through
`THEMES_AREA`, and renders its own dropdown through `TITLEBAR_AREAS.left`.
Gateway enumeration and connection-qualified switching use SDK host verbs.
The palette command **Hermes Quiet: Native session list density** cycles the
host's compact, comfortable and detailed modes through `host.settings`.
It changes that shared setting only when invoked; registration never changes
user settings, theme selection or old plugin storage.

The plugin ID stays `codex-chat-look` and theme name stays `codex-chat`, preserving
selection compatibility. Old layout preference keys are left intact but inert.
Do not install the original Codex Skin alongside this replacement.

## Feature tradeoffs

Native sidebar, composer, titlebar controls and transcript retain host layout.
The custom 28px sidebar rows, relocated status dots, hidden search/extras and
hover controls, composer width/chrome/voice restyling, titlebar icon hiding,
pinned-prompt changes, history rail, clean transcript and status drawer are
removed because they depended on native markup. The fleet control stays in its
SDK titlebar slot rather than being positioned over the sidebar. Its SDK menu
uses the host's normal appearance and accessibility.

Native density is a partial substitute: it does not offer Quiet's custom row
geometry or chrome. No removed preference is advertised as a working command.
The three missing-hook issue drafts live under `docs/upstream-issues/`.

## Updates and installation

There is no updater runtime, release downloader, native file bridge or update
button. Catalog updates must use a reviewed source pin and the Hermes plugin
manager. This local candidate is not a published release or install instruction.
The full 40-character source commit must be published and reviewed before the
catalog pin can be changed. No installation is performed by development tests.

## Development

```sh
node scripts/build.mjs
node --check --input-type=module < codex-chat-look/plugin.js
node --test --test-concurrency=1 test/*.test.mjs
shasum -a 256 -c CHECKSUMS.sha256
git diff --check
```

Build copies the authored plugin to `desktop/plugin.js` and checksums both.
The current suite tests retained SDK behavior. Historical DOM/updater tests are
removed together with those features; v1.9.7 and its tests remain in Git history.
See `docs/VALIDATION.md` for validation evidence and browser-fixture limits.

## Credits

Based on [FPSUnleashed/hermes-codex-skin](https://github.com/FPSUnleashed/hermes-codex-skin),
with original copyright, MIT license and history preserved. Independent community
project, not endorsed by Nous Research, OpenAI or the original author.
