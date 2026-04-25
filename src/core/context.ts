import path from 'node:path';

import { detectProject } from './detect.js';
import type { CommandContext, OutputMode } from '../types.js';

export interface ContextInput {
  cwd?: string;
  target?: string;
  outputMode?: OutputMode;
}

export async function createCommandContext(input: ContextInput = {}): Promise<CommandContext> {
  const cwd = path.resolve(input.cwd ?? process.cwd());
  const targetRoot = path.resolve(cwd, input.target ?? '.');
  const outputMode = input.outputMode ?? 'human';

  return {
    cwd,
    targetRoot,
    outputMode,
    detectedProject: await detectProject(targetRoot),
  };
}