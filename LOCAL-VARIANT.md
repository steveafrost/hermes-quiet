# Preservation and recovery

Plugin ID `codex-chat-look` and theme name `codex-chat` remain stable. Version
2.0.0 leaves legacy layout preferences untouched, but no longer applies them.
The existing installed v1.9.7 is separate from this prepared source revision.

Gateway registrations, credentials, theme selection and native density live in
Hermes user data. They are not packaged in this repository. No installation,
reload or service restart is part of this local preparation.

Use reviewed catalog pins for updates. The self-updater and its source/build
path were removed entirely. Restore earlier source and regression tests from
Git history only if deliberately returning to the standalone v1.9.7 behavior.
