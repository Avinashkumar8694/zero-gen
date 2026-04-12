#!/usr/bin/env node

import { Command } from 'commander';
import { join } from 'node:path';
import { cwd } from 'node:process';
import {logExecution, getCurrentPath, getProjectPath} from './utill/cmd.js'
import { existsSync } from 'node:fs';
import { createWorkspaceCommand } from './commands/createWorkspace.js';
import { generateModuleOrComponentCommand } from './commands/generateModuleOrComponent.js';
import { buildCommand } from './commands/build.js';
import { serveCommand } from './commands/serve.js';
import { startCommand } from './commands/start.js';

const program = new Command();

const CONFIG = {
    VERSION: '1.0.0',
    DEFAULT_PORT: 3000,
    WORKSPACE_CONFIG: 'package.json',
};

const initProject = (name) => {
    const path = getProjectPath(name);
    logExecution('Project Initialization', { name, path });
    createWorkspaceCommand.action(name,path)
};

const createComponentOrModule = (type, name, options) => {
    generateModuleOrComponentCommand.action(type,name,options)
};

const buildProject = (pluginName) => {
    logExecution('Build Process', { pluginName });
    buildCommand.action(pluginName)
};

const serveProject = (port) => {
    logExecution('Starting Live Server', { port });
    const path = getCurrentPath();
    startCommand.action(path,port)
};

const serveModule = () => {
    logExecution('Starting Hosting');
    const path = getCurrentPath();
    serveCommand.action(path)
};

const isValidWorkspace = () => existsSync(join(getCurrentPath(), CONFIG.WORKSPACE_CONFIG));

const defineCommands = () => {
    program.version(CONFIG.VERSION);

    program
        .command(createWorkspaceCommand.name)
        .description(createWorkspaceCommand.description)
        .action(initProject);

    const createCmd = program.command(generateModuleOrComponentCommand.name)
        .description(generateModuleOrComponentCommand.description)
        .option('-d, --desc <description>', 'Add a description')
        .action((type, name, options) => createComponentOrModule(type, name, options));

    program
        .command(buildCommand.name)
        .description(buildCommand.description)
        .action(buildProject);

    program
        .command(startCommand.name)
        .option('-p, --port <port>', `Specify port number (default: ${CONFIG.DEFAULT_PORT})`)
        .description(startCommand.description)
        .action(({ port }) => serveProject(port || CONFIG.DEFAULT_PORT));

    program
        .command(serveCommand.name)
        .description(serveCommand.description)
        .action(serveModule);

    program.hook('preAction', (current,action) => {
        if(action.name() == 'init' || action.name() == 'build') return;
        if (!isValidWorkspace()) {
            console.error('Error: This directory is not a valid workspace.');
            process.exit(1);
        }
    });
};

const main = () => {
    defineCommands();
    program.parse(process.argv);
};

main();
