import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Listbox, Option } from '@sl-design-system/listbox';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, css, html } from 'lit';
import { state } from 'lit/decorators.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox-poc': ComboboxPoc;
  }
}

let nextUniqueId = 0;

export class ComboboxPoc extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
  `;

  @state() currentOption?: Option;

  @state() input?: HTMLInputElement;

  @state() listbox?: Listbox;

  @state() options?: Option[];

  override render(): TemplateResult {
    return html`
      <sl-text-field @focusout=${this.#onFocusout} @keydown=${this.#onKeydown}>
        <slot @slotchange=${this.#onInputSlotChange} name="input" slot="input"></slot>
      </sl-text-field>
      <slot @click=${this.#onClick} @slotchange=${this.#onSlotChange}></slot>
    `;
  }

  #onClick(event: Event): void {
    if (event.target instanceof Option) {
      event.target.setAttribute(
        'aria-selected',
        event.target.getAttribute('aria-selected') === 'true' ? 'false' : 'true'
      );

      const value = this.options
        ?.filter(option => option.getAttribute('aria-selected') === 'true')
        .map(option => option.value as unknown as string)
        .join(', ');
      this.input?.setAttribute('placeholder', value ?? '');

      // this.options?.forEach(option => {
      //   option.setAttribute('aria-selected', (event.target === option).toString());
      // });

      this.#updateCurrent(event.target);
    }
  }

  #onFocusout(): void {
    this.input?.removeAttribute('aria-activedescendant');
    this.options?.forEach(option => option.removeAttribute('current'));
  }

  #onInputSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.input = event.target
      .assignedElements({ flatten: true })
      .find((el): el is HTMLInputElement => el instanceof HTMLInputElement);

    this.input?.setAttribute('role', 'combobox');

    if (this.listbox) {
      this.input?.setAttribute('aria-controls', this.listbox.id);
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      let index = this.currentOption ? (this.options?.indexOf(this.currentOption) ?? -1) : -1;
      index += event.key === 'ArrowDown' ? 1 : -1;

      if (index < 0) {
        index = this.options?.length ? this.options.length - 1 : 0;
      }

      if (index >= (this.options?.length ?? 0)) {
        index = 0;
      }

      this.#updateCurrent(this.options?.[index]);
    } else if (event.key === 'Enter' && this.currentOption) {
      this.currentOption.click();
    }
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true });

    this.listbox = elements.find((el): el is Listbox => el instanceof Listbox);
    if (this.listbox) {
      this.listbox.id ||= `sl-listbox-${nextUniqueId++}`;

      if (this.input) {
        this.input.setAttribute('aria-controls', this.listbox.id);
        this.input.setAttribute('aria-owns', this.listbox.id);
      }
    }

    // Set `this.options` to all sl-option elements in the slot, including any nested ones
    this.options = elements.flatMap(element => {
      if (element instanceof Option) {
        return element;
      } else {
        return Array.from(element.querySelectorAll('sl-option'));
      }
    });

    this.options.forEach(option => {
      option.id ||= `sl-option-${nextUniqueId++}`;
      option.setAttribute('aria-selected', 'false');
    });
  }

  #updateCurrent(option?: Option): void {
    if (this.currentOption) {
      this.currentOption.removeAttribute('current');
    }

    this.currentOption = option;

    if (this.currentOption) {
      this.currentOption.setAttribute('current', '');
      this.input?.setAttribute('aria-activedescendant', this.currentOption.id);
    }
  }
}
