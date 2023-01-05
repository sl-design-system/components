import type { PropertyValues, ReactiveElement, TemplateResult } from 'lit';
import type { Constructor } from '../mixin-types.js';
import { html } from 'lit';
import { property } from 'lit/decorators.js';

export interface HintInterface {
  hint?: string;
  renderHint(): TemplateResult;
}

let nextUniqueId = 0;

export function HintMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<HintInterface> {
  class Hint extends constructor {
    /** The hint. If you need to display HTML, use the `hint` slot instead. */
    @property() hint?: string;

    override updated(changes: PropertyValues<this>): void {
      super.updated(changes);

      if (changes.has('hint')) {
        this.#updateHint();
      }
    }

    renderHint(): TemplateResult {
      return html`<slot @slotchange=${() => this.#updateHint()} name="hint"></slot>`;
    }

    #updateHint(): void {
      const input = this.querySelector('input, textarea'),
        hint = this.querySelector('[slot="hint"]');

      if (hint) {
        hint.id ||= `sl-hint-${nextUniqueId++}`;

        if (this.hint) {
          hint.innerHTML = this.hint;
        }

        input?.setAttribute('aria-describedby', hint.id);
      } else if (this.hint) {
        const div = document.createElement('div');
        div.innerText = this.hint;
        div.slot = 'hint';
        this.append(div);
      } else {
        input?.removeAttribute('aria-describedby');
      }
    }
  }

  return Hint;
}
