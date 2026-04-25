# Bootforge

Bootforge is a Node-first CLI for applying reusable project setup modules across .NET and TypeScript repositories.

## Current State

This repository now has the first thin vertical slice in place:

- `bootforge --help` shows the public command surface.
- `bootforge --version` reports the package version.
- Running `bootforge` with no arguments opens an interactive command picker.
- `doctor` and `init` already detect whether the target repository looks like `.NET`, `TypeScript`, `mixed`, or `unknown`.
- `add`, `list`, and `search` are scaffolded and share the same command context, but remain reserved for the next implementation steps.

## Supported Slice

The current implementation focuses on three foundations the rest of the CLI depends on:

- A runnable Node 22+ TypeScript CLI with pure ESM packaging.
- A stable public command shell built with Commander.
- Project detection heuristics based on `package.json`, `tsconfig.json`, `.sln`, `.csproj`, and common JavaScript lockfiles.

Detection is wired into the command context, so every command already resolves:

- current working directory
- target root
- output mode (`human` or `json`)
- detected project shape

## Getting Started

```bash
npm install
npm run build
node dist/cli.js --help
```

## Examples

```bash
# Interactive mode
node dist/cli.js

# Inspect project detection for the current repository
node dist/cli.js doctor

# Inspect a different target and emit JSON
node dist/cli.js doctor --target ../some-repo --json

# Run the reserved init flow against a target
node dist/cli.js init --target ../some-repo
```

## Verification

```bash
npm test
npm run build
node dist/cli.js doctor --target tests/fixtures/mixed --json
```

## Roadmap

- Module registry and resolver
- Git safety checks
- Manifest tracking
- Managed block and structured config mutation