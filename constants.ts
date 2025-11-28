import { FontOption, HandwritingConfig, InkColor, PaperType } from './types';

export const HANDWRITING_FONTS: FontOption[] = [
  { name: 'Caveat', family: '"Caveat", cursive' },
  { name: 'Patrick Hand', family: '"Patrick Hand", cursive' },
  { name: 'Indie Flower', family: '"Indie Flower", cursive' },
  { name: 'Shadows Into Light', family: '"Shadows Into Light", cursive' },
  { name: 'Homemade Apple', family: '"Homemade Apple", cursive' },
  { name: 'Reenie Beanie', family: '"Reenie Beanie", cursive' },
  { name: 'Zeyada', family: '"Zeyada", cursive' },
  { name: 'Dancing Script', family: '"Dancing Script", cursive' },
  { name: 'Gloria Hallelujah', family: '"Gloria Hallelujah", cursive' },
  // Chinese Fonts
  { name: 'Zhi Mang Xing (中文)', family: '"Zhi Mang Xing", cursive' },
  { name: 'Long Cang (中文)', family: '"Long Cang", cursive' },
  { name: 'Ma Shan Zheng (中文)', family: '"Ma Shan Zheng", cursive' },
  { name: 'Liu Jian Mao Cao (中文)', family: '"Liu Jian Mao Cao", cursive' },
];

export const DEFAULT_CONFIG: HandwritingConfig = {
  fontFamily: '"Caveat", cursive',
  fontSize: 24,
  paperType: PaperType.LINED,
  inkColor: InkColor.BLUE,
  lineHeight: 1.5,
  letterSpacing: 0,
  messiness: 0.3,
  margins: 40,
};

export const PAPER_STYLES: Record<PaperType, { name: string; bg: string; line: string }> = {
  [PaperType.PLAIN]: { name: 'Plain White', bg: '#ffffff', line: 'transparent' },
  [PaperType.LINED]: { name: 'Notebook Lined', bg: '#fdfbf7', line: '#a5b4fc' },
  [PaperType.GRID]: { name: 'Graph Paper', bg: '#ffffff', line: '#e2e8f0' },
  [PaperType.VINTAGE]: { name: 'Vintage Parchment', bg: '#f5e6d3', line: '#d6c0a6' },
  [PaperType.BLUEPRINT]: { name: 'Blueprint', bg: '#1e3a8a', line: '#60a5fa' },
};