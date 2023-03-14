interface SLIconDefinition {
    value: string;
    type: string;
    description: string;
}
interface CustomIconDefinition extends SLIconDefinition {
    svg: string;
}
export declare const resolveIcon: (name: string, icons: {
    [key: string]: SLIconDefinition | CustomIconDefinition;
}) => string;
export {};
