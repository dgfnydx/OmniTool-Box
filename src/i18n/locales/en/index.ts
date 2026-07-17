import common from './common';

const toolModules = import.meta.glob('./tools/*.ts', { eager: true }) as Record<string, { default: any }>;
const tools: Record<string, any> = {};

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