import { servePlugin } from '../utill/startWorkspace.js';
export const startCommand = {
  name: 'start',
  description: 'Start the development server',
  action: (wsPath,port = '9898') => {
    servePlugin(wsPath,port);
    console.log(`Server started on port ${port}.`);
  },
};
