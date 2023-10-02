import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { DirectiveResult } from 'lit/directive';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class AbstractControl<TValue = any, TRawValue extends TValue = TValue> implements ReactiveController {
  #value!: TValue;

  host: ReactiveControllerHost;

  get value(): TValue {
    return this.#value;
  }

  protected set value(value: TValue) {
    this.#value = value;
  }

  constructor(host: ReactiveControllerHost) {
    (this.host = host).addController(this);
  }

  hostConnected(): void {
    console.log('hostConnected');
  }

  abstract bind(name: string): DirectiveResult;

  abstract getRawValue(): TValue;

  abstract setValue(value: TRawValue): void;

  abstract patchValue(value: TValue): void;
}
