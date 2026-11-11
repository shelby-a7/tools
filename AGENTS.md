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

After opening a pull request, evaluate whether a consumer would need to know about this change to use the artifact correctly. A change requires a changelog entry if it meets any of these criteria:

- Breaking changes — behavior a consumer depends on now works differently
- New capabilities — something a consumer couldn't do before
- Bug fixes consumers might encounter — a workaround they can drop
- Deprecations — something a consumer uses is going away
- Library changes — a dependency was added, removed, or updated in a way that affects the public interface or minimum requirements
- API changes — an endpoint, parameter, response format, or authentication method was added, modified, or removed
- Version-numbered product changes — any change to a shipped artifact that would appear in release notes for its consumers

If the change meets any of these criteria and the affected folder has a `CHANGELOG.md`, add an entry under `[Unreleased]` using the format defined in the root `CHANGELOG.md`. If the folder does not yet have a `CHANGELOG.md` and the artifact has external consumers, create one. Push the changelog update to the PR branch.

If the change does not meet any of these criteria — routine maintenance, internal refactors, typo fixes, CI or infrastructure updates — do not add a changelog entry.

## Release-time changelog update

When tagging a release for an artifact, move all entries under `[Unreleased]` in that folder's `CHANGELOG.md` to a new versioned heading with the release date:

```markdown
## [1.2.0] - 2026-11-11
```

Leave an empty `[Unreleased]` section above it for future entries.

## Pre-push checklist

Run through this list before every push.

1. For every file you added, removed, or modified: verify the `README.md` in that file's folder reflects the change. Update it if not.
2. New folders include a `README.md`.
3. File names follow the repository's naming conventions.
4. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
5. Use `.github/pull_request_template.md` when opening pull requests.

## Scope and safety

- Do not silently expand scope, implement audit recommendations without authorization, or modify product code for documentation-only requests.
- Preserve existing work in the working tree; do not reset, clean, or overwrite without authorization.
- Do not expose credentials or copy secret values into files, commands, commits, issues, or pull requests.
