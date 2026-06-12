import common from './common';

const toolModules = import.meta.glob('./tools/*.ts', { eager: true });
const tools = {};

for (const path in toolModules) {
  const fileName = path.split('/').pop()?.replace('.ts', '');
  if (fileName) {
    tools[fileName] = toolModules[path].default;
  }
}

export default {
  ...common,
  tools
};