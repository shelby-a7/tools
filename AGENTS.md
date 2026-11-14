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

## Linear issue linking

A pull request links to a Linear issue only through a linking keyword plus the issue ID in the pull-request description. Linking is optional: a pull request with no linked issue is valid and passes CI.

Before opening a pull request, ask the user both questions below. Do not infer the answers from the task, the branch, or a search of Linear.

1. Which Linear issue, if any, does this pull request link to? (An ID such as `TEAM-123`, several IDs, or none.)
2. Which linking keyword applies to each issue? Present these options with their helper text:
   - `Closes` — the pull request finishes the issue. Linear moves the issue to Done when the pull request merges.
   - `Part of` — the pull request is partial work. The issue progresses but stays open when the pull request merges.
   - `Relates to` — reference only. The issue's status does not change.

Skip a question only when the user has already answered it explicitly for this pull request.

Then fill in the "Linear Issue" section of `.github/pull_request_template.md`:

- One line per issue in the form `<keyword> <ISSUE-ID>`, for example `Part of TEAM-123`.
- `None` when the user says there is no issue, or when no user is available to answer. Report that the pull request was opened without a linked issue.

Do not put a Linear issue ID in a branch name, pull-request title, or commit message. Linear may treat those as links too, and they bypass the keyword choice.

## Changelog responsibility

After opening a pull request, check whether the changed folder contains a `CHANGELOG.md`. If it does, determine whether the change meets any of these criteria:

- Breaking changes — behavior a consumer depends on now works differently
- New capabilities — something a consumer couldn't do before
- Bug fixes consumers might encounter — a workaround they can drop
- Deprecations — something a consumer uses is going away
- Library changes — a dependency was added, removed, or updated in a way that affects the public interface or minimum requirements
- API changes — an endpoint, parameter, response format, or authentication method was added, modified, or removed
- Version-numbered product changes — any change to a shipped artifact that would appear in release notes for its consumers

If the change meets any of these criteria, add an entry under `[Unreleased]` using the format defined in the root `CHANGELOG.md` and push the update to the PR branch.

Changes that do not meet any of these criteria — routine maintenance, internal refactors, typo fixes, CI or infrastructure updates — do not need a changelog entry.

If the changed folder does not contain a `CHANGELOG.md`, no changelog action is needed. Changelog files are created when a folder is first added (see pre-push checklist), not retroactively.

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
3. New folders that produce an artifact subject to any of the changelog criteria (see [Changelog responsibility](#changelog-responsibility)) include a `CHANGELOG.md` with the format defined in the root `CHANGELOG.md`.
4. File names follow the repository's naming conventions.
4. Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
5. Use `.github/pull_request_template.md` when opening pull requests.

## Scope and safety

- Do not silently expand scope, implement audit recommendations without authorization, or modify product code for documentation-only requests.
- Preserve existing work in the working tree; do not reset, clean, or overwrite without authorization.
- Do not expose credentials or copy secret values into files, commands, commits, issues, or pull requests.
