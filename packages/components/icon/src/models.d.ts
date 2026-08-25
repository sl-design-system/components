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
export type IconStyle = 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands' | 'semibold';
export type IconPrefix =
  | 'fas'
  | 'fass'
  | 'far'
  | 'fasr'
  | 'fal'
  | 'fasl'
  | 'fat'
  | 'fast'
  | 'fad'
  | 'fadr'
  | 'fadl'
  | 'fadt'
  | 'fasds'
  | 'fasdr'
  | 'fasdl'
  | 'fasdt'
  | 'fab'
  | 'faslr'
  | 'faslpr'
  | 'fawsb'
  | 'fatl'
  | 'fans'
  | 'fands'
  | 'faes'
  | 'fajr'
  | 'fajfr'
  | 'fajdr'
  | 'facr'
  | 'fausb'
  | 'faudsb'
  | 'faufsb'
  | 'fak'
  | 'fakd'
  | `fa${string}`;
export type IconPathData = string | string[];
export interface IconLookup {
  prefix: IconPrefix;
  iconName: string;
}
export interface IconDefinition extends IconLookup {
  icon: [number, number, string[], string, IconPathData];
}
