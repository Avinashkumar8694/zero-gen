#!/usr/bin/env node

import { Command } from 'commander';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { existsSync } from 'node:fs';

const program = new Command();

const CONFIG = {
    VERSION: '1.0.0',
    DEFAULT_PORT: 3000,
    WORKSPACE_CONFIG: 'workspace.config.json',
};

const initProject = (name) => {
    const path = getProjectPath(name);
    logExecution('Project Initialization', { name, path });
};

const createComponent = (type, name, options) => {
    const path = getCurrentPath();
    logExecution(`Create ${type}`, { name, description: options.desc, path });
};

const buildProject = (buildType, pluginName) => {
    validateBuildType(buildType);
    logExecution('Build Process', { buildType, pluginName });
};

const serveProject = (port) => {
    logExecution('Starting Live Server', { port });
};

const startHosting = () => {
    logExecution('Starting Hosting');
};

const validateBuildType = (type) => {
    const validTypes = ['plugins', 'docker'];
    if (!validTypes.includes(type)) {
        throw new Error(`Invalid build type: ${type}. Must be one of ${validTypes.join(', ')}`);
    }
};

const getProjectPath = (name) => join(cwd(), name);
const getCurrentPath = () => cwd();

const logExecution = (task, details) => {
    console.log(`Task: ${task}`);
    console.log('Details:', JSON.stringify(details, null, 2));
};

const isValidWorkspace = () => existsSync(join(getCurrentPath(), CONFIG.WORKSPACE_CONFIG));

const defineCommands = () => {
    program.version(CONFIG.VERSION);

    program
        .command('init <projectName>')
        .description('Initialize a new project')
        .action(initProject);

    const createCmd = program.command('create <type> <name>')
        .description('Create a new component or module')
        .option('-d, --desc <description>', 'Add a description')
        .action((type, name, options) => createComponent(type, name, options));

    program
        .command('build <buildType> [pluginName]')
        .description('Compile or package the project')
        .action(buildProject);

    program
        .command('serve')
        .option('-p, --port <port>', `Specify port number (default: ${CONFIG.DEFAULT_PORT})`)
        .description('Serve the project')
        .action(({ port }) => serveProject(port || CONFIG.DEFAULT_PORT));

    program
        .command('host')
        .description('Host all plugins')
        .action(startHosting);

    program.hook('preAction', () => {
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
