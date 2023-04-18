import type { ReactiveElement, TemplateResult } from 'lit';
import type { Constructor } from '../types.js';
export interface HintInterface {
    hint?: string;
    renderHint(): TemplateResult;
}
export declare function HintMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<HintInterface>;
