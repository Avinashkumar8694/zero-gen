import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { success, fail, progress } from './log.js'
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import fs from 'fs';
import path from 'path';
const currentDirectory = dirname(fileURLToPath(import.meta.url));
export const createDirectory = (dir, success_msg, error_msg) => {
    try {
        mkdirSync(dir);
        success(`${success_msg}`);
    } catch (e) {
        fail(`${error_msg}`, e);
        process.exit(1);
    }
};
export const copySync = (source, dest, success_msg, err_msg) => {
    try {
        cpSync(source, dest, {
            recursive: true,
        });
        success(`${success_msg}`);
    } catch (e){
        fail(`${err_msg}`, e);
        process.exit(1);
    }
};

export const updatePackageJson = (filePath, updates) => {
    const pkgJson = JSON.parse(readFileSync(filePath, 'utf-8'));
    Object.assign(pkgJson, updates);
    return pkgJson;
};

export const addDefaultScripts = pkgJson => {
    pkgJson.scripts = {
        ...pkgJson.scripts,
        build: 'zero-gen build',
        start: 'zero-gen start',
        serve: 'zero-gen serve',
    };
};

export const addDefaultDependencies = pkgJson => {
    pkgJson.devDependencies = {
        lit: '^3.1.4',
        typescript: '^5.2.2',
        'zero-annotation': '^1.0.9',
    };
    pkgJson.dependencies = {
        express: '^4.19.2',
    };
};



export const copyAssets = (componentDir) => {
    cpSync(join(currentDirectory, '../seed/assets'),join(componentDir, 'assets'), {
        recursive: true,
    });
}

export const clean = dir => {
    rmSync(dir, { recursive: true });
};


// Function to get all package directories
export const getPackagePathsSync = (dir) => {
    const packagePaths = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            packagePaths.push(fullPath);
        }
    }

    return packagePaths;
}

// Function to filter package paths by package name from package.json
export const filterPackagePathsByPackageName = (packageName, packagesDir) => {
    const packagePaths = getPackagePathsSync(packagesDir);
    
    return packagePaths.filter(packagePath => {
        const packageJsonPath = path.join(packagePath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            return packageJson.name === packageName;
        }
        return false;
    });
}