import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type FormControlShowValidity } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlClearEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-button.scss.js';
import { type SelectSize } from './select.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-button': SelectButton;
  }
}

/**
 * SelectButton is used internally by the Select component to display the selected
 * option and handle user interactions.
 *
 * @csspart placeholder - The placeholder text when no option is selected.
 * @csspart selected-option - The container for the selected option.
 */
@localized()
export class SelectButton extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  // TODO: maybe add description of the listbox as well? Or at least information about parts from the listbox?

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { keydown: this.#onKeydown });

  /** Will display a clear button when an option is selected. */
  @property({ type: Boolean, reflect: true }) clearable?: boolean;

  /** @internal Emits when the user clicks the clear button. */
  @event({ name: 'sl-clear' }) clearEvent!: EventEmitter<SlClearEvent>;

  /** Whether the button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The width of the longest option. */
  @property({ type: Number, attribute: 'option-size' }) optionSize?: number;

  /** The placeholder for when there is no selected option. */
  @property() placeholder?: string;

  /** Mirrors the same property on the sl-select parent. */
  @property({ type: Boolean }) required?: boolean;

  /** The selected option. */
  @property({ attribute: false }) selected?: Option | null;

  /** The size of the parent select. */
  @property({ reflect: true }) size?: SelectSize;

  /** Indicates whether the control should indicate it is valid. */
  @property({ type: Boolean, attribute: 'show-valid', reflect: true }) showValid?: boolean;

  /** Mirrors the same property on the sl-select parent. */
  @property({ reflect: true, attribute: 'show-validity' }) showValidity: FormControlShowValidity;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'combobox');
    this.setAttribute('slot', 'button');
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('required')) {
      if (this.required) {
        this.setAttribute('aria-required', 'true');
      } else {
        this.removeAttribute('aria-required');
      }
    }
  }

  override render(): TemplateResult {
    let selected: string | HTMLElement | undefined = undefined;

    console.log('this.selected?.childElementCount', this.selected?.childElementCount, 'this.selected:', this.selected);

    if (this.selected?.childElementCount === 1) {
      //  selected = this.selected.children[0].cloneNode(true) as HTMLElement;
      // this.selected?.renderRoot.querySelector('slot')?.assignedNodes().cloneNode(true);
      // selected = this.selected?.renderRoot.querySelector('slot')?.assignedNodes()[0]?.cloneNode(true) as HTMLElement;
      // selected.part.add('selected');

      /*      const slotNodes = this.selected?.renderRoot.querySelector('slot')?.assignedNodes();
      if (slotNodes?.length) {
        const container = document.createElement('span');
        slotNodes.forEach(node => {
          container.appendChild(node.cloneNode(true));
        });
        container.part.add('selected');
        selected = container;
      }*/

      /*      const slotNodes = this.selected?.renderRoot.querySelector('slot')?.assignedNodes();
      if (slotNodes?.length) {
        const container = document.createElement('span');
        slotNodes.forEach(node => {
          const clonedNode = node.cloneNode(true);
          // Copy computed styles if it's an element
          if (node instanceof HTMLElement && clonedNode instanceof HTMLElement) {
            const styles = window.getComputedStyle(node);
            clonedNode.style.cssText = styles.cssText;
          }
          container.appendChild(clonedNode);
        });
        container.part.add('selected');
        selected = container;
      }*/

      /*      const slotNodes = this.selected?.renderRoot.querySelector('slot')?.assignedNodes();
      if (slotNodes?.length) {
        // Clone the entire selected option to preserve styling
        selected = this.selected.cloneNode(true) as HTMLElement;
        selected.removeAttribute('aria-selected');
        selected.removeAttribute('selected');
        selected.part.add('selected');
      }*/

      /*      const slotNodes = this.selected?.renderRoot.querySelector('slot')?.assignedNodes();
      if (slotNodes?.length) {
        const container = document.createElement('span');
        slotNodes.forEach(node => {
          const clonedNode = node.cloneNode(true);
          // Copy computed styles if it's an element
          if (node instanceof HTMLElement && clonedNode instanceof HTMLElement) {
            const styles = window.getComputedStyle(node);
            // Copy all relevant style properties
            Array.from(styles).forEach(property => {
              clonedNode.style.setProperty(property, styles.getPropertyValue(property));
            });
          }
          container.appendChild(clonedNode);
        });
        container.part.add('selected');
        selected = container; // TODO: it copies styles from the selected option as well, so e.g. color blue etc.
      }*/

      const slotNodes = this.selected?.renderRoot.querySelector('slot')?.assignedNodes();
      if (slotNodes?.length) {
        const container = document.createElement('span');
        slotNodes.forEach(node => {
          const clonedNode = node.cloneNode(true);
          // Copy computed styles that differ from browser defaults
          if (node instanceof HTMLElement && clonedNode instanceof HTMLElement) {
            const styles = window.getComputedStyle(node);
            // Apply all computed styles as inline styles to preserve them in shadow DOM
            for (let i = 0; i < styles.length; i++) {
              const property = styles[i];
              clonedNode.style.setProperty(
                property,
                styles.getPropertyValue(property),
                styles.getPropertyPriority(property)
              );
            }
          }
          container.appendChild(clonedNode);
        });
        container.part.add('selected');
        selected = container;
      }

      /* // works partially, but without classes
      const slotNodes = this.selected?.renderRoot.querySelector('slot')?.assignedNodes();
      if (slotNodes?.length) {
        const container = document.createElement('span');
        slotNodes.forEach(node => {
          const clonedNode = node.cloneNode(true);
          // Only copy inline styles that were explicitly set
          if (node instanceof HTMLElement && clonedNode instanceof HTMLElement) {
            // Copy only inline styles that were explicitly set on the element
            if (node.hasAttribute('style')) {
              clonedNode.setAttribute('style', node.getAttribute('style') || '');
            }
          }
          container.appendChild(clonedNode);
        });
        container.part.add('selected');
        selected = container;
      }*/

      /*  // partially works, preserves classes and inline styles
      const slotNodes = this.selected?.renderRoot.querySelector('slot')?.assignedNodes();
      if (slotNodes?.length) {
        const container = document.createElement('span');
        slotNodes.forEach(node => {
          const clonedNode = node.cloneNode(true);
          // Only copy inline styles that were explicitly set
          if (node instanceof HTMLElement && clonedNode instanceof HTMLElement) {
            // Copy only inline styles that were explicitly set on the element
            if (node.hasAttribute('style')) {
              clonedNode.setAttribute('style', node.getAttribute('style') || '');
            }
            // Ensure class attribute is preserved (it should be by cloneNode, but let's be explicit)
            if (node.hasAttribute('class')) {
              clonedNode.setAttribute('class', node.getAttribute('class') || '');
            }
          }
          container.appendChild(clonedNode);
        });
        container.part.add('selected');
        selected = container;
      }*/

      /*  // copying too much:
      // Clone slotted content and inject styles to preserve appearance across shadow DOM boundaries
      const slotNodes = this.selected?.renderRoot.querySelector('slot')?.assignedNodes();
      if (slotNodes?.length) {
        const container = document.createElement('span');

        // Collect all stylesheets from the document
        const styles = Array.from(document.styleSheets)
          .map(sheet => {
            try {
              return Array.from(sheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
            } catch {
              return '';
            }
          })
          .join('\n');

        // Create a style element with the collected styles
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        this.renderRoot.appendChild(styleElement);

        slotNodes.forEach(node => {
          container.appendChild(node.cloneNode(true));
        });
        container.part.add('selected');
        selected = container;
      }*/
    } else if (this.selected?.childElementCount) {
      selected = this.selected.cloneNode(true) as HTMLElement;
      selected.removeAttribute('aria-selected');
      selected.removeAttribute('selected');
      selected.part.add('selected');
    } else {
      selected = this.selected?.textContent?.trim();
    }

    console.log(
      'Selected content:',
      selected,
      'this.selected?.childElementCount ',
      this.selected?.childElementCount,
      'this.selected',
      this.selected,
      this.selected?.children.length,
      'wrapper?',
      this.selected?.renderRoot.querySelector('slot')?.assignedNodes()
    );

    let inlineSize = '100%';

    if (this.optionSize) {
      const shouldAccountForClearButton = this.clearable && !this.selected,
        clearButtonTotalWidth =
          4 /* clear button margin: margin-inline-start: var(--sl-size-050) */ +
          34 /* clear button width: block-size: calc(1lh + (var(--sl-size-100) - var(--sl-size-borderWidth-default)) * 2);  */ +
          4; /* status icon padding: difference between the padding-inline-start with and without the clear button */

      inlineSize = `${this.optionSize + (shouldAccountForClearButton ? clearButtonTotalWidth : 0)}px`;
    }

    console.log('selected:', selected);

    return html`
      <div
        class="wrapper"
        part=${this.placeholder && !selected ? 'placeholder' : 'selected-option'}
        style="inline-size: ${inlineSize}"
      >
        ${selected || this.placeholder || '\u00a0'}
      </div>
      ${!this.disabled && this.clearable && this.selected
        ? html`
            <button
              @click=${this.#onClick}
              aria-label=${msg('Clear selection', { id: 'sl.select.clearSelection' })}
              tabindex="-1"
            >
              <sl-icon name="circle-xmark"></sl-icon>
              <sl-icon name="circle-xmark-solid"></sl-icon>
            </button>
          `
        : nothing}
      <span class="status">
        <sl-icon name="chevron-down"></sl-icon>
      </span>
    `;
  }

  #onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.clearEvent.emit();
  }

  #onKeydown(event: KeyboardEvent): void {
    if (!this.disabled && this.clearable && this.selected && ['Backspace', 'Delete'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      this.clearEvent.emit();
    }
  }
}
