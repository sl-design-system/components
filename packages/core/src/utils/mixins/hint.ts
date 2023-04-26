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
  slot[name='hint'][disabled],
  slot[name='hint']:disabled {
    color: var(--sl-color-helper-text-disabled);
  }
  slot[hintsize='sm'] {
    font: var(--sl-text-input-helper-sm);
    padding-top: var(--sl-space-helper-padding-top-sm);
  }
  slot[hintsize='md'] {
    font: var(--sl-text-input-helper-md);
    padding-top: var(--sl-space-helper-padding-top-md);
  }
  slot[hintsize='lg'] {
    font: var(--sl-text-input-helper-lg);
    padding-top: var(--sl-space-helper-padding-top-lg);
  }
`;

export function HintMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<HintInterface> {
  class Hint extends constructor {
    /** The hint. If you need to display HTML, use the `hint` slot instead. */
    @property() hint?: string;

    /** The hint size. */
    @property() hintSize: LabelSize = 'md';

    /** The hint disabled state. */
    @property() disabled?: boolean;

    // TODO: disabled attribute or detect host disabled

    // TODO: add sm / md / lg sizes of hint

    override connectedCallback(): void {
      super.connectedCallback();

      console.log('conected callback hint');
    }

    override updated(changes: PropertyValues<this>): void {
      super.updated(changes);

      console.log('render hint in updated', changes, this.hint);

      if (changes.has('hint')) {
        if (this.hint) {
          this.#updateHint();
        } else if (changes.get('hint')) {
          this.#removeHint();
        }
      }
    }

    renderHint(): TemplateResult {
      const input = this.querySelector('input, textarea');
      if (input?.hasAttribute('disabled')) {
        this.disabled = true;
      }

      // console.log('this isNative', isNative(this), this, this.querySelector('input, textarea'));

      console.log('render hint', input, input?.hasAttribute('disabled'), input?.getAttribute('disabled'));
      return html`<slot
          @slotchange=${() => this.#updateHint()}
          name="hint"
          hintSize="${this.hintSize}"
          ?disabled=${this.disabled}
        ></slot
        >${this.disabled}`;
    } // ${this.#disabled}

    #updateHint(): void {
      const input = this.querySelector('input, textarea'),
        hint = this.querySelector('[slot="hint"]');

      console.log('render hint 2', hint, this.hint, input, this);

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

        const target = this.querySelector('input, textarea') ? this.querySelector('input, textarea') : this;
        console.log('target in hint', target);

        // if (input?.hasAttribute('aria-describedby')) {
        //   const currentId = input.getAttribute('aria-describedby') as string;
        //   input?.setAttribute('aria-describedby', currentId + ' ' + hint.id);
        // } else {
        //   input?.setAttribute('aria-describedby', hint.id);
        // }
        //
        // //input?.setAttribute('aria-describedby', hint.id);
        // if (input?.hasAttribute('disabled')) {
        //   hint.setAttribute('disabled', '');
        //   this.disabled = true;
        //   console.log('render hint 2 disabled', hint, input, this.disabled, this.hint, this);
        // }

        if (target?.hasAttribute('aria-describedby')) {
          const currentId = target.getAttribute('aria-describedby') as string;
          target?.setAttribute('aria-describedby', currentId + ' ' + hint.id);
        } else {
          target?.setAttribute('aria-describedby', hint.id);
        }

        //input?.setAttribute('aria-describedby', hint.id);
        if (target?.hasAttribute('disabled')) {
          hint.setAttribute('disabled', '');
          this.disabled = true;
          console.log('render hint 2 disabled', hint, target, this.disabled, this.hint, this);
        }
      } else if (this.hint) {
        console.log('else if hint', this.hint);
        const div = document.createElement('div');
        div.innerText = this.hint;
        div.setAttribute('hintSize', this.hintSize);
        div.slot = 'hint';
        if (this.hasAttribute('disabled')) {
          div.setAttribute('disabled', '');
          this.disabled = true;
        }
        this.append(div);
      } /*else {
        input?.removeAttribute('aria-describedby');
      }*/

      // TODO: aria describedby as well?
    }

    #removeHint(): void {
      this.querySelector('[slot="hint"]')?.remove();
      this.querySelector('input')?.removeAttribute('aria-describedby');
    }
  }

  return Hint;
}
