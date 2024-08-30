import { generateModulePackageInWorkspace } from '../utill/module.js';

export const generateModuleCommand = {
  name: 'generate module',
  description: 'Generate a new module',
  action: (wspath,name, description = 'No description') => {
    generateModulePackageInWorkspace(wspath, name, description);
    console.log(`Module '${name}' generated successfully.`);
  },
};
