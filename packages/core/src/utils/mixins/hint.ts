import type { CSSResultGroup, PropertyValues, ReactiveElement, TemplateResult } from 'lit';
import type { Constructor } from './types.js';
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';

export interface HintInterface {
  hint?: string;
  hintSize?: LabelSize;
  renderHint(): TemplateResult;
}

export type LabelSize = 'sm' | 'md' | 'lg';

let nextUniqueId = 0;

export const hintStyles: CSSResultGroup = css`
  slot[name='hint'] {
    color: var(--sl-color-helper-text-default); //blue;
  }
  slot[name='hint'][disabled] {
    color: var(--sl-color-helper-text-disabled);
  }
  slot[hintsize='sm'] {
    font: var(--sl-text-input-helper-sm);
  }
  slot[hintsize='md'] {
    font: var(--sl-text-input-helper-md);
  }
  slot[hintsize='lg'] {
    font: var(--sl-text-input-helper-lg);
  }
`;

export function HintMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<HintInterface> {
  class Hint extends constructor {
    /** The hint. If you need to display HTML, use the `hint` slot instead. */
    @property() hint?: string;

    /** The hint size. */
    @property() hintSize: LabelSize = 'md';

    // TODO: disabled attribute

    // TODO: add sm / md / lg sizes of hint

    override updated(changes: PropertyValues<this>): void {
      super.updated(changes);

      if (changes.has('hint')) {
        if (this.hint) {
          this.#updateHint();
        } else if (changes.get('hint')) {
          this.#removeHint();
        }
      }
    }

    renderHint(): TemplateResult {
      console.log('render hint');
      return html`<slot @slotchange=${() => this.#updateHint()} name="hint" hintSize="${this.hintSize}"></slot>`;
    }

    #updateHint(): void {
      const input = this.querySelector('input, textarea'),
        hint = this.querySelector('[slot="hint"]');

      console.log(
        hint?.hasAttribute('hintsize'),
        hint?.getAttribute('hintsize'),
        'input in hint mixin',
        input,
        input?.hasAttribute('disabled'),
        hint,
        'this hint: ',
        this.hint,
        this,
        input?.hasAttribute('aria-describedby')
      );

      if (hint) {
        hint.id ||= `sl-hint-${nextUniqueId++}`;
        hint.classList.add('test');

        if (this.hint) {
          hint.innerHTML = this.hint;
        }

        if (hint.hasAttribute('hintsize')) {
          this.hintSize = hint.getAttribute('hintsize') as LabelSize;
        }

        //hint.hintSize = this.hintSize;
        //hint.setAttribute('hintSize', this.hintSize);

        if (input?.hasAttribute('aria-describedby')) {
          const currentId = input.getAttribute('aria-describedby') as string;
          input?.setAttribute('aria-describedby', currentId + ' ' + hint.id);
        } else {
          input?.setAttribute('aria-describedby', hint.id);
        }

        //input?.setAttribute('aria-describedby', hint.id);
        if (input?.hasAttribute('disabled')) {
          hint.setAttribute('disabled', '');
        }
      } else if (this.hint) {
        const div = document.createElement('div');
        div.innerText = this.hint;
        div.setAttribute('hintSize', this.hintSize);
        div.slot = 'hint';
        if (this.hasAttribute('disabled')) {
          div.setAttribute('disabled', '');
        }
        this.append(div);
      } /*else {
        input?.removeAttribute('aria-describedby');
      }*/
    }

    #removeHint(): void {
      this.querySelector('[slot="hint"]')?.remove();
      this.querySelector('input')?.removeAttribute('aria-describedby');
    }
  }

  return Hint;
}
