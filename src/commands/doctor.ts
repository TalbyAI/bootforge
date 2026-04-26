import { createCommandContext } from '../core/context.js';
import { renderContext } from '../core/render.js';

export interface CommonCommandOptions {
  target?: string;
  json?: boolean;
}

export async function runDoctor(options: CommonCommandOptions = {}): Promise<string> {
  const context = await createCommandContext({
    target: options.target,
    outputMode: options.json ? 'json' : 'human',
  });

  return renderContext(context);
}