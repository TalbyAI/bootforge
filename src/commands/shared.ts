import type { Command } from 'commander';

export function addSharedOptions(command: Command): Command {
  return command
    .option('-t, --target <path>', 'target project root', '.')
    .option('--json', 'emit machine-readable json output', false);
}