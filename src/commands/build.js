import { buildProject } from '../utils/buildManager.js';

export const buildCommand = {
  name: 'build',
  description: 'Build the project',
  action: (type, pluginName) => {
    if (type !== 'plugins' && type !== 'docker') {
      throw new Error('"build" must be "plugins" or "docker"');
    }
    buildProject(type, pluginName);
    console.log(`Build completed for ${type}${pluginName ? ' with plugin: ' + pluginName : ''}.`);
  },
};
