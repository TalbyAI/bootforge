# Product Requirements Document — Project Bootstrap CLI

**Version:** 1.0
**Date:** 2026-04-25
**Owner:** Iskander Sierra
**Status:** Draft

---

## Problem Statement

I want a repeatable way to bring my preferred skills, hooks, prompts, agents, and tooling conventions into every new or existing project without manually copying files and redoing setup decisions each time.

The current approach does not scale well across .NET and TypeScript projects. It is slow, inconsistent, hard to update, and fragile when applied to existing repositories. I need one tool that can guide me interactively when I am exploring options, but can also run from the command line for scripted and repeatable setup.

The tool must support both greenfield project creation and brownfield adoption. It must be able to install capabilities from a built-in module catalog, and it must also support other repositories that expose compatible module folders. It must do this safely, with explicit handling for git state, untracked files, and predictable update behavior.

## Solution

Build a Node-first CLI, distributed for `npx`, that manages reusable project setup modules for .NET and TypeScript repositories.

The CLI will be interactive by default when invoked without a subcommand or flags. It will also expose explicit commands for non-interactive usage, including `init`, `add`, `list`, `search`, and `doctor`.

The CLI will ship with a built-in `modules` catalog inside its own repository. Each module will declare what it applies to, what options it needs, how it writes files, what dependencies or conflicts it has, and what validations it should run after installation. The CLI will also allow users to register additional module sources from other repositories, as long as those sources are explicitly registered and pinned to a stable ref.

For file mutation, the CLI will use two strategies in v1:

- Managed text blocks for content the CLI owns directly.
- Structured file-type-aware edits for known configuration formats such as JSON, YAML, XML, package manifests, and selected project configuration files.

For safety, the CLI will block apply by default when operating on an existing project that is not under git, has untracked files, or has a dirty working tree. Users may explicitly confirm or force continuation when they accept that risk.

The CLI will write a project manifest that records what modules were installed, from which source, at which version, with which options. This manifest will support upgrades, audits, and safe reapplication.

## Comparison Matrix

The market already contains adjacent tools for scaffolding, template rendering, and configuration management. None of them cleanly satisfies the full set of requirements in this document, but several provide useful reference points.

| Tool | Interactive prompts | Existing project updates | External template or module sources | Safe deterministic config mutation | .NET and TypeScript coverage | Fit vs this PRD |
| --- | --- | --- | --- | --- | --- | --- |
| **Copier** | Yes | Yes, template-driven updates | Yes, including Git URLs | Partial | Partial | Closest conceptual match. Strong on templated generation, questionnaires, and project updates, but not designed as a Node-first module platform with manifest-driven brownfield patching rules. |
| **projen** | Limited | Yes, strong generated config lifecycle | Limited extensibility | Yes, for generated surfaces | Partial, stronger in JS ecosystems | Strong reference for managed configuration and deterministic regeneration. Weak fit for interactive-first workflows and mixed-repo module sourcing. |
| **Yeoman** | Yes | Partial | Yes, via generators | Partial | Partial | Strong generator ecosystem and interactive UX. Weaker fit for safe retrofitting, manifest tracking, git safety enforcement, and deterministic structured updates. |
| **Plop** | Yes | Partial, mostly additive generators | Local generator definitions | Partial | Partial | Good inspiration for small interactive generators inside a codebase. Too narrow for cross-project module catalogs and brownfield lifecycle management. |
| **Cookiecutter** | Yes | Limited replay, weak update story | Yes, including VCS sources | Partial | Broad but template-centric | Useful for interactive template generation and hooks. Not strong enough for ongoing updates to existing repositories. |
| **.NET custom templates** | Parameter-driven CLI options | No meaningful brownfield update model | Yes, via template packs and local installs | Limited to creation-time templating | Strong for .NET, weak for TypeScript orchestration | Excellent for .NET project creation, but not a cross-ecosystem bootstrap and update orchestrator. |

### Summary of gaps

- No reviewed tool combines interactive-by-default setup with a first-class non-interactive command surface centered on `init`, `add`, `list`, `search`, and `doctor`.
- No reviewed tool cleanly combines built-in modules, pinned external module repositories, manifest-based installation tracking, and deterministic structured edits for brownfield repositories.
- Existing tools tend to be strongest in one of three areas only: generation, configuration synthesis, or ecosystem-specific templating.
- This PRD targets the gap between those categories by combining reusable module catalogs, safe retrofit behavior, and cross-project workflow setup for .NET and TypeScript.

## User Stories

