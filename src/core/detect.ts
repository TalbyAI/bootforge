import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';

import type { DetectedProject, ProjectSignal } from '../types.js';

type ReadDirectory = typeof readdir;

const detectedProjectSchema = z.object({
  kind: z.enum(['dotnet', 'typescript', 'mixed', 'unknown']),
  isExistingProject: z.boolean(),
  packageManager: z.enum(['npm', 'pnpm', 'yarn', 'bun']).nullable(),
  signals: z.array(
    z.enum([
      'package.json',
      'tsconfig.json',
      '.sln',
      '.csproj',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock',
      'bun.lockb',
      'bun.lock',
    ]),
  ),
});

const MAX_DEPTH = 3;
const IGNORE_DIRS = new Set(['.git', 'node_modules', 'dist', 'coverage']);
const LOCKFILE_TO_MANAGER = new Map<string, DetectedProject['packageManager']>([
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['bun.lockb', 'bun'],
  ['bun.lock', 'bun'],
  ['package-lock.json', 'npm'],
]);

export async function detectProject(targetRoot: string, readDirectory: ReadDirectory = readdir): Promise<DetectedProject> {
  const signals = new Set<ProjectSignal>();

  await walk(targetRoot, 0, signals, readDirectory);

  const detected: DetectedProject = {
    kind: detectProjectKind(signals),
    isExistingProject: signals.size > 0,
    packageManager: detectPackageManager(signals),
    signals: Array.from(signals).sort((left, right) => left.localeCompare(right)),
  };

  return detectedProjectSchema.parse(detected);
}

async function walk(
  targetRoot: string,
  depth: number,
  signals: Set<ProjectSignal>,
  readDirectory: ReadDirectory,
): Promise<void> {
  if (depth > MAX_DEPTH) {
    return;
  }

  let entries;

  try {
    entries = await readDirectory(targetRoot, { withFileTypes: true });
  } catch (error) {
    if (isIgnorableReadError(error)) {
      return;
    }

    throw error;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) {
        continue;
      }

      await walk(path.join(targetRoot, entry.name), depth + 1, signals, readDirectory);
      continue;
    }

    captureSignal(entry.name, signals);
  }
}

function captureSignal(fileName: string, signals: Set<ProjectSignal>): void {
  if (fileName === 'package.json' || fileName === 'tsconfig.json') {
    signals.add(fileName);
    return;
  }

  if (LOCKFILE_TO_MANAGER.has(fileName)) {
    signals.add(fileName as ProjectSignal);
    return;
  }

  if (fileName.endsWith('.sln')) {
    signals.add('.sln');
    return;
  }

  if (fileName.endsWith('.csproj')) {
    signals.add('.csproj');
  }
}

function detectPackageManager(signals: Set<ProjectSignal>): DetectedProject['packageManager'] {
  for (const lockfile of ['pnpm-lock.yaml', 'yarn.lock', 'bun.lockb', 'bun.lock', 'package-lock.json'] as const) {
    if (signals.has(lockfile)) {
      return LOCKFILE_TO_MANAGER.get(lockfile) ?? null;
    }
  }

  return signals.has('package.json') ? 'npm' : null;
}

function detectProjectKind(signals: Set<ProjectSignal>): DetectedProject['kind'] {
  const hasDotNet = signals.has('.sln') || signals.has('.csproj');
  const hasTypeScript = signals.has('package.json') || signals.has('tsconfig.json');

  if (hasDotNet && hasTypeScript) {
    return 'mixed';
  }

  if (hasDotNet) {
    return 'dotnet';
  }

  if (hasTypeScript) {
    return 'typescript';
  }

  return 'unknown';
}

function isIgnorableReadError(error: unknown): error is NodeJS.ErrnoException {
  return (
    error instanceof Error &&
    'code' in error &&
    (error.code === 'ENOENT' || error.code === 'EACCES' || error.code === 'EPERM' || error.code === 'ENOTDIR')
  );
}