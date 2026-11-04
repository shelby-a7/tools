# Contributing to Tools

Thank you for your interest in contributing. This guide explains how to propose changes, write code, and get your work merged.

## How to Contribute

### Reporting Issues

- Search [existing issues](https://github.com/shelby-a7/tools/issues) before opening a new one.
- Use the appropriate issue template (bug report or feature request).
- Include steps to reproduce, expected behavior, and actual behavior for bugs.

### Suggesting Features

- Open a feature request issue describing the problem you're solving and the proposed approach.
- Wait for discussion before starting significant work — this avoids wasted effort.

### Submitting Changes

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Make your changes** following the coding standards below.
3. **Write or update tests** for any changed behavior.
4. **Run the test suite** locally before pushing:
   ```bash
   # Run tests
   cd tests && run your test command
   ```
5. **Commit** with a clear message following [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add csv export utility
   fix: handle empty input in parser
   docs: update installation instructions
   ```
6. **Push** your branch and open a pull request against `main`.

## Branch Naming

Use prefixes to categorize your branch:

| Prefix       | Purpose                        |
|-------------|--------------------------------|
| `feat/`     | New features                   |
| `fix/`      | Bug fixes                      |
| `docs/`     | Documentation changes          |
| `refactor/` | Code restructuring             |
| `test/`     | Adding or updating tests       |
| `chore/`    | Maintenance and tooling        |

## Pull Request Guidelines

- Keep PRs focused — one logical change per PR.
- Fill out the PR template completely.
- Link related issues using `Closes #123` in the description.
- All CI checks must pass before merge.
- At least one approval is required for merge.

## Coding Standards

- Write clear, self-documenting code with descriptive names.
- Keep functions small and single-purpose.
- Add error handling at system boundaries (user input, external APIs).
- Don't leave dead code, commented-out blocks, or TODO comments in merged code.

## Code Review

- Reviewers: focus on correctness, clarity, and maintainability.
- Authors: respond to all review comments, even if just to acknowledge.
- Prefer resolving discussions with code changes over extended debate.

## Getting Help

If you're unsure about anything, open a discussion or comment on the relevant issue. We'd rather help you contribute than have you get stuck.
