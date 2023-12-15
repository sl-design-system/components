export type IconResolver = (name: string) => string;

export interface IconLibrary {
  [key: string]: CustomIconDefinition;
}

export interface CustomIconDefinition {
  svg: string;
  value?: string;
  type?: string;
  style?: string;
  description?: string;
}

// Copied from FontAwesome so we don't rely on it as a dependency
export type IconStyle = 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands';
export type IconPrefix = 'fas' | 'far' | 'fal' | 'fat' | 'fad' | 'fab' | 'fak' | 'fass' | 'fasr' | 'fasl' | 'fast';
export type IconPathData = string | string[];

export interface IconLookup {
  prefix: IconPrefix;
  // IconName is defined in the code that will be generated at build time and bundled with this file.
  iconName: string;
}

export interface IconDefinition extends IconLookup {
  icon: [
    number, // width
    number, // height
    string[], // ligatures
    string, // unicode
    IconPathData // svgPathData
  ];
}
