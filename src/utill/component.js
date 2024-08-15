//@ts-check
import { pascalCase, sentenceCase, kebabCase } from 'change-case';
import { bold } from 'colorette';
import handlebars from 'handlebars';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { appendFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { copyAssets } from './fsUtill.js';
import { success, fail, progress } from './log.js';
import { componentTemplatesPath } from './pathUtill.js';
import { formatCode } from './prettierUtill.js';

/**
 * Main function to create a new component package in the workspace.
 * @param {string} wsPath - The path to the workspace.
 * @param {string} name - The name of the component.
 * @param {string} description - The description of the component.
 */
export const createComponentPackage = async (wsPath, name, description) => {
    const componentDir = join(wsPath, 'packages', name);

    if (existsSync(componentDir)) {
        return handleExistingComponent(componentDir);
    }

    try {
        logProgress(name);
        initNpmPackage(name);
        logSuccess(name);
        await generateComponentFiles(name, componentDir, wsPath);
        copyAssets(componentDir);
        updatePackageJson(componentDir, description);
    } catch (err) {
        handleError(`Failed to create component package: ${name}`, err);
        cleanupDirectory(componentDir);
    }
};

/**
 * Handles the case when the component already exists.
 * @param {string} componentDir - The directory of the existing component.
 */
const handleExistingComponent = componentDir => {
    handleError(`Component ${componentDir} already exists`, new Error());
};

/**
 * Initializes a new npm package in the component directory.
 * @param {string} name - The name of the component.
 */
const initNpmPackage = name => {
    execSync(`npm init -y -w packages/${name}`);
};

/**
 * Updates the `package.json` file with component metadata.
 * @param {string} componentDir - The component directory.
 * @param {string} description - The description of the component.
 */
const updatePackageJson = (componentDir, description) => {
    const packageJsonPath = join(componentDir, 'package.json');
    const packageData = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    packageData.alpha = { component: true, description };
    writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2));
};

/**
 * Generates TypeScript code for the component.
 * @param {object} config - The configuration for the component.
 * @returns {string} - The generated TypeScript code.
 */
const generateTypeScriptCode = config => {
    const templatePath = join(componentTemplatesPath(), '.component.ts.hbs');
    const template = handlebars.compile(readFileSync(templatePath, 'utf-8'));
    return template(config);
};

/**
 * Creates and writes the component files to the specified directory.
 * @param {string} name - The name of the component.
 * @param {string} componentDirPath - The path to the component directory.
 * @param {string} wsPath - The path to the workspace.
 */
const generateComponentFiles = async (name, componentDirPath, wsPath) => {
    const config = prepareComponentConfig(name, wsPath);

    mkdirSync(componentDirPath, { recursive: true });
    await writeComponentFiles(componentDirPath, config);
    await updatePublicAPI(wsPath, config);
};

/**
 * Prepares the configuration object for the component.
 * @param {string} name - The name of the component.
 * @param {string} wsPath - The path to the workspace.
 * @returns {object} - The configuration object.
 */
const prepareComponentConfig = (name, wsPath) => {
    const pluginConfig = JSON.parse(readFileSync(join(wsPath, 'plugin.json'), 'utf-8'));
    const selector = kebabCase(name);
    const className = pascalCase(name);

    return {
        componentSelectorPrefix: pluginConfig.components?.selectorPrefix || 'comp',
        componentDirName: name,
        componentSelector: selector,
        componentClassName: className,
        componentDirPath: join(wsPath, 'packages', name),
        componentLabel: sentenceCase(name),
    };
};

/**
 * Writes the component TypeScript file.
 * @param {string} dirPath - The directory path to write the file.
 * @param {object} config - The configuration for the component.
 */
const writeComponentFiles = async (dirPath, config) => {
    const tsFilePath = join(dirPath, `${config.componentSelector}.ts`);
    const tsCode = generateTypeScriptCode(config);
    await writeFile(tsFilePath, tsCode, 'utf-8');
};

/**
 * Updates `public-api.ts` to export the new component.
 * @param {string} wsPath - The path to the workspace.
 * @param {object} config - The configuration for the component.
 */
const updatePublicAPI = async (wsPath, config) => {
    const publicAPIPath = join(wsPath, './public-api.ts');
    const originalContent = readFileSync(publicAPIPath, 'utf-8');
    const newContent = await formatCode(addExportStatement(config), 'typescript');

    try {
        await appendFile(publicAPIPath, newContent, 'utf-8');
    } catch (err) {
        handleError(`Failed to update public-api.ts`, err);
        writeFileSync(publicAPIPath, originalContent);
        throw err;
    }
};

/**
 * Creates the export statement for the component.
 * @param {object} config - The configuration for the component.
 * @returns {string} - The export statement.
 */
const addExportStatement = config => {
    const { componentSelector, componentDirName } = config;
    return `export * from './packages/${componentDirName}/${componentSelector}';`;
};

/**
 * Logs an error message and exits the process.
 * @param {string} message - The error message.
 * @param {Error} error - The error object.
 */
const handleError = (message, error) => {
    fail(message, error);
    process.exit(1);
};

/**
 * Logs progress for the component creation process.
 * @param {string} name - The name of the component.
 */
const logProgress = name => {
    progress(`Generating component package: ${bold(name)}`);
};

/**
 * Logs success message for the initialization of the component project.
 * @param {string} name - The name of the component.
 */
const logSuccess = name => {
    success(`Initialized component project: ${bold(name)}`);
};

/**
 * Removes the specified directory.
 * @param {string} dir - The directory to remove.
 */
const cleanupDirectory = dir => {
    rmSync(dir, { recursive: true });
};