1. As a solo developer, I want to initialize a new .NET project with my preferred setup modules, so that I can start from a consistent baseline.
2. As a solo developer, I want to initialize a new TypeScript project with my preferred setup modules, so that I do not repeat manual configuration.
3. As a developer, I want the CLI to launch into an interactive flow when I run it without arguments, so that I can discover options naturally.
4. As a developer, I want explicit commands for automation, so that I can script project setup in shell workflows and templates.
5. As a developer, I want to search available modules, so that I can find capabilities without reading the source code.
6. As a developer, I want to list installed modules in a project, so that I can understand the current setup state.
7. As a developer, I want to add modules to an existing repository, so that I can retrofit my standards into older projects.
8. As a developer, I want the CLI to detect whether the target repo is .NET, TypeScript, or mixed, so that it can recommend relevant modules.
9. As a developer, I want the CLI to support both built-in modules and modules from other repositories, so that I can reuse the same tool across teams or contexts.
10. As a developer, I want external module sources to be pinned to a specific version, tag, or commit, so that project setup remains reproducible.
11. As a developer, I want the CLI to validate module schemas before applying them, so that bad module definitions fail early.
12. As a developer, I want module options to be declared once and reused by both prompts and command-line flags, so that interactive and scripted use behave the same way.
13. As a developer, I want the CLI to preview a change plan before it writes files, so that I can review what will happen.
14. As a developer, I want the CLI to block unsafe writes when git is missing or the working tree is not in a safe state, so that I do not lose control of local changes.
15. As a developer, I want a clear override path for unsafe states, so that I can proceed intentionally when needed.
16. As a developer, I want the CLI to track installed modules in a manifest, so that upgrades and support are deterministic.
17. As a developer, I want managed file blocks where the CLI owns content, so that repeated runs can update those areas safely.
18. As a developer, I want structured edits for supported config files, so that the tool can modify existing repos without brittle string replacement.
19. As a developer, I want module dependency and conflict handling, so that incompatible capabilities are not installed together silently.
20. As a developer, I want post-apply checks, so that the tool can surface follow-up tasks and validation failures immediately.
21. As a developer, I want a doctor command, so that I can diagnose missing prerequisites or misconfiguration before setup fails.
22. As a developer, I want module metadata to explain applicability, so that I know whether a module fits a .NET app, a TypeScript library, or both.
23. As a developer, I want install operations to be idempotent where possible, so that reapplying a module does not create duplicate content.
24. As a developer, I want the CLI to be opinionated for my workflows in v1, so that the product solves real problems before becoming a platform.
25. As a developer, I want the architecture to leave room for future expansion, so that the tool can later support teams and broader reuse.
26. As a developer, I want a stable built-in catalog in the CLI repo, so that offline and local use remain practical.
27. As a developer, I want the CLI to support external source registration explicitly, so that remote content is never pulled implicitly.
28. As a developer, I want the CLI to show where a module came from, so that auditing and troubleshooting are straightforward.
29. As a developer, I want the tool to work for both greenfield and brownfield repos, so that I do not need separate solutions.
30. As a future maintainer, I want deep internal modules with narrow interfaces, so that the CLI stays testable as capabilities grow.
31. As a future maintainer, I want the file mutation engine to be deterministic, so that failures are explainable and safe.
32. As a future maintainer, I want module resolution separated from file mutation, so that new module sources do not destabilize apply logic.
33. As a future maintainer, I want project detection separated from module execution, so that support for new project types can grow independently.
34. As a future maintainer, I want to defer agent-based file updates until a later version, so that v1 remains predictable and easier to trust.
35. As a future maintainer, I want the CLI to make unsupported file changes explicit, so that future v2 agent workflows can target the right gaps.

## Implementation Decisions

- The product is a Node-first CLI intended for `npx` usage.
- The first release optimizes for the author's own .NET and TypeScript workflows rather than broad public generality.
- The CLI is interactive by default when no command or flags are provided.
- The CLI also supports explicit non-interactive commands, including `init`, `add`, `list`, `search`, and `doctor`.
- The built-in module catalog lives in the same repository as the CLI under a dedicated modules area.
- The CLI supports additional module catalogs from other repositories when those catalogs expose compatible module folders.
- External module sources must be explicitly registered and pinned to a specific ref rather than floated from a live branch.
- The CLI supports both fresh project initialization and retrofitting existing repositories.
- The write path supports direct apply in interactive usage, but only after a visible plan and confirmation flow where applicable.
- The CLI blocks apply by default when the target is not using git, contains untracked files, or has a dirty working tree.
- Users can explicitly override safety blocks by confirmation or force semantics.
- The project stores a manifest recording installed modules, versions, sources, and selected options.
- Managed markers are used where the CLI owns blocks inside partially shared files.
- The file mutation engine combines managed text blocks with structured edits for supported file types.
- The first release avoids agent-driven mutation and keeps the write path deterministic.
- Agent-assisted file updates are explicitly deferred to a later version for unsupported or more complex migrations.

