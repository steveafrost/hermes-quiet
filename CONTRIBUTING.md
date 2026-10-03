# Contributing to Hermes Quiet

Hermes Quiet is independently maintained. Open issues and pull requests in
`steveafrost/hermes-quiet`; do not route them to the original Codex Skin project.

Preserve native Hermes behavior, accessibility, semantic status indicators and
configured fonts. Use host-owned density settings only through the allowlisted host.settings API. Use
supported SDK contributions and actions; do not reparent React-owned nodes.
Retain the compatibility plugin ID and theme name until a tested migration exists.

Before submitting, run the build, explicit ESM syntax check, full serial test suite,
checksum verification and `git diff --check` listed in README. Include regression
tests and rebuild the shipped mirror/checksum whenever source changes. Verify
both light/dark rendering and actual plugin loading for UI edits; distinguish
browser-fixture evidence from running-app verification.

The manifest carries the release version. Never add self-updating code to this
catalog candidate; updates use reviewed catalog SHA pins. Publish only approved
artifacts. Retain the
original MIT copyright and attribution when redistributing source or binaries.
