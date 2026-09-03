import {
  FileText, Type, CaseUpper, CaseLower, Heading, ArrowLeftRight,
  AlignJustify, Link, Code2, SlidersHorizontal, Minus, Mail,
  Globe, Search, ListFilter, Repeat, Binary, ListOrdered,
  WrapText, Copy, Calculator, Percent, Scale, Calendar,
  TrendingUp, DollarSign, Landmark, Thermometer, ThermometerSnowflake,
  Ruler, ArrowRightLeft, Braces, FileJson, Code, Terminal,
  ShieldCheck, KeyRound, Link2, Unlink, Cpu, Fingerprint,
  Key, Dices, Coins, Palette, Pipette, Wifi,
  Network, Clock, ImagePlus, BrainCircuit, Image, FileQuestion,
  Video, Hash, Bot, Stethoscope, Sparkles, Film, Heart,
  UploadCloud, Minimize2, RefreshCw, FileImage, FileDown, FileCode2,
  LayoutTemplate, Smartphone, Wand2, LucideIcon
} from 'lucide-react';
import { Tool } from '../types';

/**
 * Mapping of tool IDs to their specific representative Lucide icon.
 * Ensures consistent visual hierarchy across Home, Tool Grid, and Tool Pages.
 */
export const TOOL_ICON_MAP: Record<string, LucideIcon> = {
  // AI Tools
  'ai-image-generator': ImagePlus,
  'ai-question-solver': BrainCircuit,
  'ai-question-solver-image': Image,
  'ai-text-question-solver': FileQuestion,
  'ai-video-title-generator': Video,
  'ai-hashtag-generator': Hash,
  'ai-chatbot': Bot,
  'ai-girlfriend': Heart,
  'ai-health-information': Stethoscope,
  'ai-prompt-generator': Sparkles,
  'ai-image-prompt-generator': Palette,
  'ai-video-prompt-generator': Film,

  // Text Tools
  'word-count': FileText,
  'char-count': Type,
  'uppercase': CaseUpper,
  'lowercase': CaseLower,
  'title-case': Heading,
  'reverse-text': ArrowLeftRight,
  'remove-spaces': AlignJustify,
  'slugify': Link,
  'camel-case': Code2,
  'snake-case': SlidersHorizontal,
  'kebab-case': Minus,
  'extract-emails': Mail,
  'extract-urls': Globe,
  'vowel-counter': Search,
  'consonant-counter': ListFilter,
  'palindrome-checker': Repeat,
  'string-bytes': Binary,
  'line-counter': ListOrdered,
  'remove-newlines': WrapText,
  'text-repeater': Copy,

  // Calculators & Math
  'tip-calculator': Calculator,
  'discount-calc': Percent,
  'bmi-calc': Scale,
  'age-calc': Calendar,
  'markup-calc': TrendingUp,
  'profit-margin': DollarSign,
  'loan-interest': Landmark,

  // Converters
  'celsius-to-fahrenheit': Thermometer,
  'fahrenheit-to-celsius': ThermometerSnowflake,
  'km-to-miles': Ruler,

  // Developer Tools
  'json-format': Braces,
  'json-minify': FileJson,
  'html-encode': Code,
  'html-decode': Terminal,
  'base64-encode': ShieldCheck,
  'base64-decode': KeyRound,
  'url-encode': Link2,
  'url-decode': Unlink,
  'binary-encode': Binary,
  'binary-decode': Cpu,

  // Generators
  'uuid-v4': Fingerprint,
  'password-gen': Key,
  'random-number': Dices,
  'coin-flip': Coins,
  'dice-roll': Dices,
  'random-hex': Palette,
  'random-rgb': Pipette,
  'mac-address': Wifi,
  'ipv4-gen': Network,
  'timestamp-now': Clock,

  // Media & Image Tools
  'image-hosting': UploadCloud,
  'image-compressor': Minimize2,
  'image-converter': RefreshCw,

  // Document Tools
  'text-to-pdf': FileDown,
  'text-to-file': FileCode2,

  // Web Tools
  'html-viewer': LayoutTemplate,
  'url-shortener': Link2,
  'pwa-generator': Smartphone,
  'web-to-app': Globe,
};

/**
 * Category-level default icons
 */
export const CATEGORY_FALLBACK_ICONS: Record<string, LucideIcon> = {
  'AI Tools': Bot,
  'Text Tools': FileText,
  'Calculators': Calculator,
  'Converters': ArrowRightLeft,
  'Developer': Code2,
  'Generators': Sparkles,
  'Media Tools': FileImage,
  'Document Tools': FileDown,
  'Web Tools': LayoutTemplate,
};

/**
 * Category-specific badge styling for visually distinctive card icons
 */
export const CATEGORY_THEMES: Record<string, { badgeClasses: string; glowColor: string }> = {
  'AI Tools': {
    badgeClasses: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60 group-hover:bg-purple-600 group-hover:text-white',
    glowColor: 'rgba(168, 85, 247, 0.4)'
  },
  'Text Tools': {
    badgeClasses: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60 group-hover:bg-blue-600 group-hover:text-white',
    glowColor: 'rgba(59, 130, 246, 0.4)'
  },
  'Calculators': {
    badgeClasses: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 group-hover:bg-emerald-600 group-hover:text-white',
    glowColor: 'rgba(16, 185, 129, 0.4)'
  },
  'Converters': {
    badgeClasses: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60 group-hover:bg-amber-600 group-hover:text-white',
    glowColor: 'rgba(245, 158, 11, 0.4)'
  },
  'Developer': {
    badgeClasses: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 group-hover:bg-indigo-600 group-hover:text-white',
    glowColor: 'rgba(99, 102, 241, 0.4)'
  },
  'Generators': {
    badgeClasses: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/60 group-hover:bg-sky-600 group-hover:text-white',
    glowColor: 'rgba(14, 165, 233, 0.4)'
  },
  'Media Tools': {
    badgeClasses: 'bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800/60 group-hover:bg-fuchsia-600 group-hover:text-white',
    glowColor: 'rgba(217, 70, 239, 0.4)'
  },
  'Document Tools': {
    badgeClasses: 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800/60 group-hover:bg-teal-600 group-hover:text-white',
    glowColor: 'rgba(20, 184, 166, 0.4)'
  },
  'Web Tools': {
    badgeClasses: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/60 group-hover:bg-cyan-600 group-hover:text-white',
    glowColor: 'rgba(6, 182, 212, 0.4)'
  },
};

/**
 * Retrieve the representative Lucide icon for any tool
 */
export function getToolIcon(toolId: string, category?: string, defaultIcon?: LucideIcon): LucideIcon {
  if (TOOL_ICON_MAP[toolId]) {
    return TOOL_ICON_MAP[toolId];
  }
  if (defaultIcon) {
    return defaultIcon;
  }
  if (category && CATEGORY_FALLBACK_ICONS[category]) {
    return CATEGORY_FALLBACK_ICONS[category];
  }
  return Sparkles;
}

/**
 * Retrieve full meta information (Icon, badge styles) for a tool
 */
export function getToolIconMeta(tool: Tool) {
  const Icon = getToolIcon(tool.id, tool.category, tool.icon);
  const theme = CATEGORY_THEMES[tool.category] || {
    badgeClasses: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60 group-hover:bg-indigo-600 group-hover:text-white',
    glowColor: 'rgba(99, 102, 241, 0.4)'
  };

  return {
    Icon,
    badgeClasses: theme.badgeClasses,
    glowColor: theme.glowColor,
    category: tool.category
  };
}
