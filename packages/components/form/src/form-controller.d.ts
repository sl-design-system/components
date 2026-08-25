import { type LitElement, type ReactiveController, type ReactiveControllerHost } from 'lit';
import { type FormControl } from './form-control-mixin.js';
import { type Form } from './form.js';
export interface FormControllerOptions {
  selector: string;
}
export declare class FormController<T extends Record<string, any> = Record<string, any>>
  extends EventTarget
  implements ReactiveController
{
  #private;
  get controls(): Record<keyof T, HTMLElement & FormControl>;
  get dirty(): boolean | undefined;
  get element(): Form<T> | undefined;
  get invalid(): boolean | undefined;
  get pristine(): boolean | undefined;
  get showValidity(): boolean | undefined;
  get touched(): boolean | undefined;
  get untouched(): boolean | undefined;
  get valid(): boolean | undefined;
  get value(): T | undefined;
  set value(value: T | undefined);
  constructor(host: ReactiveControllerHost & LitElement, options?: Partial<FormControllerOptions>);
  /** @internal */
  hostConnected(): void;
  /** @internal */
  hostUpdated(): void;
  /** @internal */
  hostDisconnected(): void;
  reportValidity(): boolean;
  reset(): void;
}
