import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Checkbox } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { IndentGuides } from './indent-guides.js';
import styles from './tree-node.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree-item': TreeNode;
  }
}

export type SlExpandEvent = CustomEvent<boolean>;

export class TreeNode extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-checkbox': Checkbox,
      'sl-icon': Icon,
      'sl-indent-guides': IndentGuides
    };
  }

  /** Event controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** Whether the node is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Indicates whether the node is expanded or collapsed. */
  @property({ type: Boolean, reflect: true }) expanded?: boolean;

  /** If true, will render an indicator whether the node is expanded or collapsed. */
  @property({ type: Boolean }) expandable?: boolean;

  /** The depth level of this node, 0 being the root of the tree. */
  @property({ type: Number, reflect: true }) level = 0;

  /** Will render a checkbox if true. */
  @property({ type: Boolean }) checkable?: boolean;

  /** Determines whether the checkbox is checked or not. */
  @property({ type: Boolean }) checked?: boolean;

  /** Indeterminate state of the checkbox. Used when not all children are checked. */
  @property({ type: Boolean }) indeterminate?: boolean;

  /** Whether this node is the last one on this level; used for styling. */
  @property({ type: Boolean, attribute: 'last-node-in-level' }) lastNodeInLevel?: boolean;

  /** Whether the node is currently selected. */
  @property({ type: Boolean }) selected?: boolean;

  /** @internal Emits when the expanded state changes. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'treeitem');
    this.tabIndex = 0;
  }

  override render(): TemplateResult {
    return html`
      <sl-indent-guides
        ?expandable=${this.expandable}
        .lastNodeInLevel=${this.lastNodeInLevel}
        .level=${this.level}
      ></sl-indent-guides>
      ${this.expandable
        ? html`
            <div class="expander">
              <sl-icon name="chevron-right" size="xs"></sl-icon>
            </div>
          `
        : nothing}
      <div part="wrapper">
        ${this.checkable
          ? html`
              <sl-checkbox ?checked=${this.checked} ?indeterminate=${this.indeterminate} size="sm">
                <slot></slot>
              </sl-checkbox>
            `
          : html`<slot></slot>`}
      </div>
    `;
  }

  toggle(expanded = !this.expanded): void {
    this.expanded = expanded;
    this.toggleEvent.emit(this.expanded);
  }

  #onClick(): void {
    if (this.expandable) {
      this.toggle();
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (!this.expandable) {
      return;
    } else if ((event.key === 'ArrowRight' && !this.expanded) || (event.key === 'ArrowLeft' && this.expanded)) {
      this.toggle();
    }
  }
}
