# Agent Instructions

These instructions apply to every agent and automated task working in this repository.

## Required reading order

1. This file (`AGENTS.md`).
2. `CONTRIBUTING.md`.
3. `CHANGELOG.md` (changelog policy and format).
4. `README.md` and the README of any folder you are changing.

## Before starting any work

1. Run `git ls-tree -r --name-only origin/main` to understand the current folder structure.
2. Follow the branching, commit, and coding standards in `CONTRIBUTING.md`.

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

## Pre-push checklist

Run through this list before every push.

1. For every file you added, removed, or modified: verify the `README.md` in that file's folder reflects the change. Update it if not.
2. For every content change to a folder with a `CHANGELOG.md`: verify the changelog has been updated if the change is significant to consumers.
3. New folders include a `README.md`.
4. File names follow the repository's naming conventions.
5. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
6. Use `.github/pull_request_template.md` when opening pull requests.

## Scope and safety

- Do not silently expand scope, implement audit recommendations without authorization, or modify product code for documentation-only requests.
- Preserve existing work in the working tree; do not reset, clean, or overwrite without authorization.
- Do not expose credentials or copy secret values into files, commands, commits, issues, or pull requests.
