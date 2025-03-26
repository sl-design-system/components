import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Checkbox } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { type Menu } from '@sl-design-system/menu';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlChangeEvent, type SlSelectEvent, type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { Skeleton } from '@sl-design-system/skeleton';
import { Spinner } from '@sl-design-system/spinner';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { IndentGuides } from './indent-guides.js';
import { type TreeDataSourceNode } from './tree-data-source.js';
import styles from './tree-node.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-tree-node': TreeNode;
  }
}

export type TreeNodeContextMenu<T> = (node: TreeDataSourceNode<T>) => Menu | undefined;

export type TreeNodeType = 'node' | 'placeholder' | 'skeleton';

/**
 * A tree node component. Used to represent a node in a tree. This component
 * is not public API and is used internally by `<sl-tree>`.
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TreeNode<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button-bar': ButtonBar,
      'sl-checkbox': Checkbox,
      'sl-icon': Icon,
      'sl-indent-guides': IndentGuides,
      'sl-spinner': Spinner,
      'sl-skeleton': Skeleton
    };
  }

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** @internal Emits when the checked state of the checkbox changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<boolean>>;

  /**
   * Determines whether the checkbox is checked or not.
   * @default false
   */
  @property({ type: Boolean }) checked?: boolean;

  /**
   * Whether the node is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * If true, will render an indicator whether the node is expanded or collapsed.
   * @default false
   */
  @property({ type: Boolean }) expandable?: boolean;

  /**
   * Indicates whether the node is expanded or collapsed.
   * @default false
   */
  @property({ type: Boolean }) expanded?: boolean;

  /**
   * Hides the indentation guides when set.
   * @default false
   */
  @property({ type: Boolean, attribute: 'hide-guides', reflect: true }) hideGuides?: boolean;

  /**
   * Indeterminate state of the checkbox. Used when not all children are checked.
   * @default false
   */
  @property({ type: Boolean }) indeterminate?: boolean;

  /**
   * Whether this node is the last one on this level; used for styling.
   * @default false
   */
  @property({ type: Boolean, attribute: 'last-node-in-level' }) lastNodeInLevel?: boolean;

  /**
   * The depth level of this node, 0 being the root of the tree.
   * @default 0
   */
  @property({ type: Number }) level = 0;

  /** The tree model node. */
  @property({ attribute: false }) node?: TreeDataSourceNode<T>;

  /** @internal Emits when the user clicks a the wrapper part of the tree node. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<TreeDataSourceNode<T>>>;

  /**
   * Whether the node is currently selected.
   * @default false
   */
  @property({ type: Boolean }) selected?: boolean;

  /**
   * If you are able to select one or more tree nodes (at the same time).
   * @default undefined
   */
  @property() selects?: 'single' | 'multiple';

  /** @internal Emits when the expanded state changes. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  /**
   * The type of tree node:
   * - 'node': A regular tree node.
   * - 'placeholder': A placeholder node used for loading children.
   * - 'skeleton': A skeleton node used for loading individual nodes.
   *
   * @default 'node'
   */
  @property() type?: TreeNodeType;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'treeitem');
    this.tabIndex = 0;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('checked') || changes.has('indeterminate') || changes.has('selected') || changes.has('selects')) {
      if (this.selects === 'multiple') {
        this.setAttribute('aria-checked', this.checked ? 'true' : this.indeterminate ? 'mixed' : 'false');
      } else {
        this.removeAttribute('aria-checked');
      }

      if (this.selects === 'single') {
        this.setAttribute('aria-selected', Boolean(this.selected).toString());
      } else {
        this.removeAttribute('aria-selected');
      }
    }

    if (changes.has('expandable') || changes.has('expanded')) {
      if (this.expandable) {
        this.setAttribute('aria-expanded', Boolean(this.expanded).toString());
      } else {
        this.removeAttribute('aria-expanded');
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-indent-guides
        ?expandable=${this.expandable}
        ?last-node-in-level=${this.lastNodeInLevel}
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
        ${choose(
          this.type,
          [
            ['placeholder', () => html`<sl-spinner></sl-spinner>${msg('Loading')}`],
            [
              'skeleton',
              () => html`<sl-skeleton style="inline-size: ${Math.max(20, Math.random() * 60)}%"></sl-skeleton>`
            ]
          ],
          () =>
            this.selects === 'multiple'
              ? html`
                  <sl-checkbox
                    @sl-change=${this.#onChange}
                    ?checked=${this.checked}
                    ?indeterminate=${this.indeterminate}
                    exportparts="label"
                    part="checkbox"
                    size="sm"
                  >
                    <input slot="input" tabindex="-1" type="checkbox" />
                    <slot></slot>
                  </sl-checkbox>
                `
              : html`
                  <div part="content">
                    <slot></slot>
                  </div>
                  <slot name="aside">
                    <sl-button-bar part="button-bar">
                      <slot name="actions"></slot>
                    </sl-button-bar>
                  </slot>
                `
        )}
      </div>
    `;
  } // TODO: separate slot for badges or not?

  toggle(expanded = !this.expanded): void {
    this.expanded = expanded;
    this.toggleEvent.emit(this.expanded);
  }

  #onChange(event: SlChangeEvent<boolean>): void {
    console.log('on change event on tree node', event, event.detail);
    event.preventDefault();
    event.stopPropagation();

    this.checked = event.detail;
    this.indeterminate = false;
    this.changeEvent.emit(this.checked);
  }

  /**
   * If the user clicked on the wrapper part of the tree node,
   * emit the select event. Otherwise, if the node is expandable,
   * toggle the expanded state.
   */
  #onClick(event: Event): void {
    console.log('on click event on tree node', event, event.target, this.checked); // TODO: or maybe onchange instead of onclick?
    const wrapper = this.renderRoot.querySelector('[part="wrapper"]');

    const insideWrapper = !!event
      .composedPath()
      .filter((el): el is HTMLElement => el instanceof HTMLElement)
      .find(el => el === wrapper);

    if (insideWrapper) {
      event.preventDefault();

      this.selected = this.selects === 'single' ? true : this.selected;
      this.selectEvent.emit(this.node!);
    } else if (this.expandable) {
      this.toggle();
    }
  }

  /** See https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction */
  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (this.selects === 'multiple') {
        this.checked = !this.checked;
        this.indeterminate = false;
        this.changeEvent.emit(this.checked);
      } else {
        this.selected = this.selects === 'single' ? true : this.selected;
        this.selectEvent.emit(this.node!);
      }
    } else if (event.key === 'ArrowLeft') {
      if (this.expanded) {
        event.preventDefault();
        event.stopPropagation();

        this.toggle();
      } else if (this.level === 0) {
        event.preventDefault();
      }
    } else if (event.key === 'ArrowRight') {
      if (this.expandable && !this.expanded) {
        event.preventDefault();

        this.toggle();
      } else if (!this.expandable) {
        event.preventDefault();
      }
    }
  }
}
