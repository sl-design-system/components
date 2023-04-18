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
export type IconStyle = 'solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands';
export type IconPrefix = 'fas' | 'far' | 'fal' | 'fat' | 'fad' | 'fab' | 'fak' | 'fass' | 'fasr' | 'fasl';
export type IconPathData = string | string[];
export interface IconLookup {
    prefix: IconPrefix;
    iconName: string;
}
export interface IconDefinition extends IconLookup {
    icon: [
        number,
        number,
        string[],
        string,
        IconPathData
    ];
}
