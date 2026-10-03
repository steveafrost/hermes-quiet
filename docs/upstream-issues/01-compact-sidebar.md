# Desktop SDK: host-owned sidebar density and chrome preferences beyond sessionListDensity

Draft only — not filed. Target: NousResearch/hermes-agent.

## Consumer and problem

Hermes Quiet is being revised for catalog admission following
[teknium1's review of PR #130940](https://github.com/NousResearch/hermes-agent/pull/130940#pullrequestreview-5397307521).
The prior version used native markup selectors to produce 28px session rows,
restrained sidebar typography, status indicators on the right, and reduced
search/extra/hover chrome. That implementation has been removed. The catalog
candidate uses `host.settings.sessionListDensity` for the supported native
compact/comfortable/detailed modes, without changing settings on enable.

This is a request for a missing supported seam, not a scanner exception. A theme
plugin should not query, observe, reparent or restyle host sidebar nodes.

## Existing SDK and remaining gap

Inspected main at `46904a3b467f62616f5b3ee247adce30b1b277a0`:

- `src/sdk/settings.ts` allowlists `sessionListDensity`;
  `src/store/session-list-density.ts` defines its three values.
- `src/app/chat/sidebar/session-row.tsx` makes comfortable/detailed rows taller;
  compact is the existing native row, not configurable geometry.
- `SIDEBAR_NAV_PREFS_AREA` hides/reorders top nav rows, not session sections,
  row spacing, search, connection/profile chrome, or activity indicators.
- Sidebar render slots can add plugin content; they cannot configure the native
  row renderer. The fleet dropdown can remain in a supported titlebar slot.

## Requested design

Consider a narrow, typed, declarative sidebar presentation contribution consumed
by core: bounded row-density/spacing presets, optional label typography presets,
and named visibility choices for nonessential search/secondary chrome. Preserve
host ownership of row rendering, focus, context menus, virtualization, hit targets,
and status semantics. Never expose DOM nodes, selectors, arbitrary CSS or callbacks
that rewrite native elements. A separate supported header slot is preferable to
absolute-positioning a fleet control over the native header.

Define conflicts explicitly: user setting precedence, deterministic contribution
order, and enable/disable teardown. Native `sessionListDensity` should remain the
user's choice; a plugin contribution should not silently overwrite it. Keep the
Plugins/settings escape path and active/error/working state visible.

## Acceptance and validation

1. A sample consumer requests compact rows/chrome solely through SDK data.
2. Disabling/reloading restores native presentation without stale persisted
   overrides; two simultaneous contributions resolve deterministically.
3. Keyboard focus, right-click menus, rename, drag/reorder, pinned/recents lists,
   activity states and long-list virtualization behave as before.
4. Check light/dark, small windows, text scaling and minimum pointer targets.
5. Desktop admission passes with no native DOM access.

Until this exists, Quiet retains native density only and explicitly drops the
custom row/chrome behavior. No exact 28px guarantee is requested where it would
conflict with accessibility or host layout.
