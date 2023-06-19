import type { CSSResultGroup, TemplateResult } from 'lit';
import type { FormControlValue } from '@sl-design-system/shared';
import { observe } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-option.scss.js';

export class SelectOption extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether the option item is selected*/
  @property() value?: FormControlValue;

  /** Whether the option item is selected*/
  @property({ reflect: true, type: Boolean }) selected = false;

  /** Whether the option item is disabled*/
  @property({ reflect: true, type: Boolean }) disabled = false;

  /** Whether the content of the option item is a node*/
  @property({ reflect: true }) contentType?: 'string' | 'element';

  @property({ reflect: true }) size: { width: number; height: number } = { width: 200, height: 32 };

  #observer?: ResizeObserver;

  /** Get the selected tab button, or the first tab button. */
  get #tabIndex(): string | null {
    return this.getAttribute('tabIndex');
  }

  /**
   * Apply accessible attributes and values to the tab button.
   * Observe the selected property if it changes
   */
  @observe('selected')
  protected handleSelectionChange(): void {
    this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'option');
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#observer?.disconnect();
  }

  override firstUpdated(): void {
    this.#observer = new ResizeObserver(m => this.#handleResize(m));
    this.#observer?.observe(this);
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  async #onSlotchange(event: Event & { target: HTMLSlotElement }): Promise<void> {
    this.contentType = event.target.assignedNodes()[0].nodeType === 1 ? 'element' : 'string';
    this.size = { width: this.getBoundingClientRect().width, height: this.getBoundingClientRect().height };
  }

  #handleResize(mutations: ResizeObserverEntry[]): void {
    mutations.forEach(mutation => {
      console.log('handleResize', mutation.borderBoxSize, mutation.contentRect, mutation.contentBoxSize);
      this.size = {
        width: mutation.borderBoxSize[0].inlineSize,
        height: mutation.borderBoxSize[0].blockSize
      };
    });
  }
}
