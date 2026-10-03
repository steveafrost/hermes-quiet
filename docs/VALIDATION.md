# Local catalog candidate validation

Prepared from reviewed plugin commit
`6db9d1f5da3e987e0c96df85664c3396b865f84f` on branch
`catalog/sdk-compatible`. Current upstream SDK/validator source inspected at
`46904a3b467f62616f5b3ee247adce30b1b277a0`; catalog PR head inspected at
`35933f1c6dbb2af8200639ff5bdfbf7a4a2ccb21`.

Review: https://github.com/NousResearch/hermes-agent/pull/130940#pullrequestreview-5397307521

## Passed

- `node scripts/build.mjs`: authored ESM copied to shipped desktop mirror,
  SHA-256 recorded for both copies. Both are 180 lines, down from 4,763.
- ESM syntax checks; 5/5 retained plugin behavior tests; checksum verification;
  `git diff --check`.
- Current `hermes plugins validate` CLI against this local candidate: manifest,
  declared fields, loadability, dependencies, collisions, core override and desktop
  surface checks pass; security verdict **safe**. Python capability probe is
  explicitly skipped because this is a desktop-only package with no `__init__.py`.
- Both JS copies have zero current desktop admission findings. Manual source
  review confirms no DOM queries/observers/clones/global stylesheet injection,
  native file bridge, updater, credential-file reader or second-stage loader.
  Catalog self-update grep has no possible hit: candidate JS contains none of
  its GitHub-fetch patterns or file-write APIs.
- Current SDK vitest suites: runtime-loader, settings, theme request and React
  slot — **42/42 tests, 4/4 files** using the isolated checkout's locked JS deps.
- Headless Chrome fixture with actual React and the current SDK's Radix dropdown:
  keyboard open, active-route marking, qualified host switching, light/dark token
  inheritance, native sentinel preservation and no renderer errors pass.
- Full current upstream catalog structural validation: **417 valid files**, one
  unrelated warning for `agent_memory_es.yaml`'s ignored `homepage_url` field.
- Focused upstream Python runner: **13/13 catalog tests; 23/24 validator tests**.

## Failed upstream test

`tests/hermes_cli/test_plugin_validate.py::test_portable_validation_fails_orphan_and_reports_availability`
fails on unchanged upstream source. It asserts the portable server availability
`detail` equals `missing_app` or `unsupported_os`; macOS actually reports
`missing_app, path <temporary example-app path>`. Independent reproduction returns
that detail with a passing server-availability check and safe scan. This test has
no Hermes Quiet input. No upstream code/test was altered to conceal the failure.
The runner retried the file and reproduced the failure.

## Limits and not run

No running Hermes app installation, hot reload, service restart, native live fleet
switch or full installed-app visual review was performed. Browser host/query state
and CSS tokens were fixtures; the actual SDK dropdown primitives and React were
used. Screenshots are fixture evidence, not a screenshot of the installed app.
No upstream full application build/full test suite was run: this plugin's build is
plain ESM plus mirror/checksum generation. Broader initial SDK test attempts failed
to collect with incomplete local dependencies; final locked-dependency SDK run
passed. Initial sandbox restrictions blocked headless Chrome and Python runner
process inspection; scoped reruns were approved and executed. No auto-review
rejection occurred.

No new remote pin reachability/CI can be confirmed because the revision is local
and intentionally unpublished. The old pin is the reviewed source. Structural
validation alone does not confer catalog approval.

## Preservation and deliverables

Existing Hermes checkout's unrelated dirty files remain untouched. No writes to
installed plugins or live Hermes data, service controls, push, publish, issues,
comments, PR-status mutation or deployment occurred.

Removed-feature tests were retired with DOM/updater implementations rather than
left red or skipped. Historical v1.9.7 tests remain in Git history. The smaller
suite covers the retained SDK contract, host density cycle, qualified routing,
fleet enumeration and partial roster failures.

Three local-only issue drafts: `upstream-issues/01-compact-sidebar.md`,
`02-composer-chrome.md`, `03-transcript-density.md`. Each includes the concrete
consumer, current SDK alternatives, remaining gap, proposed host-owned seam,
arbitration/lifecycle and accessibility/behavior acceptance criteria.

Detailed command logs, independent failure reproduction, browser harness/bundle,
light/dark fixture screenshots and the catalog entry proposal are in the sibling
workspace `evidence/` directory. The workspace outcome report records the final
local commit and exact catalog-pin proposal.
