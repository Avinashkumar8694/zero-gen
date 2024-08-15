import { Command } from 'commander';
import { createWorkspaceCommand } from './commands/createWorkspace.js';
import { generateComponentCommand } from './commands/generateComponent.js';
import { generateModuleCommand } from './commands/generateModule.js';
import { buildCommand } from './commands/build.js';
import { startCommand } from './commands/start.js';
import { serveCommand } from './commands/serve.js';
import { cwd } from 'process'; // Correct ES module import

const program = new Command();

program
  .version('1.0.0', '-v, --version', 'Show version number')
  .description('Project management CLI');

// Create workspace command
program
  .command(createWorkspaceCommand.name)
  .description(createWorkspaceCommand.description)
  .argument('<name>', 'Workspace name')
  .action(createWorkspaceCommand.action);

// Generate component command
program
  .command(generateComponentCommand.name)
  .alias(generateComponentCommand.alias)
  .description(generateComponentCommand.description)
  .argument('<name>', 'Component name')
  .option('-d, --description <description>', 'Description of the component')
  .action((name, options) => generateComponentCommand.action(name, options.description));

// Generate module command
program
  .command(generateModuleCommand.name)
  .description(generateModuleCommand.description)
  .argument('<name>', 'Module name')
  .option('-d, --description <description>', 'Description of the module')
  .action((name, options) => generateModuleCommand.action(name, options.description));

// Build command
program
  .command(buildCommand.name)
  .description(buildCommand.description)
  .argument('<type>', 'Type of build: "plugins" or "docker"', (value) => {
    if (value !== 'plugins' && value !== 'docker') {
      throw new Error('"build" must be "plugins" or "docker"');
    }
    return value;
  })
  .argument('[pluginName]', 'Optional name of the plugin to build')
  .action((type, pluginName) => buildCommand.action(type, pluginName));

// Start command
program
  .command(startCommand.name)
  .description(startCommand.description)
  .option('-p, --port <port>', 'Port number for the server', '9898')
  .action((options) => startCommand.action(cwd(), options.port));

// Serve command
program
  .command(serveCommand.name)
  .description(serveCommand.description)
  .action(() => serveCommand.action(cwd()));

// Parse command-line arguments
program.parse(process.argv);
