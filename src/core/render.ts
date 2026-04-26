import type { CommandContext } from '../types.js';

export function renderContext(context: CommandContext): string {
  if (context.outputMode === 'json') {
    return JSON.stringify(
      {
        cwd: context.cwd,
        targetRoot: context.targetRoot,
        outputMode: context.outputMode,
        detectedProject: context.detectedProject,
      },
      null,
      2,
    );
  }

  const signals = context.detectedProject.signals.length > 0 ? context.detectedProject.signals.join(', ') : 'none';
  const packageManager = context.detectedProject.packageManager ?? 'n/a';

  return [
    `Target: ${context.targetRoot}`,
    `Project kind: ${context.detectedProject.kind}`,
    `Existing project: ${context.detectedProject.isExistingProject ? 'yes' : 'no'}`,
    `Package manager: ${packageManager}`,
    `Signals: ${signals}`,
  ].join('\n');
}

export function renderReservedCommand(commandName: string, context: CommandContext): string {
  return `${commandName} is scaffolded but not implemented yet.\n\n${renderContext(context)}`;
}