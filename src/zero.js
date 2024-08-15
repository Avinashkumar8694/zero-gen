#!/usr/bin/env node

import { Command, InvalidArgumentError } from 'commander';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { existsSync } from 'node:fs';

const program = new Command();

const logAction = (action, details) => {
  console.log(`[Action]: ${action}`);
  console.log(`[Details]:`, details);
};

const validateWorkspace = (path) => {
  // Simple validation: check if a specific file or directory exists
  return existsSync(join(path, 'workspace.json'));
};

program.version('1.0.0', '-v, --version', 'Output the version number');

program
  .command('new <name>')
  .description('Create a new project')
  .action((name) => {
    const projectPath = join(cwd(), name);
    logAction('Create New Project', { name, path: projectPath });
  });

const generateCmd = program
  .command('generate')
  .alias('g')
  .description('Generate a new plugin. Run "help generate" for more information.');

generateCmd
  .command('component <name>')
  .alias('c')
  .description('Generate a new component plugin')
  .option('-d, --description <description>', 'Description of the package')
  .action((name, options) => {
    logAction('Generate Component', { name, description: options.description });
  });

generateCmd
  .command('module <name>')
  .alias('m')
  .description('Generate a new module plugin')
  .option('-d, --description <description>', 'Description of the package')
  .action((name, options) => {
    logAction('Generate Module', { name, description: options.description });
  });

program
  .command('build <type> [pluginName]')
  .description('Build the plugin')
  .action((type, pluginName) => {
    if (type !== 'plugins' && type !== 'docker') {
      throw new InvalidArgumentError('"build" can be "plugins" or "docker"');
    }
    logAction('Build', { type, pluginName });
  });

program
  .command('start')
  .description('Start the live server for the plugin')
  .option('-p, --port <port>', 'Port number for serving the plugin')
  .action((options) => {
    const port = options.port || 6969;
    logAction('Start Server', { port });
  });

program
  .command('serve')
  .description('Start the express server that serves the plugins')
  .action(() => {
    logAction('Serve Plugins', {});
  });

program.hook('preAction', async (thisCmd, actionCmd) => {
  const cmd = actionCmd.name();
  if (cmd === 'new') return;

  if (!validateWorkspace(cwd())) {
    console.error('Error: Invalid workspace. Exiting...');
    process.exit(1);
  }
});

program.parse(process.argv);
