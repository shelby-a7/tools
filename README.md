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
├── src/           # Source code for tools and utilities
├── tests/         # Test suites
├── docs/          # Documentation, ADRs, and templates
├── .github/       # GitHub configuration (CI, templates, workflows)
└── scripts/       # Build, setup, and helper scripts
```

## Usage

See individual tool documentation in the `docs/` directory.

## Templates

- **[AI Development Reference](docs/templates/ai-development-reference.md)** — Portable context document for any contributor or agent continuing development of a project. Covers requirements traceability, build process, development steps, QA records, environment setup, and handoff procedures.

## Architecture Decisions

Significant decisions are recorded as ADRs in [`docs/adr/`](docs/adr/).

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.
