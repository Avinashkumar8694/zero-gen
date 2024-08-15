import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { done, failed, inprogress, log } from './log.js'
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const currentDirectory = dirname(fileURLToPath(import.meta.url));
export const createDirectory = (dir, success_msg, error_msg) => {
    try {
        mkdirSync(dir);
        done(`${success_msg}`);
    } catch (e) {
        failed(`${error_msg}`, e);
        exit(1);
    }
};
export const copySync = (source, dest, success_msg, err_msg) => {
    try {
        cpSync(source, dest, {
            recursive: true,
        });
        done(`${success_msg}`);
    } catch (e){
        failed(`${err_msg}`, e);
        exit(1);
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
        'zero-annotation': '^1.0.4',
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