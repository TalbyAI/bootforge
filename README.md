# Bootforge

Bootforge is a Node-first CLI for applying reusable project setup modules across .NET and TypeScript repositories.

## Current State

This repository now has the first CLI scaffold in place:

- `bootforge --help` shows the public command surface.
- `bootforge --version` reports the package version.
- `init`, `add`, `list`, `search`, and `doctor` are reserved for the next implementation steps.

## Getting Started

```bash
npm install
npm start -- --help
```

## Roadmap

- Project detection
- Module registry and resolver
- Git safety checks
- Manifest tracking
- Managed block and structured config mutation