import { logExecution, getCurrentPath, getProjectPath ,getPackagesPaths} from '../utill/cmd.js';
import {kebabCase } from 'change-case';
import {filterPackagePathsByPackageName} from '../utill/fsUtill.js'
import { success, progress } from './log.js';
import { join,sep } from 'node:path';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { build as _build } from 'vite';
const buildPlugin = async (pluginPath, wsPath, name) => {
    const paths = filterPackagePathsByPackageName(name, getPackagesPaths());
    progress('Build in progress...');

    // TypeScript compilation for the workspace
    try {
        execSync('npx tsc -p ./tsconfig.json', {
            cwd: wsPath,
            stdio: 'inherit',
        });
    } catch (error) {
        console.error('TypeScript compilation failed:', error);
        throw error;
    }

    // Building packages concurrently
    const buildPromises = paths.map(async (_p) => {
        const packageName = _p.split(sep).pop();
        const packageJsonPath = join(_p, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

        // Determine the entry file for the build based on package configuration
        const buildfile = join(
            _p,
            packageJson?.zero?.component ? `${kebabCase(packageName)}.ts` : 
            packageJson?.zero?.module ? 'index.js' : ''
        );
        
        if (!buildfile) {
            console.warn(`Skipping build for ${_p} due to missing entry point`);
            return;
        }

        const output = join(_p, 'dist');

        // Build configuration for each package
        await _build({
            build: {
                lib: {
                    entry: buildfile,
                    name: packageJson.name,
                    fileName: () => `${packageJson.name}.js`,
                    formats: ['es'],
                },
                outDir: output,
                minify: true,
                emptyOutDir: true,
            },
        });
    });

    // Wait for all builds to complete
    try {
        await Promise.all(buildPromises);
        progress('Build successful!');
    } catch (error) {
        console.error('Error occurred during build:', error);
    }
};

export const build = async (currentPath,name) => {
    const pluginPath = getProjectPath(name);
    await buildPlugin(pluginPath,currentPath,name);
}