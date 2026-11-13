# Tools

Shared tools and utilities for the shelby-a7 organization.

## Getting Started

```bash
git clone git@github.com:shelby-a7/tools.git
cd tools
pip install pre-commit
pre-commit install
```

## Repository Structure

```
tools/
├── docs/
│   ├── adr/                    # Architecture Decision Records
│   └── development-resources/  # Development guides and templates
├── .github/                # CI workflows, issue/PR templates, CODEOWNERS, Dependabot
├── CHANGELOG.md            # Changelog policy and format
├── CONTRIBUTING.md         # Contribution guidelines
├── SECURITY.md             # Security policy
└── LICENSE                 # MIT License
```

## Development Resources

- **[AI Development Reference](docs/development-resources/ai-development-reference.md)** — Portable context document for any contributor or agent continuing development of a project. Covers requirements traceability, build process, development steps, QA records, environment setup, and handoff procedures.
- **[Tracking Plan Template](docs/development-resources/tracking-plan-template.md)** — Tool-agnostic template for product analytics implementation plans. Covers SDK setup, event taxonomy, phased rollout, QA checklists, and architecture reference.

## Architecture Decisions

Significant decisions are recorded as ADRs in [`docs/adr/`](docs/adr/).

## CI/CD

GitHub Actions workflows are in [`.github/workflows/`](.github/workflows/):

- **ci.yml** — Continuous integration checks
- **release.yml** — Release automation

Dependency updates are managed by [Dependabot](.github/dependabot.yml).

## Security

See [SECURITY.md](SECURITY.md) for the security policy and how to report vulnerabilities.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes. See [CHANGELOG.md](CHANGELOG.md) for the changelog policy.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
