export type ProjectKind = 'dotnet' | 'typescript' | 'mixed' | 'unknown';

export type ProjectSignal =
  | 'package.json'
  | 'tsconfig.json'
  | '.sln'
  | '.csproj'
  | 'pnpm-lock.yaml'
  | 'package-lock.json'
  | 'yarn.lock'
  | 'bun.lockb'
  | 'bun.lock';

export type OutputMode = 'human' | 'json';

export interface DetectedProject {
  kind: ProjectKind;
  isExistingProject: boolean;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun' | null;
  signals: ProjectSignal[];
}

export interface CommandContext {
  cwd: string;
  targetRoot: string;
  outputMode: OutputMode;
  detectedProject: DetectedProject;
}