# Security Policy

## Supported versions

Security fixes are applied to the latest stable release.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting for this repository when available. Otherwise, open a minimal issue asking for a private contact path without publishing exploit details, credentials or private conversation data.

## Trust model

Hermes Desktop loads local plugins into the renderer with full app authority. Plugin loading provides error isolation, not a security sandbox. Review the source and verify the published SHA-256 before installation.

The plugin has no separate Python backend. Its fleet dropdown uses Hermes host APIs to enumerate connections/agents and switch the selected route. Binary self-replacement is disabled; the retained release helper is scoped to steveafrost/hermes-quiet. Gateway credentials and private user data must never be included in reports or plugin packages.
