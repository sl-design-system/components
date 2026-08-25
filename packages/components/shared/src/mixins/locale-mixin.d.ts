import { type Constructor } from '@open-wc/dedupe-mixin';
import { type ReactiveElement } from 'lit';
export interface Locale {
  locale?: string;
}
export declare function LocaleMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<Locale>;
