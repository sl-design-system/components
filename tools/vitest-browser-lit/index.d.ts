import { type TemplateResult } from 'lit';

export declare function fixture<T extends HTMLElement>(template: string | Node | TemplateResult, options?: {}): Promise<T>;

export declare function cleanup(): void;
