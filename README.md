# Bootforge

Bootforge is a Node-first CLI for applying reusable project setup modules across .NET and TypeScript repositories.

The npm package name is `@talby/bootforge`. The installed CLI command remains `bootforge`.

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
npm run smoke
```

## CI and Releases

GitHub Actions now uses two separate lanes:

- Validation runs on pull requests to `main` and on pushes to `main`.
- Release runs only when a maintainer pushes a semver tag such as `v0.1.1`.

Both workflows use Node 22 on `ubuntu-latest` and run the same self-contained checks:

```bash
npm ci
npm run build
npm test
npm run smoke
```

The repository does not commit `dist/`. Release artifacts are built in CI and published from that fresh output.

## Maintainer Release Flow

Before trusted publishing can be configured, the package must already exist on npm. npm attaches a trusted publisher from the package settings page, so the first release is a one-time bootstrap step.

### First Publish Bootstrap

1. Confirm the package name is still available on npm.
2. Build and test locally.
3. Publish the initial version manually from a maintainer machine using an npm account with 2FA enabled.
4. After the package exists on npm, add the GitHub Actions trusted publisher for future releases.

```bash
npm ci
npm run build
npm test
npm run smoke
npm publish
```

After that first manual publish succeeds, use the normal release flow below.

1. Update `package.json` to the intended release version.
2. Push the version change to `main`.
3. Create and push a matching semver tag such as `v0.1.1`.

```bash
git tag v0.1.1
git push origin v0.1.1
```

The release workflow rebuilds the package, reruns validation, checks that the git tag matches `package.json#version`, and only then runs `npm publish`.

Repository settings that still need to be configured in GitHub:

- require the `Validation` workflow before merges to `main`

Repository settings that still need to be configured in npm:

- after the first manual publish of `@talby/bootforge`, add a GitHub Actions trusted publisher for `TalbyAI/bootforge`
- set the workflow filename to `publish.yml`
- after trusted publishing works, remove any old npm automation publish tokens

The publish workflow now uses GitHub OIDC trusted publishing instead of an `NPM_TOKEN` secret. npm requires the repository metadata in `package.json` to match the GitHub repository exactly, scoped packages need public access enabled for first publish, and the workflow must keep `id-token: write` enabled.

## Roadmap

- Module registry and resolver
- Git safety checks
- Manifest tracking
- Managed block and structured config mutation