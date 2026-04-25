import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { detectProject } from '../src/core/detect.js';

const fixturesRoot = path.resolve('tests/fixtures');

describe('detectProject', () => {
  it('detects a dotnet repository', async () => {
    const result = await detectProject(path.join(fixturesRoot, 'dotnet'));

    expect(result.kind).toBe('dotnet');
    expect(result.signals).toEqual(['.csproj', '.sln']);
    expect(result.packageManager).toBeNull();
  });

  it('detects a typescript repository', async () => {
    const result = await detectProject(path.join(fixturesRoot, 'typescript'));

    expect(result.kind).toBe('typescript');
    expect(result.signals).toEqual(['package-lock.json', 'package.json', 'tsconfig.json']);
    expect(result.packageManager).toBe('npm');
  });

  it('detects a mixed repository', async () => {
    const result = await detectProject(path.join(fixturesRoot, 'mixed'));

    expect(result.kind).toBe('mixed');
    expect(result.signals).toEqual(['.csproj', 'package.json']);
    expect(result.packageManager).toBe('npm');
  });

  it('detects an empty repository', async () => {
    const result = await detectProject(path.join(fixturesRoot, 'empty'));

    expect(result.kind).toBe('unknown');
    expect(result.signals).toEqual([]);
    expect(result.isExistingProject).toBe(false);
  });

  it('treats a missing directory as an unknown repository', async () => {
    const result = await detectProject(path.join(fixturesRoot, 'missing-directory'));

    expect(result.kind).toBe('unknown');
    expect(result.signals).toEqual([]);
    expect(result.isExistingProject).toBe(false);
  });
});