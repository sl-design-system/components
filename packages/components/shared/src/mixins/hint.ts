import type { CSSResultGroup, PropertyValues, ReactiveElement, TemplateResult } from 'lit';
import type { Constructor } from '../types.js';
import { css, html } from 'lit';
import { property } from 'lit/decorators.js';

export interface HintInterface {
  hint?: string;
  hintSize?: HintSize;
  renderHint(): TemplateResult;
}

export type HintSize = 'sm' | 'md' | 'lg';

let nextUniqueId = 0;

export const hintStyles: CSSResultGroup = css`
  slot[name='hint']::slotted(*) {
    color: var(--sl-color-input-helper-text-default);
    display: inline-flex;
  }

  slot[name='hint'][disabled]::slotted(*) {
    color: var(--sl-color-input-helper-text-disabled);
  }

  slot[hintsize='sm']::slotted(*) {
    font: var(--sl-text-input-helper-text-sm);
    padding-top: var(--sl-space-input-helper-padding-top-sm);
  }
  slot[hintsize='md']::slotted(*) {
    font: var(--sl-text-input-helper-text-md);
    padding-top: var(--sl-space-input-helper-padding-top-md);
  }

  slot[hintsize='lg']::slotted(*) {
    font: var(--sl-text-input-helper-text-lg);
    padding-top: var(--sl-space-input-helper-padding-top-lg);
  }
`;

export function HintMixin<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<HintInterface> {
  class Hint extends constructor {
    /** The hint. If you need to display HTML, use the `hint` slot instead. */
    @property() hint?: string;

    /** The hint size. */
    @property() hintSize: HintSize = 'md';

    /** The hint disabled state. */
    @property() disabled?: boolean;

    /** @ignore */
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

    /** @private */
    renderHint(): TemplateResult {
      const input = this.querySelector('input, textarea');
      if (input?.hasAttribute('disabled')) {
        this.disabled = true;
      }

      return html`<slot
        @slotchange=${() => this.#updateHint()}
        name="hint"
        hintSize="${this.hintSize}"
        ?disabled=${this.disabled}
      ></slot>`;
    }

    #updateHint(): void {
      const hint = this.querySelector('[slot="hint"]'),
        target = this.querySelector('input, textarea') ? this.querySelector('input, textarea') : this;

      if (hint) {
        hint.id ||= `sl-hint-${nextUniqueId++}`;

        if (this.hint) {
          hint.innerHTML = this.hint;
        }

        if (hint.hasAttribute('hintsize')) {
          this.hintSize = hint.getAttribute('hintsize') as HintSize;
        }

        if (target?.hasAttribute('aria-describedby')) {
          const currentId = target.getAttribute('aria-describedby') as string;
          if (currentId.includes('hint')) {
            target?.setAttribute('aria-describedby', `${hint.id}`);
          } else {
            target?.setAttribute('aria-describedby', `${currentId} ${hint.id}`);
          }
        } else {
          target?.setAttribute('aria-describedby', hint.id);
        }

        if (target?.hasAttribute('disabled')) {
          hint.setAttribute('disabled', '');
          this.disabled = true;
        }
      } else if (this.hint) {
        const div = document.createElement('div');
        div.innerText = this.hint;
        div.setAttribute('hintSize', this.hintSize);
        div.slot = 'hint';
        const id = `sl-hint-${nextUniqueId++}`;
        if (target?.hasAttribute('aria-describedby')) {
          const currentId = target.getAttribute('aria-describedby') as string;
          if (currentId.includes('hint')) {
            target?.setAttribute('aria-describedby', `${id}`);
          } else {
            target?.setAttribute('aria-describedby', `${currentId} ${id}`);
          }
        } else {
          target?.setAttribute('aria-describedby', id);
        }

        if (this.hasAttribute('disabled')) {
          div.setAttribute('disabled', '');
          this.disabled = true;
        }
        this.append(div);
      }
    }

    #removeHint(): void {
      this.querySelector('[slot="hint"]')?.remove();
      this.querySelector('input')?.removeAttribute('aria-describedby');
    }
  }

  return Hint;
}
