export enum PaperType {
  PLAIN = 'PLAIN',
  LINED = 'LINED',
  GRID = 'GRID',
  VINTAGE = 'VINTAGE',
  BLUEPRINT = 'BLUEPRINT'
}

export enum InkColor {
  BLACK = '#1a1a1a',
  BLUE = '#1e3a8a',
  RED = '#991b1b',
  PENCIL = '#525252',
  FOUNTAIN_BLUE = '#004aad'
}

export interface HandwritingConfig {
  fontFamily: string;
  fontSize: number;
  paperType: PaperType;
  inkColor: string;
  lineHeight: number;
  letterSpacing: number;
  messiness: number; // 0 to 1, controls random rotation/offset
  margins: number;
}

export interface FontOption {
  name: string;
  family: string; // The CSS font-family name
}

export interface GeneratedContent {
  text: string;
}
