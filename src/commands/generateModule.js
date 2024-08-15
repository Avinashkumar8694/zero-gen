import { generateModulePackageInWorkspace } from '../utill/module';

export const generateModuleCommand = {
  name: 'generate module',
  description: 'Generate a new module',
  action: (name, description = 'No description') => {
    generateModulePackageInWorkspace(name, description);
    console.log(`Module '${name}' generated successfully.`);
  },
};
