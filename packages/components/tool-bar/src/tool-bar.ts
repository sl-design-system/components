import { faEllipsisVertical } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './tool-bar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tool-bar': ToolBar;
  }
}

export interface ToolBarItem {
  icon?: string | null;
  label?: string | null;
  click(): void;
}

Icon.register(faEllipsisVertical);

export class ToolBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-menu-button': MenuButton,
      'sl-menu-item': MenuItem
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // Observer changes to the size of the element.
  #observer = new ResizeObserver(() => this.#onResize());

  /** If true, the tool-bar is disabled and cannot be interacted with. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal The tool bar items. */
  @state() items: ToolBarItem[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'toolbar');

    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotChange}></slot>
      <sl-menu-button>
        <sl-icon name="far-ellipsis-vertical" slot="button"></sl-icon>
        ${this.items.map(
          item => html`
            <sl-menu-item @click=${() => item.click()}>
              ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing} ${item.label}
            </sl-menu-item>
          `
        )}
      </sl-menu-button>
    `;
  }

  #onResize(): void {
    console.log('resize');
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }) {
    const elements = event.target.assignedElements({ flatten: true });

    this.items = elements
      .map(element => {
        if (element instanceof Button) {
          return this.#mapButtonToItem(element);
        } else {
          console.warn(`Unknown element type: ${element.tagName} in sl-tool-bar. Only sl-button elements are allowed.`);

          return undefined;
        }
      })
      .filter(item => item !== undefined) as ToolBarItem[];

    console.log(this.items);
  }

  #mapButtonToItem(button: Button): ToolBarItem {
    return {
      icon: button.querySelector('sl-icon')?.getAttribute('name'),
      label: button.getAttribute('aria-label') || button.textContent?.trim(),
      click: () => button.click()
    };
  }
}