### Runtime and technology choices

- The CLI targets Node 22 or newer in v1.
- The implementation language is TypeScript with pure ESM output.
- The primary distribution target is npm so the tool can be invoked through `npx`.
- The command surface should be built with Commander.
- Interactive prompting should be built with Enquirer.
- Runtime schema validation for module definitions, option schemas, source manifests, and project state should be built with Zod.
- The test stack should use Vitest for unit and integration coverage.
- Packaging should use tsdown to emit the published CLI build.

### Execution model

- Bootforge may mutate files and configuration, but v1 modules do not execute declared commands automatically during apply.
- When a module requires follow-up commands such as dependency installation, restore, or validation, Bootforge should print those steps explicitly as post-apply guidance.
- For TypeScript repositories, Bootforge should detect the package manager already in use rather than forcing npm-only behavior.
- Package manager detection should be based on the target repository state, including lockfiles and workspace metadata where applicable.
- For .NET repositories, automated command integration should be constrained to the `dotnet` CLI and known solution or project patterns.
- Bootforge should not attempt to infer or run arbitrary wrapper scripts or custom build orchestration in v1.

### External module source model

- Built-in modules ship inside the Bootforge repository and remain available without any external source registration.
- External module sources must be explicitly registered before use.
- In v1, remote external sources are limited to registered HTTPS git remotes with a friendly source id.
- Bootforge should reject ad hoc one-off remote URLs during apply.
- Source registration is project-scoped in v1 rather than user-global.
- Users may provide a tag or commit when registering a source, but Bootforge must resolve that input to an exact commit SHA and persist both the requested ref and the resolved commit.
- External sources should be retrieved through the system `git` CLI for clone and fetch operations.
- After retrieval, Bootforge should read module content from a normalized local cache layer rather than directly from live git operations.
- The local source cache should live outside project repositories in a user-global cache directory at `$XDG_CACHE_HOME/bootforge/sources/` with a fallback to `~/.cache/bootforge/sources/` when `XDG_CACHE_HOME` is unset.
- Cache entries should be keyed by a stable hash of the source URL and the resolved commit SHA, for example as `<cache-root>/<source-url-hash>/<resolved-commit-sha>/`.
- Example cached source path: `~/.cache/bootforge/sources/9f3c2d7a4b6e1c8f/4d2e8a1b6c9f0e3d5a7b1c2d3e4f5a6b7c8d9e0f/`.
- This cache location is where Bootforge should perform git clone and fetch operations for external sources so consumers can inspect or troubleshoot cached source state directly.
- Local filesystem module sources are allowed for development and private reuse, but they are non-reproducible and must not be written into committed project state unless converted to a pinned git source.

### External catalog layout and schema

- A compatible external catalog must expose a fixed Bootforge catalog root containing source metadata and a `modules/` directory.
- Each module must live in its own folder under `modules/`.
- Source metadata files and per-module definition files should use YAML.
- YAML definitions are authoring inputs only; Bootforge must validate them against strict runtime schemas before planning or apply.
- Both project state schemas and catalog schemas must carry explicit version identifiers.
- The CLI should support in-place forward migration for known older schema versions.
- The CLI must refuse apply when it encounters a newer unknown state or catalog schema version.

### Project state format

- Each project may use exactly one Bootforge state location.
- When `bootforge init` runs in a repository without `package.json`, it should create a dedicated `.bootforge.yaml` file.
- When `bootforge init` runs in a repository that already has `package.json`, it should ask whether to store Bootforge state in `package.json` under a dedicated `bootforge` section or in `.bootforge.yaml` only when `--state-location` is not provided.
- The `bootforge init` command should accept `--state-location <package.json|.bootforge.yaml>`, validate that the supplied value is one of those two options, and use it to choose the storage target without prompting.
- Bootforge should not allow multiple active state locations in the same project; the same conflict checks should run for both interactive and non-interactive init flows, including rejecting `package.json` storage when `.bootforge.yaml` is already active and rejecting `.bootforge.yaml` storage when `package.json#bootforge` is already active.
- When conflicting state locations are detected, `bootforge init` should surface a clear error explaining that only one active state location is allowed and identify the conflicting locations.
- The `bootforge init` help and usage text should document the `--state-location` flag and its supported values.
- The project state should be machine-owned, schema-versioned, and treated as the canonical record of installed Bootforge state for that repository.
- The project state should record current resolved state only rather than an append-only history log.
- The top-level project state should record project identity, registered sources, and installed modules.
- Each installed module entry should record at least the module id, source id, requested ref, resolved commit, module version, selected options, install status, and last-applied Bootforge version.

