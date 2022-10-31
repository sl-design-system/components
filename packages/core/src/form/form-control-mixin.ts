import type { PropertyValues, ReactiveElement } from 'lit';
import type { Constructor, FormControlInterface } from '@open-wc/form-control';
import { FormControlMixin as OwcFormControlMixin } from '@open-wc/form-control';

export interface FormControl extends FormControlInterface {
  labels: Set<WeakRef<Node>>;
}

let nextUniqueId = 0;

export function FormControlMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<FormControl> {
  class FormControlElement extends OwcFormControlMixin(constructor) implements FormControl {
    #labels = new Set<WeakRef<HTMLLabelElement>>();
    #onLabelClick = (event: Event): void => this.onLabelClick(event);

    get labels(): Set<WeakRef<HTMLLabelElement>> {
      return this.#labels;
    }

    disconnectedCallback(): void {
      this.#labels.forEach(ref => ref.deref()?.removeEventListener('click', this.#onLabelClick));
      this.#labels.clear();

      super.disconnectedCallback();
    }

    firstUpdated(changes: PropertyValues<this>): void {
      super.firstUpdated(changes);

      const ids = Array.from(this.internals.labels)
        .filter((label): label is HTMLLabelElement => label instanceof HTMLLabelElement)
        .map(label => {
          label.id = `sl-label-${nextUniqueId++}`;
          label.addEventListener('click', this.#onLabelClick);

          this.#labels.add(new WeakRef(label));

          return label.id;
        });

      this.setAttribute('aria-labelledby', ids.join(' '));
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onLabelClick(_event: Event): void {}
  }

  return FormControlElement;
}
