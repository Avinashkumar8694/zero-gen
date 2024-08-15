import { createComponentPackage } from '../utill/component';

export const generateComponentCommand = {
    name: 'generate component',
    description: 'Generate a new component',
    alias: 'c',
    action: async (name, options) => {
        await createComponentPackage(cwd(),
            name,
            options.description
        );
    },
};
