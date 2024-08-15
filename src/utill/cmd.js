import { execSync } from 'node:child_process';
import { clean } from './fsUtill.js';
import { success, fail, progress } from './log'
export const executecmd = (cmd, dir, success_msg, err_msg) => {
    try {
        execSync(cmd, {
            cwd: dir,
        });
        success(`${success_msg}`);
    } catch(e){
        fail(err_msg);
        clean(dir);
        exit(1);
    }
};
export const handleException = (dir) => {
    process.on('SIGINT', () => {
        clean(dir);
        exit(0);
    });
    process.on('SIGTERM', () => {
        clean(dir);
        exit(0);
    });
}