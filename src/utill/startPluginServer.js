import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { platform } from 'node:process';
import { join } from 'node:path';
/**
 * Starts the plugins server.
 * 
 * @param {string} wsPath - The path to the workspace.
 */
export const startPluginsServer = async (wsPath) => {
    const serverRoot = join(wsPath, 'server');

    // Check if the server root directory exists
    if (!existsSync(serverRoot)) {
        console.log('plugins server not found');
        return;
    }

    // Define the command and arguments based on the platform
    const indexFile = 'index.js';
    const nodeCommand = platform === 'win32' ? 'node.exe' : 'node';
    const args = ['--watch', indexFile];

    // Construct the command string
    const command = [nodeCommand, ...args].join(' ');

    try {
        // Execute the command
        execSync(command, {
            cwd: serverRoot,
            stdio: 'inherit',
            env: {
                PORT: '5555',
                BASE_PATH: '/service',
                PLUGIN_DIR_ROOT: 'plugins',
            },
        });
    } catch (error) {
        failed('Failed to start the plugins server');
        console.error(error.message);
    }
};
