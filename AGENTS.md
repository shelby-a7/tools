# Agent Instructions

These instructions apply to every agent and automated task working in this repository. Read `CONTRIBUTING.md` and `CHANGELOG.md` before starting work.

## Changelog responsibility

Before pushing or opening a pull request, evaluate whether your change is significant to consumers of the affected artifact. A change is significant if it introduces a new capability, alters existing behavior, fixes a bug that consumers could encounter, or removes/deprecates functionality.

If the change is significant and the affected folder has a `CHANGELOG.md`, add an entry under `[Unreleased]` using the format defined in the root `CHANGELOG.md`. If the folder does not yet have a `CHANGELOG.md` and the artifact has external consumers, create one.

If the change is not significant to consumers — routine maintenance, internal refactors, typo fixes, CI or infrastructure updates — do not add a changelog entry.

## Release-time changelog update

When tagging a release for an artifact, move all entries under `[Unreleased]` in that folder's `CHANGELOG.md` to a new versioned heading with the release date:

```markdown
## [1.2.0] - 2026-11-11
```

Leave an empty `[Unreleased]` section above it for future entries.

## Scope and safety

- Do not expand scope beyond what was requested.
- Preserve existing work in the working tree; do not reset, clean, or overwrite without authorization.
- Do not expose credentials or copy secret values into files, commands, commits, issues, or pull requests.
