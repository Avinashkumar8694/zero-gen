import { generateComponentCommand } from './generateComponent.js';
import { generateModuleCommand } from './generateModule.js';
import { logExecution, getCurrentPath, getProjectPath } from '../utill/cmd.js'

export const generateModuleOrComponentCommand = {
    name: 'create <type> <name>',
    description: 'Create a new component or module',
    action: (type, name, options) => {
        const path = getCurrentPath();
        
        switch (type) {
            case 'component':
                generateComponentCommand.action(path, name, options);
                break;
            case 'module':
                generateModuleCommand.action(path, name,options.desc);
                break;
        }
        console.log(`Module '${name}' generated successfully.`);
    },
};
