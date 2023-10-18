import type { Signal } from '@lit-labs/preact-signals';
import { signal } from '@lit-labs/preact-signals';
import { TextInput } from '@sl-design-system/text-input';

export type FormControlAdpaterUpdateOn = 'blur' | 'change';

export interface FormControlAdapterOptions {
  updateOn: FormControlAdpaterUpdateOn;
}

export class FormControlAdapter<T extends Element = Element, U = string> {
  element!: T;
  value!: Signal<U>;

  disconnect(): void {}
  setValue(_value: U): void {}
}

export class TextInputAdapter extends FormControlAdapter<TextInput, string> {
  static canAdapt(element: Element): boolean {
    return element instanceof TextInput;
  }

  updateOn: FormControlAdpaterUpdateOn;
  override readonly element: TextInput;
  override readonly value: Signal<string>;

  constructor(element: Element, options?: FormControlAdapterOptions) {
    super();

    this.element = element as TextInput;
    this.updateOn = options?.updateOn ?? 'change';
    this.value = signal(this.element.value ?? '');

    element.addEventListener('blur', this.#onBlur);
    element.addEventListener('input', this.#onInput);
  }

  override disconnect(): void {
    this.element.removeEventListener('input', this.#onInput);
    this.element.removeEventListener('blur', this.#onBlur);
  }

  override setValue(value: string): void {
    this.element.value = value;
    this.value.value = value;
  }

  #onBlur = (): void => {
    if (this.updateOn === 'blur') {
      this.value.value = this.element.value ?? '';
    }
  };

  #onInput = (): void => {
    if (this.updateOn === 'change') {
      this.value.value = this.element.value ?? '';
    }
  };
}
