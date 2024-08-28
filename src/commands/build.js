import { build } from '../utill/buildManager.js';
import { logExecution, getCurrentPath, getProjectPath } from '../utill/cmd.js'

export const buildCommand = {
  name: 'build <pluginName>',
  description: 'Compile or package the project',
  action: async (pluginName) => {
    const path = getCurrentPath();
    if (!pluginName) {
      throw new Error('invalid plugin name');
    }
    await build(path,pluginName);
    console.log(`Build completed for ${' with plugin: ' + pluginName}.`);
  },
};
