import type { IconStyle } from '@fortawesome/fontawesome-common-types';
interface SLIconDefinition {
    value: string;
    type: string;
    description: string;
}
interface CustomIconDefinition extends SLIconDefinition {
    svg: string;
}
export declare const resolveIcon: (name: string, style: IconStyle, icons: {
    [key: string]: SLIconDefinition | CustomIconDefinition;
}) => string;
export {};
