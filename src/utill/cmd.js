import { execSync } from 'node:child_process';
import { clean } from './fsUtill.js';
import { success, fail, progress } from './log.js'
import { join } from 'node:path';
import { cwd } from 'node:process';
export const executecmd = (cmd, dir, success_msg, err_msg) => {
    try {
        execSync(cmd, {
            cwd: dir,
        });
        success(`${success_msg}`);
    } catch(e){
        fail(err_msg);
        clean(dir);
        process.exit(1);
    }
};
export const handleException = (dir) => {
    process.on('SIGINT', () => {
        clean(dir);
        process.exit(0);
    });
    process.on('SIGTERM', () => {
        clean(dir);
        process.exit(0);
    });
}

export const logExecution = (task, details) => {
    console.log(`Task: ${task}`);
    console.log('Details:', JSON.stringify(details, null, 2));
};
export const getProjectPath = (name) => join(cwd(), name);
export const getCurrentPath = () => cwd();
export const getPackagesPaths = () => join(cwd(), "packages");