# Changelog Policy

Each folder that produces a versioned or releasable artifact maintains its own `CHANGELOG.md`. This keeps change history close to the code it describes and readable by the stakeholders who consume that artifact.

## When to update a changelog

Update the folder's `CHANGELOG.md` when a change is **important to someone consuming the artifact** — a new capability, a breaking change, a significant fix, or a deprecation. Routine maintenance, typo fixes, and internal refactors that don't affect consumers do not need an entry.

## Format

Changelogs follow [Keep a Changelog](https://keepachangelog.com/):

```markdown
# Changelog

All notable changes to this <artifact> will be documented in this file.

## [Unreleased]

### Added
- New feature or capability.

### Changed
- Modification to existing behavior.

### Fixed
- Bug fix.

### Removed
- Deprecated feature removed.

## [1.0.0] - 2026-01-15

### Added
- Initial release.
```

Use `[Unreleased]` for changes that haven't shipped yet. When a version is released, move unreleased entries under a versioned heading with the release date.

## Where changelogs live

A `CHANGELOG.md` belongs in the root of the folder it covers — alongside the code, tool, or library it tracks. Not every folder needs one; only those with artifacts that have external consumers or version numbers.

Repository-wide infrastructure changes (CI, templates, contributing guidelines) are tracked through commits and pull requests and do not need a changelog entry.
