import { startPluginsServer } from '../utill/startPluginServer';

export const serveCommand = {
  name: 'serve',
  description: 'Start the express server to serve plugins',
  action: (wsPath) => {
    startPluginsServer(wsPath);
    console.log('Plugins server started.');
  },
};
