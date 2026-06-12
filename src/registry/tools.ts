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

export type Category = 'developer' | 'text' | 'image' | 'design' | 'calc' | 'life';

export interface ToolConfig {
  id: string;
  category: Category;
  icon: Component;
  path: string; // 相对于 src/tools/ 的路径
}

export const toolConfigs: ToolConfig[] = [
  // Developer
  { id: 'json-formatter', category: 'developer', icon: markRaw(CodeXml), path: 'developer/JsonFormatter.vue' },
  { id: 'base64-converter', category: 'developer', icon: markRaw(Binary), path: 'developer/Base64Converter.vue' },
  { id: 'timestamp-converter', category: 'developer', icon: markRaw(Clock), path: 'developer/TimestampConverter.vue' },
  { id: 'base-converter', category: 'developer', icon: markRaw(Binary), path: 'developer/BaseConverter.vue' },
  { id: 'token-counter', category: 'developer', icon: markRaw(CodeXml), path: 'developer/TokenCounter.vue' },
  { id: 'doc-comparator', category: 'developer', icon: markRaw(FileText), path: 'developer/DocComparator.vue' },
  { id: 'morse-converter', category: 'text', icon: markRaw(Signal), path: 'developer/MorseCodeConverter.vue' },

  // Text / Daily (Merged into logical categories)
  { id: 'word-counter', category: 'text', icon: markRaw(Type), path: 'design/WordCounter.vue' },
  { id: 'word-frequency', category: 'text', icon: markRaw(BarChart3), path: 'design/WordFrequency.vue' },
  { id: 'pinyin-converter', category: 'text', icon: markRaw(Languages), path: 'daily/PinyinConverter.vue' },
  { id: 'chinese-converter', category: 'text', icon: markRaw(Repeat), path: 'daily/ChineseConverter.vue' },
  { id: 'amount-to-uppercase', category: 'text', icon: markRaw(Banknote), path: 'daily/AmountToUppercase.vue' },

  // Image
  { id: 'image-cropper', category: 'image', icon: markRaw(Crop), path: 'design/ImageCropper.vue' },
  { id: 'image-compressor', category: 'image', icon: markRaw(FileImage), path: 'design/ImageCompressor.vue' },
  { id: 'image-color-picker', category: 'image', icon: markRaw(Pipette), path: 'design/ColorPicker.vue' },
  { id: 'photo-exif', category: 'image', icon: markRaw(Image), path: 'design/PhotoExifExtractor.vue' },
  { id: 'qr-generator', category: 'image', icon: markRaw(Palette), path: 'design/QRCodeGenerator.vue' },

  // Design
  { id: 'color-palette', category: 'design', icon: markRaw(Palette), path: 'design/ColorPalette.vue' },
  { id: 'font-viewer', category: 'design', icon: markRaw(Baseline), path: 'design/FontViewer.vue' },
  { id: 'markdown-previewer', category: 'design', icon: markRaw(FileEdit), path: 'design/MarkdownPreviewer.vue' },

  // Calculation
  { id: 'unit-converter', category: 'calc', icon: markRaw(Scale), path: 'daily/UnitConverter.vue' },
  { id: 'roi-calculator', category: 'calc', icon: markRaw(Scale), path: 'daily/ROICalculator.vue' },
  { id: 'mortgage-calculator', category: 'calc', icon: markRaw(Clock), path: 'daily/MortgageCalculator.vue' },
  { id: 'bmi-calculator', category: 'calc', icon: markRaw(Accessibility), path: 'daily/BMICalculator.vue' },
  { id: 'bmr-calculator', category: 'calc', icon: markRaw(Flame), path: 'daily/BMRCalculator.vue' },

  // Life
  { id: 'timer', category: 'life', icon: markRaw(Timer), path: 'daily/Timer.vue' },
  { id: 'password-generator', category: 'life', icon: markRaw(KeyRound), path: 'daily/PasswordGenerator.vue' },
  { id: 'solar-terms', category: 'life', icon: markRaw(Calendar), path: 'daily/SolarTerms.vue' },
  { id: 'safe-period-calculator', category: 'life', icon: markRaw(CalendarHeart), path: 'daily/SafePeriodCalculator.vue' },
  { id: 'due-date-calculator', category: 'life', icon: markRaw(Baby), path: 'daily/DueDateCalculator.vue' }
];
