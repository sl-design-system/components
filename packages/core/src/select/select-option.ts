import type { CSSResultGroup, TemplateResult } from 'lit';
import type { FormControlValue } from '../utils/mixins/index.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { observe } from '../utils/decorators/observe.js';
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

  @property() size?: number; //{ width: number; height: number };

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
    this.slot ||= 'options';
    this.setAttribute('role', 'option');
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  async #onSlotchange(event: Event & { target: HTMLSlotElement }): Promise<void> {
    this.contentType = event.target.assignedNodes()[0].nodeType === 1 ? 'element' : 'string';
    this.size = (await this.#getElementSize(event.target.assignedElements()[0])).width;
  }

  async #getElementSize(element: Element): Promise<{ width: number; height: number }> {
    const el = document.createElement('div');

    const clonedSlot = element.cloneNode(true) as HTMLElement;
    el.append(clonedSlot);

    el.style.position = 'absolute';
    el.style.top = '0px';
    el.style.visibility = 'hidden';
    el.style.whiteSpace = 'nowrap';

    document.body.appendChild(el);

    const { width, height } = await new Promise<{ width: number; height: number }>(resolve => {
      setTimeout(() => {
        const rect = el.getBoundingClientRect();

        document.body.removeChild(el);

        resolve({ width: rect.width, height: rect.height });
      });
    });

    return { width, height };
  }
}
