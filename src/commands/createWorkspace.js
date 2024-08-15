import {workspace} from '../utill/project.js'

export const createWorkspaceCommand = {
  name: 'new',
  description: 'Create a new workspace',
  action: (name) => {
    workspace(name,join(cwd(), name));
  },
};
