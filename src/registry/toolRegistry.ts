import { type Component } from 'vue';
import i18n from '../i18n';
import { toolConfigs, type Category } from './tools';

export interface ToolMetadata {
  id: string;
  name: string;
  category: Category;
  icon: Component;
  description: string;
  component: () => Promise<any>;
}

// 自动导入所有工具组件
const toolComponents = import.meta.glob('../tools/**/*.vue');

// 包装函数避免类型推断过深
function getI18nKey(key: string): string {
  // @ts-ignore: vue-i18n type instantiation issue
  return i18n.global.t(key);
}

export const tools: ToolMetadata[] = toolConfigs.map(config => {
  const fullPath = `../tools/${config.path}`;
  const componentLoader = toolComponents[fullPath];

  if (!componentLoader) {
    console.warn(`[ToolRegistry] Component not found for tool: ${config.id} at ${fullPath}`);
  }

  return {
    id: config.id,
    category: config.category,
    icon: config.icon,
    // 使用 getter 以支持语言切换
    get name(): string {
      return getI18nKey(`tools.${config.id}.name`);
    },
    get description(): string {
      return getI18nKey(`tools.${config.id}.description`);
    },
    component: componentLoader as () => Promise<any>
  };
});

export const getToolById = (id: string) => tools.find(t => t.id === id);
