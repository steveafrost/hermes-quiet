# Hermes Quiet

A quiet, Catppuccin-powered interface plugin for Hermes Desktop. Independently
maintained by steveafrost, derived from FPSUnleashed's MIT-licensed Codex Skin.

## Included

- Catppuccin Latte/Mocha with peach accents and the configured Hermes font.
- Compact 28px sidebar rows, restrained typography and softer surfaces.
- Active session indicators on the right; idle dots and duplicate hover menus hidden.
- Keyboard-revealed search and reversible sidebar/chrome preferences.
- A native SDK gateway/profile dropdown with connection-qualified switching,
  status descriptions and a current-selection checkmark.
- Native right-click actions, working indicators, voice controls and session behavior.

The current fleet aliases are Laptop, Mr Chips, Scooter and Media. Media maps to
an existing `media` profile on Mr Chips; other registered gateways remain discoverable.
These display aliases are not gateway registrations and no credentials ship here.

## Install or update

```sh
git clone https://github.com/steveafrost/hermes-quiet.git
cd hermes-quiet
shasum -a 256 -c CHECKSUMS.sha256
mkdir -p "$HOME/.hermes/desktop-plugins/codex-chat-look/desktop"
cp codex-chat-look/plugin.js "$HOME/.hermes/desktop-plugins/codex-chat-look/plugin.js"
cp codex-chat-look/desktop/plugin.js "$HOME/.hermes/desktop-plugins/codex-chat-look/desktop/plugin.js"
cp codex-chat-look/plugin.yaml "$HOME/.hermes/desktop-plugins/codex-chat-look/plugin.yaml"
```

Back up an existing installation before replacing it. Hermes hot-reloads local
plugins; Command-K → Reload desktop plugins is the fallback. Enable **Hermes Quiet**
in Plugins and select **Hermes Quiet · Catppuccin** in Appearance if needed.

**Compatibility identity:** the plugin ID/folder stays `codex-chat-look` and the
theme name stays `codex-chat`. This intentionally preserves existing settings and
selection; do not install the original Codex Skin alongside this replacement.
Command-palette preferences now use the **Hermes Quiet:** prefix.

## Ownership and updates

This is a standalone repository, not a GitHub fork. Original source history and
MIT credit are retained. Changes and future releases are maintained here, with
no automatic merging or downloads from the original project. The release helper
is pointed at this repository, but binary self-replacement remains disabled.
Updates are explicit, tested installs; no release is implied by a source commit.

User plugins live outside Hermes application files. Ordinary application updates
should retain the files, but future SDK or native-markup changes can need
compatibility fixes. See [LOCAL-VARIANT.md](LOCAL-VARIANT.md) for recovery and
[CONTRIBUTING.md](CONTRIBUTING.md) for verification.

## Development

```sh
node scripts/build-updater.mjs
node --check --input-type=module < codex-chat-look/plugin.js
CHROME_BIN='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
  node --test --test-concurrency=1 test/*.test.mjs
shasum -a 256 -c CHECKSUMS.sha256
git diff --check
```

Browser-backed tests require Chrome/Chromium. CI runs serially to avoid browser
startup contention. Source, generated desktop mirror and checksum must agree.

## Credits

Based on [FPSUnleashed/hermes-codex-skin](https://github.com/FPSUnleashed/hermes-codex-skin),
with the original copyright and MIT license preserved. This is an independent
community project, not endorsed by Nous Research, OpenAI or the original author.
