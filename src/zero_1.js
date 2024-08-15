#!/usr/bin/env node

import { Command, InvalidArgumentError } from 'commander';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { existsSync } from 'node:fs';

const cli = new Command();

const executeAction = (task, params) => {
  console.log(`[Task]: ${task}`);
  console.log(`[Parameters]:`, params);
};

const checkWorkspaceValidity = (directory) => {
  // Simple validation logic: looking for a specific file to validate the workspace
  return existsSync(join(directory, 'workspace.json'));
};

cli.version('1.0.0', '-v, --version', 'Display the current version');

cli
  .command('new <projectName>')
  .description('Initialize a new project')
  .action((projectName) => {
    const destination = join(cwd(), projectName);
    executeAction('Initialize New Project', { projectName, destination });
  });

const generateCommand = cli
  .command('generate')
  .alias('g')
  .description('Generate a new plugin. Run "help generate" for details.');

generateCommand
  .command('component <componentName>')
  .alias('c')
  .description('Create a new component plugin')
  .option('-d, --description <desc>', 'Provide a description for the component')
  .action((componentName, options) => {
    executeAction('Create Component', { componentName, description: options.description });
  });

generateCommand
  .command('module <moduleName>')
  .alias('m')
  .description('Create a new module plugin')
  .option('-d, --description <desc>', 'Provide a description for the module')
  .action((moduleName, options) => {
    executeAction('Create Module', { moduleName, description: options.description });
  });

cli
  .command('build <buildType> [plugin]')
  .description('Build a plugin')
  .action((buildType, plugin) => {
    if (!['plugins', 'docker'].includes(buildType)) {
      throw new InvalidArgumentError('"build" argument must be either "plugins" or "docker"');
    }
    executeAction('Build Plugin', { buildType, plugin });
  });

cli
  .command('start')
  .description('Launch the live server for the plugin')
  .option('-p, --port <portNumber>', 'Specify the port number (default: 6969)')
  .action((options) => {
    const portNumber = options.port || 6969;
    executeAction('Start Live Server', { portNumber });
  });

cli
  .command('serve')
  .description('Start the server to serve all plugins')
  .action(() => {
    executeAction('Serve All Plugins', {});
  });

cli.hook('preAction', async (command, executingCommand) => {
  const commandName = executingCommand.name();
  if (commandName === 'new') return;

  if (!checkWorkspaceValidity(cwd())) {
    console.error('Error: Not a valid workspace directory. Exiting...');
    process.exit(1);
  }
});

cli.parse(process.argv);