### Mutation and doctor boundaries

- First-class structured mutation support in v1 should cover JSON, YAML, and XML.
- Managed text blocks remain the fallback only for CLI-owned regions in partially shared files.
- Unsupported file mutations should be surfaced explicitly in the plan rather than silently approximated.
- The `doctor` command should verify the Node runtime version, `git` availability, target repository git safety state, project state validity, source registration validity, cached source reachability, module schema validity, and required external tools declared by selected modules.
- `doctor` should remain a readiness and diagnostics command, not a hidden apply or mutation command.

### Deep modules to build

- **Project detector**: identifies repo type, language mix, tooling shape, and whether the project is new or existing.
- **Module registry and resolver**: loads built-in and external module catalogs, validates schemas, resolves dependencies, and detects conflicts.
- **Option schema engine**: defines module options once and exposes them to both interactive prompts and command-line flags.
- **Apply planner**: produces a change plan, previews actions, and decides whether the operation is safe to continue.
- **Mutation engine**: performs managed block writes and structured config edits through a single deterministic interface.
- **State manifest manager**: records applied modules, sources, versions, and options, and supports future updates and audits.
- **Safety and git guard**: checks git state, detects untracked or dirty files, and enforces blocking or override policy.
- **Doctor and validation runner**: checks prerequisites, validates module compatibility, and runs post-apply follow-up checks.

These are intentionally deep modules because each should encapsulate a large amount of behavior behind a small, stable interface. They should remain testable in isolation and should not leak project-specific mutation details into the command layer.

## Testing Decisions

- A good test should verify external behavior and observable outcomes rather than implementation details.
- Tests should focus on command results, resolved plans, mutation outputs, manifest updates, and safety decisions.
- The highest-priority modules to test are the project detector, module registry and resolver, option schema engine, apply planner, mutation engine, manifest manager, and git safety guard.
- Module contract validation should be covered with both valid and invalid module definitions.
- Mutation tests should verify idempotency, safe reapplication, conflict handling, and supported structured edits.
- Safety tests should cover non-git folders, clean repos, dirty repos, untracked files, and explicit override behavior.
- Interactive and non-interactive paths should be tested against the same option schema expectations.
- Doctor behavior should be tested around missing prerequisites, invalid module sources, and unsupported target configurations.
- State tests should cover the `.bootforge.yaml` path, the `package.json#bootforge` path, and rejection of multiple simultaneous state locations.
- Source tests should cover pinned ref resolution, cache reuse by resolved commit, local-path source restrictions, and rejection of unregistered remote URLs.
- Compatibility tests should cover schema migration of known older project state and catalog versions, plus safe refusal for newer unknown versions.
- Good tests should prefer representative fixture projects over heavy mocking when testing detection, planning, and apply behavior.
- Prior art in the current repo favors behavior-focused end-to-end validation via package scripts and Playwright for user-visible flows, which reinforces the principle of testing outcomes rather than internals.
- The CLI itself should use a layered test strategy: unit tests for deep modules, fixture-based integration tests for plan and apply behavior, and a small number of command-level smoke tests for the public interface.

## Out of Scope

- A .NET global tool distribution in v1.
- A broad public plugin platform in v1.
- Arbitrary intelligent source-code rewrites across unsupported file types.
- Agent-driven mutation in v1.
- Silent floating updates from external module repositories.
- Automatic issue submission or repository hosting workflows.
- Multi-user team governance features such as approvals, role models, or organization-wide policy enforcement in v1.
- Full support for every ecosystem beyond the initial .NET and TypeScript focus.

## Further Notes

- The product should be built to solve the author's real setup needs first, with clean seams for later team or public reuse.
- Reliability of brownfield updates is more important than breadth of module count in the first release.
- The command surface should remain small and obvious; complexity should live in the internal modules, not in the user-facing interface.
- External module support is valuable, but only if source trust, schema validation, and version pinning are strict.
- The manifest and mutation engine together form the long-term trust boundary of the system.
