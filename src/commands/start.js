import { servePlugin } from '../utill/startWorkspace';
export const startCommand = {
  name: 'start',
  description: 'Start the development server',
  action: (port = '9898') => {
    servePlugin(wsPath,port);
    console.log(`Server started on port ${port}.`);
  },
};
