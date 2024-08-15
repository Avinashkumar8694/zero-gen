import { fileURLToPath } from 'node:url';
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
    return join(templatesPath(), 'module');
};