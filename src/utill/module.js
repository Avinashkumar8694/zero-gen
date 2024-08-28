//@ts-check
import { kebabCase, pascalCase } from 'change-case';
import { bold } from 'colorette';
import handlebars from 'handlebars';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { exit } from 'node:process';
import { success, fail, progress } from './log.js';
import { moduleTemplatesPath, pluginJsonPath } from './pathUtill.js';
import { formatCode } from './prettierUtill.js';
import { copyAssets } from './fsUtill.js';
import {logExecution, getCurrentPath, getProjectPath} from './cmd.js'

/**
 * Main function to generate a new module package in the workspace.
 * @param {string} wsPath - The path to the workspace.
 * @param {string} name - The name of the module.
 * @param {string} description - The description of the module.
 */
export const generateModulePackageInWorkspace = async (wsPath, name, description) => {
    const moduleDir = join(wsPath, 'packages', name);
    logExecution(`Create module`, { name, description: description, moduleDir });
    if (existsSync(moduleDir)) {
        handleErrorAndExit(`Module ${moduleDir} already exists`);
    } else {
        await handleModuleCreation(moduleDir, name, description, wsPath);
    }
};

/**
 * Handles the module creation process.
 * @param {string} moduleDir - The module directory path.
 * @param {string} name - The name of the module.
 * @param {string} description - The description of the module.
 * @param {string} wsPath - The path to the workspace.
 */
const handleModuleCreation = async (moduleDir, name, description, wsPath) => {
    try {
        progress(`Component package generation started: ${bold(name)}`);
        execSync(`npm init -y -w ${moduleDir}`);

        updatePackageJson(moduleDir, description);
        await generateAndSaveModuleFiles(name, moduleDir, wsPath);
        await copyAssets(moduleDir);

        success(`Module initialization successful: ${bold(name)}`);

    } catch (err) {
        handleModuleCreationError(name, err, moduleDir);
    }
};

/**
 * Updates the package.json file with module metadata.
 * @param {string} moduleDir - The module directory path.
 * @param {string} description - The description of the module.
 */
const updatePackageJson = (moduleDir, description) => {
    try {
        const packageJsonPath = join(moduleDir, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

        const updatedPackageJson = updatePackageJsonMetadata(packageJson, description);
        writeFileSync(packageJsonPath, JSON.stringify(updatedPackageJson, null, 2));

    } catch (err) {
        handleErrorAndExit(`Failed to update package.json: ${err.message}`);
    }
};

/**
 * Updates the package.json metadata.
 * @param {object} packageJson - The package.json content.
 * @param {string} description - The description of the module.
 * @returns {object} - The updated package.json content.
 */
const updatePackageJsonMetadata = (packageJson, description) => {
    return {
        ...packageJson,
        zero: { module: true, description },
    };
};

/**
 * Generates and saves the module files.
 * @param {string} name - The name of the module.
 * @param {string} moduleDirPath - The path to the module directory.
 * @param {string} wsPath - The path to the workspace.
 */
const generateAndSaveModuleFiles = async (name, moduleDirPath, wsPath) => {
    try {
        const templateContent = getTemplateContent();
        const config = await prepareModuleConfig(name, wsPath);
        const moduleCode = generateModuleCode(templateContent, config);

        await saveModuleFile(moduleDirPath, moduleCode);
    } catch (err) {
        throw new Error(`Failed to generate and save module files: ${err.message}`);
    }
};

/**
 * Retrieves the content of the module template.
 * @returns {string} - The module template content.
 */
const getTemplateContent = () => {
    try {
        return readFileSync(join(moduleTemplatesPath(), '.module.js.hbs'), 'utf-8');
    } catch (err) {
        handleErrorAndExit(`Failed to read module template: ${err.message}`);
    }
};

/**
 * Prepares the configuration object for the module.
 * @param {string} name - The name of the module.
 * @param {string} wsPath - The path to the workspace.
 * @returns {object} - The configuration object.
 */
const prepareModuleConfig = async (name, wsPath) => {
    try {
        const pluginConfig = JSON.parse(readFileSync(pluginJsonPath(wsPath), 'utf-8'));
        return {
            pluginClassName: pascalCase(name),
            pluginId: `${pluginConfig.modules.idPrefix}${kebabCase(name)}`
        };
    } catch (err) {
        handleErrorAndExit(`Failed to prepare module configuration: ${err.message}`);
    }
};

/**
 * Generates the module code using the provided template and configuration.
 * @param {string} templateContent - The content of the module template.
 * @param {object} config - The configuration object.
 * @returns {string} - The generated module code.
 */
const generateModuleCode = (templateContent, config) => {
    try {
        const template = handlebars.compile(templateContent);
        return template(config);
    } catch (err) {
        handleErrorAndExit(`Failed to generate module code: ${err.message}`);
    }
};

/**
 * Saves the module file to the specified directory.
 * @param {string} moduleDirPath - The path to the module directory.
 * @param {string} moduleCode - The generated module code.
 */
const saveModuleFile = async (moduleDirPath, moduleCode) => {
    try {
        const formattedCode = await formatCode(moduleCode, 'typescript');
        writeFileSync(join(moduleDirPath, 'index.js'), formattedCode);
    } catch (err) {
        handleErrorAndExit(`Failed to save module file: ${err.message}`);
    }
};

/**
 * Handles errors during module creation.
 * @param {string} name - The name of the module.
 * @param {Error} err - The error object.
 * @param {string} moduleDir - The module directory path.
 */
const handleModuleCreationError = (name, err, moduleDir) => {
    fail(`Failed to generate module package: ${name}`, err);
    cleanupModuleDirectory(moduleDir);
};

/**
 * Cleans up the module directory by removing it.
 * @param {string} moduleDir - The module directory path.
 */
const cleanupModuleDirectory = (moduleDir) => {
    rmSync(moduleDir, { recursive: true });
};

/**
 * Handles errors during module creation and exits the process.
 * @param {string} message - The error message.
 */
const handleErrorAndExit = (message) => {
    fail(message);
    exit(1);
};
