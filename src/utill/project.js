import { copySync } from './fsUtill.js';
import { handleException, executecmd } from './cmd.js';
import { createDirectory, updatePackageJson, addDefaultScripts, addDefaultDependencies } from './fsUtill'
import { bold } from 'colorette';
import { pluginJsonPath } from './pathUtill.js';
import { done, progress } from './log.js';
import { formatCode } from './prettierUtill.js';
import { fileURLToPath } from 'node:url';
const currentDirectory = dirname(fileURLToPath(import.meta.url));
const initiateWorkspace = dir => {
    executecmd(`npm init -y`, dir, `Initiated Workspace ${bold(dir)}`, `Failed to initiate Workspace`);
};

const seedProjectTemplate = dir => {
    copySync(join(currentDirectory, '../seed/project'), dir, `Project added`, `Failed to add project`);
    copySync(join(currentDirectory, '../seed/server'), join(dir, 'server'), `server added`, `Failed to add server`);
};

const createWorkspace = (dir) => {
    createDirectory(dir, `Workspace ${bold(dir)} created`, `Failed to create Workspace`);
}

const generatePluginData = (name) => ({
    name,
    components: { selectorPrefix: 'zero' },
    modules: { idPrefix: 'mod' }
});

const formatJson = async (data) => await formatCode(data, 'json');

const savePluginJsonFile = (dir, data) => {
    writeFileSync(pluginJsonPath(dir), data);
};

const createPluginJsonFile = async (directory, pluginName) => {
    const jsonData = generatePluginData(pluginName);
    const formattedJson = await formatJson(jsonData);
    savePluginJsonFile(directory, formattedJson);
    done(`plugin.json created in ${dir}`);
};

const setupWorkspace = async (dir) => {
    progress(`Workspace setup in progress`);

    const packageJsonPath = join(dir, 'package.json');
    const updates = {
        workspaces: ['packages/*'],
        type: 'module'
    };

    let pkgJson = updatePackageJson(packageJsonPath, updates);
    addDefaultScripts(pkgJson);
    addDefaultDependencies(pkgJson);

    writeFileSync(packageJsonPath, await formatCode(pkgJson, 'json'));
    execSync(`npm install`, { cwd: dir });

    done(`Workspace setup done: ${bold(dir)}`);
};

export const workspace = async (name, dir) => {
    handleException(dir);
    // Create workspace
    createWorkspace(dir);
    // initialize project
    initiateWorkspace(dir)
    // seed template
    seedProjectTemplate(dir);
    // Create plugin json
    await createPluginJsonFile(dir,name);
    setupWorkspace(dir)

}