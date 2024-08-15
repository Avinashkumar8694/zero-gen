import { createServer } from 'vite';

/**
 * Serve the plugin using Vite.
 * @param {string} wsPath - The path to the workspace.
 * @param {number} port - The port to serve the plugin.
 */
export const servePlugin = async (wsPath, port) => {
    try {
        const server = await createViteServer(wsPath, port);
        await startViteServer(server);
        displayServerUrls(server);
        bindServerCLIShortcuts(server);
    } catch (error) {
        handleErrorAndExit(`Failed to serve plugin: ${error.message}`);
    }
};

/**
 * Create a Vite server instance.
 * @param {string} wsPath - The path to the workspace.
 * @param {number} port - The port to serve the plugin.
 * @returns {Promise<ViteDevServer>} - The Vite server instance.
 */
const createViteServer = (wsPath, port) => {
    return createServer({
        configFile: false,
        root: wsPath,
        server: {
            port,
        },
    });
};

/**
 * Start the Vite server and listen on the specified port.
 * @param {ViteDevServer} server - The Vite server instance.
 */
const startViteServer = async (server) => {
    await server.listen();
};

/**
 * Display the server URLs in the console.
 * @param {ViteDevServer} server - The Vite server instance.
 */
const displayServerUrls = (server) => {
    server.printUrls();
};

/**
 * Bind CLI shortcuts for the Vite server.
 * @param {ViteDevServer} server - The Vite server instance.
 */
const bindServerCLIShortcuts = (server) => {
    server.bindCLIShortcuts({ print: true });
};

/**
 * Handle errors by logging and exiting the process.
 * @param {string} message - The error message.
 */
const handleErrorAndExit = (message) => {
    console.error(message);
    process.exit(1);
};
