import common from './common';

const toolModules = import.meta.glob('./tools/*.ts', { eager: true });
const tools: Record<string, any> = {};

for (const path in toolModules) {
  const fileName = path.split('/').pop()?.replace('.ts', '');
  if (fileName) {
    tools[fileName] = (toolModules[path] as { default: any }).default;
  }
}

export default {
  ...common,
  tools
};