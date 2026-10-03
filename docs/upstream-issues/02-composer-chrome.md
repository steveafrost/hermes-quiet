# Desktop SDK: declarative composer presentation preferences without native DOM access

Draft only — not filed. Target: NousResearch/hermes-agent.

## Consumer and problem

In [PR #130940's requested changes](https://github.com/NousResearch/hermes-agent/pull/130940#pullrequestreview-5397307521),
Hermes Quiet must replace native composer restyling with supported SDK hooks.
Its previous narrower composer, restrained controls and status chrome relied on
queries, observers, animation/cloning and selectors over host markup. All of
that has been removed from the catalog candidate, including the status drawer
and update controls. The composer now uses native layout and behavior.

## Existing surface and gap

Main inspected at `46904a3b467f62616f5b3ee247adce30b1b277a0`:
`website/docs/developer-guide/desktop-plugin-sdk.md` documents `COMPOSER_AREAS`
slots, model-pill label providers and `host.composer` draft/focus/submit verbs.
These support contributed content and intentional input actions, not replacing
or configuring native control layout. `src/sdk/settings.ts` exposes popout
gestures, not composer width or chrome density. `src/themes/types.ts` has
`composerRing` and palette/typography fields; its contract leaves layout,
sizing/radius and line height in the host stylesheet.

No slot needs to be abused to clone native activity or voice controls. The
removed self-updater is unrelated and should stay removed permanently.

## Requested design

Provide a small typed presentation contribution, or an allowlisted user setting
if the feature is inherently user-owned, for host-supported composer width and
chrome-density presets. Core chooses bounded responsive geometry and keeps the
input editor, attachments, model selection, voice/recording/playback, approval
and stop/send controls authoritative. If activity-summary customization is
supported, expose typed readonly status state plus a dedicated slot; never
return mutable status elements or require copying their text from the DOM.

State precedence and lifecycle should be documented: explicit user preferences
win; disabling a declarative contribution removes its effects; multiple plugins
arbitrate deterministically. Do not persist a plugin's temporary override into
unrelated global settings. Render-slot children can style themselves with theme
tokens, but cannot hide or move host siblings.

## Acceptance and validation

1. A sample plugin can request bounded composer presentation without selectors,
   raw file/native bridges, observers, global CSS or cloned controls.
2. Input text and reference chips survive a preference change, profile/session
   switch and plugin disable/reload. No duplicate submissions or focus stealing.
3. Send/stop, attachments, slash/reference menus, voice capture/playback,
   streaming status and approval prompts remain available and accessible.
4. Exercise light/dark, narrow windows, split panes, popouts, keyboard navigation,
   reduced motion and large text. Verify no transcript occlusion.
5. Test two competing contributions and no-contribution fallback; admission passes.

Until these hooks exist, Quiet offers theme colors and an independent titlebar
fleet dropdown while leaving composer geometry/chrome entirely to Hermes.
