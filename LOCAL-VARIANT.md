# Approved local Catppuccin variant — v1.9.6

This checkout carries the approved Hermes Desktop customization on branch
`hermes-compat-update`. The live standalone plugin is installed at
`~/.hermes/desktop-plugins/codex-chat-look/`, outside the Hermes application/source.

## Included in the plugin

- Catppuccin Latte/Mocha with peach accents; stable theme identity `codex-chat`.
- Quiet surfaces and typography; configured Hermes font remains authoritative.
- Compact 28px session rows, right-side semantic indicators, hidden idle dots,
  hidden duplicate session kebab, keyboard-revealed search, hidden sidebar extras.
- Reversible persisted sidebar-density, sidebar-extras and titlebar options.
- SDK-contributed fleet dropdown: Laptop, Mr Chips, Scooter, Media (existing media
  profile on Mr Chips); canonical connection-qualified routing and status labels.
- Positioning, theme activation and cleanup are part of plugin lifetime.

No diagnostic/helper plugin is required. Gateway registrations and credentials
belong to Hermes, not this plugin or its recovery archive.

## Update safety

Normal Hermes application updates do not require reinstalling this standalone
user plugin. This installation has no `.hermes-package.json` managed-package
marker. The plugin's upstream self-replacement is disabled explicitly with
`createSkinUpdater(ctx.storage, undefined, undefined, false)`, including cached
release offers; `test/local-variant-update.test.mjs` verifies zero network requests
and zero file writes. Do not reinstall the original upstream plugin over this one.

This protects ownership of the files, not arbitrary future SDK or DOM changes.
Native-sidebar CSS depends on Hermes markup and can require compatibility edits.
Theme selection and plugin preferences are stored by Hermes; restoring files does
not restore a deleted Hermes user-data directory. Keep theme name and plugin ID
unchanged, and respect user enable/disable and appearance choices.

## Restore the approved files

From this checkout (after backing up any currently installed variant):

```sh
mkdir -p "$HOME/.hermes/desktop-plugins/codex-chat-look/desktop"
cp codex-chat-look/plugin.js "$HOME/.hermes/desktop-plugins/codex-chat-look/plugin.js"
cp codex-chat-look/desktop/plugin.js "$HOME/.hermes/desktop-plugins/codex-chat-look/desktop/plugin.js"
cp codex-chat-look/plugin.yaml "$HOME/.hermes/desktop-plugins/codex-chat-look/plugin.yaml"
```

Hermes watches this folder. If necessary use Command-K → Reload desktop plugins.
Enable Codex Skin in Plugins and select the `codex-chat` theme in Appearance if
those preferences were reset. The standalone recovery archive contains these
three files plus this guide and their SHA-256 hashes; it does not contain secrets.

## Carrying compatibility fixes forward

Merge upstream changes into this local branch, retaining the palette, settings,
fleet contribution and replacement guard. Before installing changed bytes:

```sh
node scripts/build-updater.mjs
CHROME_BIN='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
  node --test --test-concurrency=1 test/*.test.mjs
node --check --input-type=module < codex-chat-look/plugin.js
shasum -a 256 -c CHECKSUMS.sha256
git diff --check
```

Verify installed/source copies match; inspect actual menu, theme and sidebar
geometry in the running app after any compatibility change. Keep source, tests,
generated mirror, metadata and checksum changes together in Git. Public push or
release publication requires the user's approval.
