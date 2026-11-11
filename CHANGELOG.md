# Changelog Policy

Each folder that produces a versioned or releasable artifact maintains its own `CHANGELOG.md`. This keeps change history close to the code it describes and readable by the stakeholders who consume that artifact.

## When to update a changelog

Update the folder's `CHANGELOG.md` when a consumer would need to know about the change to use the artifact correctly:

- **Breaking changes** — behavior a consumer depends on now works differently
- **New capabilities** — something a consumer couldn't do before
- **Bug fixes consumers might encounter** — a workaround they can drop
- **Deprecations** — something a consumer uses is going away
- **Library changes** — a dependency was added, removed, or updated in a way that affects the public interface or minimum requirements
- **API changes** — an endpoint, parameter, response format, or authentication method was added, modified, or removed
- **Version-numbered product changes** — any change to a shipped artifact that would appear in release notes for its consumers

Routine maintenance, typo fixes, and internal refactors that don't affect consumers do not need an entry.

## Format

Changelogs follow [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

All notable changes to this <artifact> will be documented in this file.

## [Unreleased]

### 2026-11-11

#### Added
- New feature or capability.

#### Fixed
- Bug fix.

### 2026-11-04

#### Changed
- Modification to existing behavior.

#### Removed
- Deprecated feature removed.

## [1.0.0] - 2026-01-15

### Added
- Initial release.
```

Entries under `[Unreleased]` are grouped by the date they were logged, most recent first. Use `###` date headings with `####` category headings (`Added`, `Changed`, `Fixed`, `Removed`) beneath them. Multiple entries on the same date go under the same date heading.

When a version is released, collapse the dated groups into a single versioned heading with the release date, using `###` for the category headings.

## Where changelogs live

A `CHANGELOG.md` belongs in the root of the folder it covers — alongside the code, tool, or library it tracks. Not every folder needs one; only those with artifacts that have external consumers or version numbers.

Repository-wide infrastructure changes (CI, templates, contributing guidelines) are tracked through commits and pull requests and do not need a changelog entry.
