import {workspace} from '../utill/project.js'

export const createWorkspaceCommand = {
  name: 'init <projectName>',
  description: 'Initialize a new project',
  action: (name,path) => {
    workspace(name,path);
  },
};
