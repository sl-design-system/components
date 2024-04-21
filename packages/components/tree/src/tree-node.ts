import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Checkbox } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tree-node.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-expand': SlExpandEvent;
  }

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
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-icon': Icon
    };
  }

  /** Indicates whether the node is expanded or collapsed. */
  @property({ type: Boolean, reflect: true }) expanded?: boolean;

  /** @internal Emits when the expanded state changes. */
  @event({ name: 'sl-expand' }) expandEvent!: EventEmitter<SlExpandEvent>;

  /** If true, will render an indicator whether the node is expanded or collapsed. */
  @property({ type: Boolean }) expandable?: boolean;

  /** The depth level of this node, 0 being the root of the tree. */
  @property({ type: Number }) level = 0;

  /** Will render a checkbox if true. */
  @property({ type: Boolean }) selectable?: boolean;

  /** Determines whether the checkbox is checked or not. */
  @property({ type: Boolean }) checked?: boolean;

  /** Indeterminate state of the checkbox. Used when not all children are checked. */
  @property({ type: Boolean }) indeterminate?: boolean;

  override render(): TemplateResult {
    return html`
      ${this.expandable
        ? html`
            <sl-button @click=${this.#onToggle} fill="ghost" size="sm">
              <sl-icon name="chevron-right"></sl-icon>
            </sl-button>
          `
        : nothing}
      <div part="wrapper">
        ${this.selectable
          ? html`
              <sl-checkbox ?checked=${this.checked} ?indeterminate=${this.indeterminate} size="sm">
                <slot></slot>
              </sl-checkbox>
            `
          : html`<slot></slot>`}
      </div>
    `;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('level')) {
      this.style.setProperty('--_level', this.level?.toString());
    }
  }

  #onToggle(): void {
    this.expanded = !this.expanded;
    this.expandEvent.emit(this.expanded);
  }
}
