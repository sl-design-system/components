import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { DirectiveResult } from 'lit/directive.js';
import type { ValidatorFn } from './validators.js';
import type { FormControlAdapter } from './accessors.js';
import type { Constructor } from '@sl-design-system/shared';

interface FormControlAdapterClass extends Constructor<FormControlAdapter> {
  canAdapt(element: Element): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class AbstractControl<TValue = any, TRawValue extends TValue = TValue> implements ReactiveController {
  static adapters: FormControlAdapterClass[] = [];

  static addAdapter(adapter: FormControlAdapterClass): void {
    this.adapters = [...this.adapters, adapter];
  }

  static removeAdapter(adapter: FormControlAdapterClass): void {
    this.adapters = this.adapters.filter(a => a !== adapter);
  }

  #value!: TValue;

  adapter: FormControlAdapter | null = null;
  host: ReactiveControllerHost;
  validators: ValidatorFn[];

  get value(): TValue {
    return this.#value;
  }

  protected set value(value: TValue) {
    this.#value = value;
  }

  constructor(host: ReactiveControllerHost, validators: ValidatorFn[]) {
    (this.host = host).addController(this);
    this.validators = validators.slice();
  }

  hostConnected(): void {}

  abstract bind(name: string): DirectiveResult;

  abstract getRawValue(): TValue;

  abstract patchValue(value: TValue): void;

  abstract setValue(value: TRawValue): void;

  public setBoundElement(host: Element | null): void {
    if (!host) {
      this.adapter?.disconnect();
      this.adapter = null;

      return;
    }

    const adapter = AbstractControl.adapters.find(a => a.canAdapt(host));

    if (adapter === undefined) {
      throw new Error(`Could not find a form control adapter for element: ${host.tagName.toLowerCase()}`);
    }

    this.adapter = new adapter(host);
    console.log('setBoundElement', this.adapter);
  }

  _find(_name: string): AbstractControl | null {
    return null;
  }

  /**
   * Retrieves a child control given the control's name or path.
   * @param path - The path (property name) of the child control's name to retrieve.
   * @returns The child control associated with the specified key, or null if not found.
   */
  public get(path: string | string[]): AbstractControl | null {
    const paths: string[] = Array.isArray(path) ? path : path.split('.');

    return paths.reduce((control: AbstractControl | null, name: string) => {
      return control?._find(name) || null;
    }, this);
  }
}
