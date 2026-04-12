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
    const nodeCommand = platform === 'win32' ? 'node.exe' : process.execPath;
    const args = ['--watch', indexFile];

    // Attempt to clear port 5555 if it's already in use (Mac/Linux)
    if (platform !== 'win32') {
        try {
            console.log('Checking for existing process on port 5555...');
            execSync('lsof -ti:5555 | xargs kill -9 2>/dev/null || true');
        } catch (e) { /* Ignore if no process found */ }
    }

    // Construct the command string
    const command = [nodeCommand, ...args].join(' ');

    try {
        // Execute the command
        execSync(command, {
            cwd: serverRoot,
            stdio: 'inherit',
            env: {
                ...process.env,
                PORT: '5555',
                BASE_PATH: '/service',
                PLUGIN_DIR_ROOT: 'plugins',
            },
        });
    } catch (error) {
        console.error('Failed to start the plugins server');
        console.error(error.message);
    }
};
