import { Command } from 'commander';
import enquirer from 'enquirer';
import packageJson from '../package.json' with { type: 'json' };

import { runAdd } from './commands/add.js';
import { runDoctor, type CommonCommandOptions } from './commands/doctor.js';
import { runInit } from './commands/init.js';
import { runList } from './commands/list.js';
import { runSearch } from './commands/search.js';
import { addSharedOptions } from './commands/shared.js';

const { Select } = enquirer;

export type InteractivePrompt = () => Promise<'init' | 'add' | 'list' | 'search' | 'doctor'>;

export async function runCli(argv = process.argv.slice(2), prompt = defaultPrompt): Promise<void> {
  const program = createProgram();

  if (argv.length === 0) {
    const selectedCommand = await prompt();
    await program.parseAsync([selectedCommand], { from: 'user' });
    return;
  }

  await program.parseAsync(argv, { from: 'user' });
}

export function createProgram(): Command {
  const program = new Command();

  program
    .name('bootforge')
    .description('Apply reusable project setup modules across .NET and TypeScript repositories.')
    .version(packageJson.version);

  defineCommand(program, 'init', 'Initialize Bootforge for a target repository.', runInit);
  defineCommand(program, 'add', 'Add one or more setup modules to a repository.', runAdd);
  defineCommand(program, 'list', 'List installed Bootforge modules.', runList);
  defineCommand(program, 'search', 'Search available Bootforge modules.', runSearch);
  defineCommand(program, 'doctor', 'Inspect project detection and prerequisite state.', runDoctor);

  return program;
}

function defineCommand(
  program: Command,
  name: string,
  description: string,
  runner: (options: CommonCommandOptions) => Promise<string>,
): void {
  addSharedOptions(program.command(name).description(description)).action(async (options: CommonCommandOptions) => {
    const output = await runner(options);
    process.stdout.write(`${output}\n`);
  });
}

async function defaultPrompt(): Promise<'init' | 'add' | 'list' | 'search' | 'doctor'> {
  const prompt = new Select({
    name: 'command',
    message: 'Select a Bootforge command',
    choices: ['init', 'add', 'list', 'search', 'doctor'],
  });

  return prompt.run() as Promise<'init' | 'add' | 'list' | 'search' | 'doctor'>;
}

runCli().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});