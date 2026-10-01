# Hermes Quiet — preservation and recovery

Canonical repository: `steveafrost/hermes-quiet`, branch `main`.
Local checkout: `~/Development/hermes-quiet`.

The complete look, preferences and fleet dropdown live inside the standalone
plugin at `~/.hermes/desktop-plugins/codex-chat-look/`, not in the application.
The plugin ID `codex-chat-look`, theme name `codex-chat` and persisted keys remain
unchanged to preserve the approved configuration after rebranding.

The plugin has no required helper/probe plugins and no package ownership marker.
Gateway registrations, credentials, theme selection and preferences remain in
Hermes user data; a plugin archive does not back up or reconstruct that data.

Self-replacement is disabled with
`createSkinUpdater(ctx.storage, undefined, undefined, false)`. Regression tests
cover cached offers, zero requests and zero writes. The dormant release helper
now targets `steveafrost/hermes-quiet`, never the original author's releases.

For restoration, back up the installed folder, then copy the three files using
the explicit README destinations. Use Command-K → Reload desktop plugins if
necessary. Re-enable Hermes Quiet and select its Catppuccin theme only if those
preferences were reset; never force user appearance choices at every startup.

Before deployment, run the complete README verification contract and compare
each installed file with its source counterpart. Preserve the original MIT
license and history. Future Hermes SDK/DOM changes may require compatibility
edits; ordinary application replacement and plugin replacement are separate risks.

The earlier `hermes-codex-skin` checkout, fork and v1.9.6 recovery archive remain
available as a historical fallback, but new development belongs here. Never
blindly merge upstream or overwrite this installation with the original plugin.
