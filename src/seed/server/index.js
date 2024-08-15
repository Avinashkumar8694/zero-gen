import express from 'express';
import fs from 'fs';
import path from 'path';
import { env } from 'node:process';

const app = express();
const port = env.PORT || 3000;
const basePath = env.BASE_PATH || '';

app.use(express.json()); // Middleware to parse JSON bodies

// Create the application and setup routes
const createApp = () => {
    setupRoutes(app, basePath);

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}${basePath}`);
    });

    return app;
};

// Setup application routes and middleware
const setupRoutes = (app, basePath) => {
    const router = express.Router();

    // Ping endpoint
    router.get('/ping', (req, res) => {
        res.json({ message: 'Hello World!' });
    });

    // List files in the 'plugins' directory
    router.get('/files', (req, res) => {
        const pluginsDir = path.resolve('plugins');
        fs.readdir(pluginsDir, (err, files) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to list files' });
            }
            res.json({ files });
        });
    });

    // Add a new file
    router.post('/files', (req, res) => {
        const { fileName, content } = req.body;
        const filePath = path.join('plugins', fileName);

        if (!fileName || !content) {
            return res.status(400).json({ error: 'File name and content are required' });
        }

        fs.writeFile(filePath, content, err => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write file' });
            }
            res.status(201).json({ message: 'File created' });
        });
    });

    // Delete a file
    router.delete('/files/:fileName', (req, res) => {
        const filePath = path.join('plugins', req.params.fileName);

        fs.unlink(filePath, err => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete file' });
            }
            res.json({ message: 'File deleted' });
        });
    });

    // Serve static files from 'plugins' directory
    router.use('/plugins', express.static('plugins'));

    app.use(basePath, router);
};

// Initialize and run the application
createApp();
