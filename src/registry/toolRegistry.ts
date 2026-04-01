import { markRaw, type Component } from 'vue';
import { 
  CodeXml, 
  Binary, 
  Clock, 
  KeyRound, 
  Scale, 
  Timer, 
  Type, 
  Palette, 
  FileEdit 
} from 'lucide-vue-next';

export interface ToolMetadata {
  id: string;
  name: string;
  category: 'developer' | 'daily' | 'design';
  icon: Component;
  description: string;
  component: () => Promise<any>;
}

export const tools: ToolMetadata[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    category: 'developer',
    icon: markRaw(CodeXml),
    description: 'Clean and format your JSON code.',
    component: () => import('../tools/developer/JsonFormatter.vue')
  },
  {
    id: 'base64-converter',
    name: 'Base64 Converter',
    category: 'developer',
    icon: markRaw(Binary),
    description: 'Encode and decode Base64 data.',
    component: () => import('../tools/developer/Base64Converter.vue')
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    category: 'developer',
    icon: markRaw(Clock),
    description: 'Convert Unix timestamps to readable dates.',
    component: () => import('../tools/developer/TimestampConverter.vue')
  },
  {
    id: 'base-converter',
    name: 'Base Converter',
    category: 'developer',
    icon: markRaw(Binary),
    description: 'Convert numbers between different bases.',
    component: () => import('../tools/developer/BaseConverter.vue')
  },
  {
    id: 'token-counter',
    name: 'Token Counter',
    category: 'developer',
    icon: markRaw(CodeXml),
    description: 'Count GPT-3.5/GPT-4 tokens accurately.',
    component: () => import('../tools/developer/TokenCounter.vue')
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    category: 'daily',
    icon: markRaw(KeyRound),
    description: 'Create secure and random passwords.',
    component: () => import('../tools/daily/PasswordGenerator.vue')
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    category: 'daily',
    icon: markRaw(Scale),
    description: 'Convert between different units.',
    component: () => import('../tools/daily/UnitConverter.vue')
  },
  {
    id: 'timer',
    name: 'Timer',
    category: 'daily',
    icon: markRaw(Timer),
    description: 'Simple countdown timer.',
    component: () => import('../tools/daily/Timer.vue')
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    category: 'design',
    icon: markRaw(Type),
    description: 'Count words, characters, and sentences.',
    component: () => import('../tools/design/WordCounter.vue')
  },
  {
    id: 'color-palette',
    name: 'Color Palette',
    category: 'design',
    icon: markRaw(Palette),
    description: 'Hex/RGB/HSL color converter and generator.',
    component: () => import('../tools/design/ColorPalette.vue')
  },
  {
    id: 'markdown-previewer',
    name: 'Markdown Previewer',
    category: 'design',
    icon: markRaw(FileEdit),
    description: 'Live preview for Markdown syntax.',
    component: () => import('../tools/design/MarkdownPreviewer.vue')
  }
];

export const getToolById = (id: string) => tools.find(t => t.id === id);
