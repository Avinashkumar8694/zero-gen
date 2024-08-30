import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { join } from 'node:path';
const currentDirectory = dirname(fileURLToPath(import.meta.url));
export const pluginJsonPath = dir => {
    return join(dir, 'plugin.json');
};

export const templatePath = () =>{
    return join(currentDirectory, '../seed');
}
export const componentTemplatesPath = () => {
    return join(templatePath(), 'component');
};
export const moduleTemplatesPath = () => {
    return join(templatePath(), 'module');
};