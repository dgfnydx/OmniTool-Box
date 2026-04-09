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
  FileEdit,
  Signal,
  Languages,
  Repeat,
  Banknote,
  Image,
  Calendar,
  CalendarHeart,
  Baby,
  Accessibility,
  Flame,
  FileText,
  Baseline,
  FileImage,
  BarChart3,
  Crop,
  Pipette
} from 'lucide-vue-next';

export interface ToolMetadata {
  id: string;
  name: string;
  category: 'developer' | 'text' | 'image' | 'design' | 'calc' | 'life';
  icon: Component;
  description: string;
  component: () => Promise<any>;
}

export const tools: ToolMetadata[] = [
  // Developer
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
    id: 'doc-comparator',
    name: 'Document Comparator',
    category: 'developer',
    icon: markRaw(FileText),
    description: 'Compare two documents and highlight differences.',
    component: () => import('../tools/developer/DocComparator.vue')
  },

  // Text
  {
    id: 'word-counter',
    name: 'Word Counter',
    category: 'text',
    icon: markRaw(Type),
    description: 'Count words, characters, and sentences.',
    component: () => import('../tools/design/WordCounter.vue')
  },
  {
    id: 'word-frequency',
    name: 'Word Frequency',
    category: 'text',
    icon: markRaw(BarChart3),
    description: 'Analyze word frequency in text.',
    component: () => import('../tools/design/WordFrequency.vue')
  },
  {
    id: 'pinyin-converter',
    name: 'Chinese Pinyin Converter',
    category: 'text',
    icon: markRaw(Languages),
    description: 'Convert Chinese characters to Pinyin with tone options.',
    component: () => import('../tools/daily/PinyinConverter.vue')
  },
  {
    id: 'chinese-converter',
    name: 'Chinese S-T Converter',
    category: 'text',
    icon: markRaw(Repeat),
    description: 'Convert between Simplified and Traditional Chinese.',
    component: () => import('../tools/daily/ChineseConverter.vue')
  },
  {
    id: 'amount-to-uppercase',
    name: 'Amount to Uppercase',
    category: 'text',
    icon: markRaw(Banknote),
    description: 'Convert numbers to Chinese financial uppercase format.',
    component: () => import('../tools/daily/AmountToUppercase.vue')
  },
  {
    id: 'morse-converter',
    name: 'Morse Code Converter',
    category: 'text',
    icon: markRaw(Signal),
    description: 'Convert text to Morse code and vice versa.',
    component: () => import('../tools/developer/MorseCodeConverter.vue')
  },

  // Image
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    category: 'image',
    icon: markRaw(Crop),
    description: 'Crop and rotate images with custom aspect ratios.',
    component: () => import('../tools/design/ImageCropper.vue')
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    icon: markRaw(FileImage),
    description: 'Compress and resize images easily.',
    component: () => import('../tools/design/ImageCompressor.vue')
  },
  {
    id: 'image-color-picker',
    name: 'Image Color Picker',
    category: 'image',
    icon: markRaw(Pipette),
    description: 'Extract pixel colors from images with a magnifier.',
    component: () => import('../tools/design/ColorPicker.vue')
  },
  {
    id: 'photo-exif',
    name: 'Photo EXIF Extractor',
    category: 'image',
    icon: markRaw(Image),
    description: 'Extract and view EXIF metadata from image files.',
    component: () => import('../tools/design/PhotoExifExtractor.vue')
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    category: 'image',
    icon: markRaw(Palette),
    description: 'Generate customizable QR codes.',
    component: () => import('../tools/design/QRCodeGenerator.vue')
  },

  // Design
  {
    id: 'color-palette',
    name: 'Color Palette',
    category: 'design',
    icon: markRaw(Palette),
    description: 'Hex/RGB/HSL color converter and generator.',
    component: () => import('../tools/design/ColorPalette.vue')
  },
  {
    id: 'font-viewer',
    name: 'Font Viewer',
    category: 'design',
    icon: markRaw(Baseline),
    description: 'Preview system and local fonts.',
    component: () => import('../tools/design/FontViewer.vue')
  },
  {
    id: 'markdown-previewer',
    name: 'Markdown Previewer',
    category: 'design',
    icon: markRaw(FileEdit),
    description: 'Live preview for Markdown syntax.',
    component: () => import('../tools/design/MarkdownPreviewer.vue')
  },

  // Calculation
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    category: 'calc',
    icon: markRaw(Scale),
    description: 'Convert between different units.',
    component: () => import('../tools/daily/UnitConverter.vue')
  },
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    category: 'calc',
    icon: markRaw(Scale),
    description: 'Calculate Return on Investment and annualized ROI.',
    component: () => import('../tools/daily/ROICalculator.vue')
  },
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    category: 'calc',
    icon: markRaw(Clock),
    description: 'Calculate monthly payments and total interest.',
    component: () => import('../tools/daily/MortgageCalculator.vue')
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'calc',
    icon: markRaw(Accessibility),
    description: 'Calculate Body Mass Index.',
    component: () => import('../tools/daily/BMICalculator.vue')
  },
  {
    id: 'bmr-calculator',
    name: 'BMR Calculator',
    category: 'calc',
    icon: markRaw(Flame),
    description: 'Calculate Basal Metabolic Rate.',
    component: () => import('../tools/daily/BMRCalculator.vue')
  },

  // Life
  {
    id: 'timer',
    name: 'Timer',
    category: 'life',
    icon: markRaw(Timer),
    description: 'Simple countdown timer.',
    component: () => import('../tools/daily/Timer.vue')
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    category: 'life',
    icon: markRaw(KeyRound),
    description: 'Create secure and random passwords.',
    component: () => import('../tools/daily/PasswordGenerator.vue')
  },
  {
    id: 'solar-terms',
    name: 'Solar Terms',
    category: 'life',
    icon: markRaw(Calendar),
    description: 'Quick check for the 24 solar terms of the year.',
    component: () => import('../tools/daily/SolarTerms.vue')
  },
  {
    id: 'safe-period-calculator',
    name: 'Safe Period Calculator',
    category: 'life',
    icon: markRaw(CalendarHeart),
    description: 'Predict menstrual cycle and safe periods.',
    component: () => import('../tools/daily/SafePeriodCalculator.vue')
  },
  {
    id: 'due-date-calculator',
    name: 'Due Date Calculator',
    category: 'life',
    icon: markRaw(Baby),
    description: 'Calculate delivery date and track progress.',
    component: () => import('../tools/daily/DueDateCalculator.vue')
  }
];

export const getToolById = (id: string) => tools.find(t => t.id === id);
