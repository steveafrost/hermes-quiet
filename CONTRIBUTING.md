# Contributing to Hermes Quiet

Hermes Quiet is independently maintained. Open issues and pull requests in
`steveafrost/hermes-quiet`; do not route them to the original Codex Skin project.

Preserve native Hermes behavior, accessibility, semantic status indicators and
configured fonts. Keep density/chrome preferences reversible and persisted. Use
supported SDK contributions and actions; do not reparent React-owned nodes.
Retain the compatibility plugin ID and theme name until a tested migration exists.

Before submitting, run the build, explicit ESM syntax check, full serial test suite,
checksum verification and `git diff --check` listed in README. Include regression
tests and rebuild the shipped mirror/checksum whenever source changes. Verify
both light/dark rendering and actual plugin loading for UI edits; distinguish
browser-fixture evidence from running-app verification.

Release builds carry matching BUILD_ID and manifest versions. Publish only this
repository's approved artifacts; leave binary self-replacement disabled until a
separately tested release/migration policy is deliberately enabled. Retain the
original MIT copyright and attribution when redistributing source or binaries.
