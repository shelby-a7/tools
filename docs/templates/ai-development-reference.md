# [Project Name] — AI Development Reference

**Purpose:** Portable context document for any contributor or agent continuing development of this project.

**Project:** [Full project name]  
**Application approach:** [One-sentence summary of the technical approach, key technology choices, and any intentional constraints — e.g., "Deterministic internal React web application backed by a relational database and API" or "CLI tool written in Go with SQLite storage."]  
**Current checkpoint:** `[commit hash] — [Short checkpoint description]`  
**Current implementation state:** [Which development steps are completed, in progress, or partial. Be specific about what is and is not yet implemented.]  
**Explicit scope boundary:** [Any features, sections, or development steps that are deferred, removed, or out of scope. State the authority required to change these boundaries — e.g., "Do not begin [feature] unless the project owner later authorizes it."]

## Source of truth

[Identify the canonical requirements document by path and describe its role. If requirements were synchronized from an external source, note the source name and date of last synchronization. Identify where QA/acceptance records live.]

> Example: The canonical requirements document is `docs/spec/product-requirements.md`. It is the only source for product requirements. QA records in `docs/qa/` preserve the acceptance criteria, evidence, remediation history, and results for each development step.

## Build Process

[Describe the step-by-step process every contributor must follow when working on a development step. This section governs how work is done, not what is built.]

1. **Start one Development Step at a time.** Before any work, announce the step and timestamp it. Do not start the next step automatically.
2. **Create the step QA checklist first.** Translate the relevant requirements into explicit acceptance criteria. Preserve required values, rules, exceptions, visibility behavior, persistence rules, and scope boundaries. Create the checklist in the repository before implementation.
3. **Implement only that step.** Build the working behavior required by the step. Do not silently expand into later steps or deferred features.
4. **Evaluate against every criterion.** Before declaring the step complete, run the QA checklist and document the result of each criterion in the version-controlled QA record. Use code inspection, automated tests, API/runtime checks, and build checks appropriate to the step.
5. **Remediate failures, limited to [N] attempts per criterion.** If a criterion fails, attempt a correction and reevaluate. Record each evaluation and remediation. After [N] unsuccessful attempts for a specific criterion, stop and raise a flag to the project owner; do not claim the step passed.
6. **Save evidence.** Keep the QA record, tests, implementation, and checkpoint together in version control. A passing step should have a clean, saved checkpoint and a QA record stating the evidence and any remediation.
7. **Stop after a passing step.** When all criteria pass and the step is complete, report the result, provide the QA record and checkpoint, and ask whether to start the next Development Step. Do not proceed without that instruction.
8. **Maintain traceability.** [State project-specific traceability rules — e.g., keep catalog versions separate from session versions; preserve exact client wording; maintain append-only history; require explicit source references. Prohibit inventing data, claims, or assertions not grounded in evidence.]
9. **Respect scope exclusions.** [Restate the explicit scope boundaries from the top of this document so they are visible in the process section as well.]

## Development Steps

[List every planned development step. Each entry should state what the step delivers, its acceptance criteria or record, and its current status. Group completed, in-progress, and future steps clearly. Mark removed steps explicitly.]

### 1. [Step title] — [status: completed / in progress / planned / removed]

[One paragraph describing what this step delivers. Be specific about the behaviors, data structures, rules, or capabilities it introduces.]

**Acceptance record:** `[path/to/qa-record.md]` — [passed / failed / pending].

### 2. [Step title] — [status]

[Description of deliverables.]

**Acceptance record:** `[path/to/qa-record.md]` — [status].

### N. [Continue adding development steps in the format above]

[Each step should follow the same structure: a title with status, a paragraph describing the deliverables, and an acceptance record path with its current result.]

**Acceptance record:** `[path/to/qa-record.md]` — [status].

## Current project state and checkpoints

[Maintain a table of significant checkpoints. Each row records a commit hash and what it represents. This table is the project's progress ledger.]

| Checkpoint | Meaning |
|---|---|
| `[hash]` | Initial project scaffold |
| `[hash]` | Development Step 1 — [description] |
| `[hash]` | Development Step 2 — [description] |

**Project directory:** `[absolute path to the managed project directory]`  
**Recovery source of truth:** [Identify the branch or location that serves as the recovery baseline — e.g., "The Git `main` branch is the recovery source of truth."]

## Handoff instructions for a new contributor

[Write a short, ordered list of what a new contributor must do when picking up this project. This section is the "start here" checklist.]

1. Read this file, the canonical requirements document, and the latest QA record.
2. Verify the current project branch and working tree status.
3. Verify the development environment health using the startup protocol above.
4. Identify the current Development Step and its status.
5. Create or update the active step's QA record before implementation.
6. Run per-criterion evaluation including runtime validation.
7. Save a checkpoint, stop, and ask the project owner whether to begin the next step.

## Development environment and startup protocol

[Describe the steps required to bring the development environment to a working state. This section is an operational procedure, not a product requirement.]

1. [Verify the project directory, current branch, and working tree state before starting anything.]
2. [Install dependencies from the lockfile before starting the application.]
3. [Identify running services by project directory and configured port, not by session-specific IDs.]
4. [Do not start duplicate services when one already exists. Verify health before deciding a service is unhealthy.]
5. [Run exactly one development server on the configured port. State the expected bind address — e.g., `0.0.0.0:3000`.]
6. [Define the health checks that must pass before the environment is considered ready — e.g., health endpoint returns 200, route manifest loads, main page returns 200.]
7. [If startup fails, diagnose before restarting. Do not restart blindly.]

## Artifact map

[List every significant file or directory in the project, grouped by purpose. Each entry gives the path and a one-line description of its role. This map helps a new contributor orient quickly.]

- `[path/to/spec]`: canonical requirements document.
- `[path/to/qa/]`: QA acceptance records by development step.
- `[path/to/catalog/]`: [description of shared data or domain layer].
- `[path/to/engine/]`: [description of core logic layer].
- `[path/to/server/]`: [description of API/server layer].
- `[path/to/client/]`: [description of client/UI layer].
- `[path/to/tests/]`: [description of test suites].
- `[path/to/config]`: [description of project configuration].

## Portable handoff package

[Describe the handoff mechanism used when transferring the project to a new contributor or environment. Identify the directory and/or archive, its contents, and how it stays synchronized with the project.]

> Example:
> - Directory: `task-reference-package/`
> - Archive: `project-handoff.zip` at the project root
>
> A contributor continuing the project should begin with this project reference, then inspect the package README. The package contains the canonical specification, QA records, implementation evidence, and any startup protocols. The archive is regenerated whenever the package changes.
