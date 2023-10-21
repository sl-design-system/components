import type { AbstractControlUpdateOn } from './abstract-control.js';
import type { Constructor } from '@sl-design-system/shared';
import type { Signal } from '@lit-labs/preact-signals';

interface FormControlAdapterClass extends Constructor<FormControlAdapter> {
  canAdapt(element: Element): boolean;
}

export interface FormControlAdapterOptions {
  updateOn: AbstractControlUpdateOn;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FormControlAdapter<T = any> {
  static adapters: FormControlAdapterClass[] = [];

  static create<U>(element: Element, options?: FormControlAdapterOptions): FormControlAdapter<U> | null {
    const adapter = this.adapters.find(a => a.canAdapt(element));

    if (adapter === undefined) {
      return null;
    }

    return new adapter(element, options) as FormControlAdapter<U>;
  }

  static register(adapter: FormControlAdapterClass): void {
    this.adapters = [...this.adapters, adapter];
  }

  element!: Element;
  value!: Signal<T>;

  disconnect(): void {}
  setValue(_value: T | undefined): void {}
}
