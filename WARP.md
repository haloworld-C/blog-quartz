# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository overview

- This repository currently contains only the Git metadata and `LICENSE` file. There is no application code, configuration, or documentation (such as `README.md`) in the working tree.
- As code and tooling are added, this file should be updated to describe the actual project layout and workflows.

## Tooling and common commands

At present, there are no project-specific build, lint, or test commands defined in this repository (no package manifests like `package.json`, `pyproject.toml`, `Cargo.toml`, etc. are present).

When additional files are added, prefer to discover commands in this order and update this section accordingly:

1. **Project documentation**: Look for `README.md`, `CONTRIBUTING.md`, or other docs that describe how to build, run, and test the project.
2. **Build / task runners**: Check for files such as `Makefile`, `justfile`, `Taskfile.yml`, or language-specific tools (e.g., `package.json` scripts, `poetry.lock`, `Cargo.toml`, `go.mod`). Use the documented commands rather than inventing new ones.
3. **Tests**: Once a test framework is present, document:
   - How to run the full test suite.
   - How to run a single test file or individual test case.
4. **Formatting / linting**: If formatters or linters are configured (e.g., ESLint, Prettier, Black, Ruff, gofmt, Clippy), record the canonical commands used by the project.

Until such tooling exists, avoid assuming any particular language or build system for this repository.

## Code architecture and structure

There is currently no source tree to analyze, so there is no established architecture or module layout to document.

When code is added, future instances of Warp should:

- Identify the main entrypoints (for example, `main.*` files, framework-specific config like `next.config.*`, or static site generators’ config files) to understand the top-level application flow.
- Map out the top-level directories (e.g., `src/`, `cmd/`, `apps/`, `packages/`, `content/`, `themes/`) and briefly describe their roles.
- Note any major external dependencies or frameworks (e.g., static site generators, web frameworks, build systems) and how they’re wired together.

Please update this section once real code and configuration are present so future agents can quickly understand the project’s big-picture architecture.
