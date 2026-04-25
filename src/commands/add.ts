import { createCommandContext } from '../core/context.js';
import { renderReservedCommand } from '../core/render.js';
import type { CommonCommandOptions } from './doctor.js';

export async function runAdd(options: CommonCommandOptions = {}): Promise<string> {
  const context = await createCommandContext({
    target: options.target,
    outputMode: options.json ? 'json' : 'human',
  });

  return renderReservedCommand('add', context);
}