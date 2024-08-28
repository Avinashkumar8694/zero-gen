import { createComponentPackage } from '../utill/component.js';

export const generateComponentCommand = {
    name: 'generate component',
    description: 'Generate a new component',
    alias: 'c',
    action: async (dir,name, options) => {
        await createComponentPackage(dir,
            name,
            options.desc
        );
    },
};
