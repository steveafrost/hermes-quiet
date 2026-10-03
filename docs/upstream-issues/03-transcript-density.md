# Desktop SDK: host-rendered transcript density and disclosure preferences

Draft only — not filed. Target: NousResearch/hermes-agent.

## Consumer and problem

[teknium1's review on PR #130940](https://github.com/NousResearch/hermes-agent/pull/130940#pullrequestreview-5397307521)
asks Hermes Quiet to remove native transcript queries and open an issue for the
missing density seam. Its old implementation walked turn pairs and thread
viewports, restyled spacing, relocated/cloned status content, and offered a clean
transcript/history presentation. These implementations and commands are removed
from the catalog candidate. This proposal must preserve tool/error/approval
information and host streaming/history semantics, not cosmetically hide evidence.

## Existing surface and gap

Inspected main `46904a3b467f62616f5b3ee247adce30b1b277a0`:
`src/themes/types.ts` provides palette and font-family fields and explicitly keeps
layout/line height in the stylesheet. Theme color tokens can preserve Latte/Mocha
but do not configure native turn spacing or transcript line height.
`src/sdk/settings.ts` exposes `reasoning.collapsedByDefault`, which is a specific
reasoning disclosure preference, not general transcript density or tool-group
presentation. Composer slots and session-management verbs do not provide native
turn-renderer presentation controls. Existing reasoning preferences should not be
silently changed by a theme plugin.

## Requested design

Consider bounded, typed transcript presentation presets for text size/line height,
turn spacing and host-owned disclosure grouping. Core renders and owns the actual
turns. If an auxiliary history/status rail is desired, supply a documented slot
with readonly, scoped turn summaries and stable durable identities; do not expose
React-owned nodes or internal store references.

Require explicit user opt-in for disclosure changes, retained access to complete
content, and invariant visibility for active work, errors, approvals and safety
notices. A visual preference must not mutate saved conversation content, reorder
messages or change prompt caching. Historical tool outputs remain discoverable
through a clear expansion affordance. Bound spacing for text scaling and reading
accessibility. Define user-preference precedence, multi-plugin arbitration and
registry teardown; never overwrite global settings at plugin registration.

## Acceptance and validation

1. A consumer requests density through SDK data only; Desktop admission passes.
2. Streaming, finalization, tool progress/errors, approvals and reasoning
   disclosure remain correct; text selection/copy and reference links still work.
3. Restored history, pagination and long transcripts maintain scroll anchors,
   virtualization and correct durable/session identity across profile switches.
4. Plugin reload/disable restores presentation without altering saved messages or
   leaving stale decorations. Two consumers arbitrate predictably.
5. Verify light/dark, split panes, large text, keyboard navigation, screen readers,
   reduced motion and no composer occlusion.

Until then, Quiet retains native transcript rendering and drops its clean-mode,
history rail, pinned-prompt overrides and custom status presentation. A hook that
only controls spacing would still be useful independently of disclosure features.
