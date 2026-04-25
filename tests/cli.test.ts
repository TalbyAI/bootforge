import { describe, expect, it, vi } from 'vitest';

import { runCli } from '../src/cli.js';

describe('runCli', () => {
  it('routes no-arg execution through the interactive selector', async () => {
    const stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const prompt = vi.fn().mockResolvedValue('doctor');

    await runCli([], prompt);

    expect(prompt).toHaveBeenCalledTimes(1);
    expect(stdout).toHaveBeenCalled();

    stdout.mockRestore();
  });

  it('emits json for doctor', async () => {
    const chunks: string[] = [];
    const stdout = vi.spyOn(process.stdout, 'write').mockImplementation((chunk: string | Uint8Array) => {
      chunks.push(String(chunk));
      return true;
    });

    await runCli(['doctor', '--target', 'tests/fixtures/typescript', '--json'], vi.fn());

    expect(JSON.parse(chunks.join('')).detectedProject.kind).toBe('typescript');

    stdout.mockRestore();
  });
});