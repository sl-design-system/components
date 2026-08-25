var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { ListDataSourcePlaceholder } from '@sl-design-system/data-source';
import { dasherize, event, getNameByPath, getValueByPath } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
export class GridColumn extends LitElement {
  constructor() {
    super();
    /** The state changed event callback. */
    this.#onStateChanged = () => this.stateChanged();
    this.grow = 1;
    /** The number of header rows for this column. */
    this.headerRowCount = 1;
    this.#scopedElements = this.baseScopedElements;
  }
  /** The parent grid. */
  #grid;
  #onStateChanged;
  /** The scoped elements set on this column. */
  #scopedElements;
  /** Actual width of the column. */
  #width;
  /**
   * @internal The internal scoped elements for this column. This is defined separately so it doesn't
   * get overridden by the public `scopedElements` property.
   */
  get baseScopedElements() {
    return {};
  }
  set grid(value) {
    this.#grid?.removeEventListener('sl-grid-state-change', this.#onStateChanged);
    this.#grid = value;
    this.#grid?.addEventListener('sl-grid-state-change', this.#onStateChanged);
  }
  get grid() {
    return this.#grid;
  }
  get scopedElements() {
    return this.#scopedElements;
  }
  set scopedElements(value) {
    this.#scopedElements = { ...this.baseScopedElements, ...(value ?? {}) };
  }
  set width(value) {
    this.#width = value;
  }
  get width() {
    return this.#width;
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.width === void 0 && this.autoWidth === void 0) {
      this.autoWidth = true;
    }
  }
  disconnectedCallback() {
    this.#grid?.removeEventListener('sl-grid-state-change', this.#onStateChanged);
    this.#grid = void 0;
    super.disconnectedCallback();
  }
  /**
   * This method is called when the contents of the grid has changed. This happens when the items
   * property is directly set or when the data source has changed.
   */
  itemsChanged() {}
  /**
   * This method is called when the state of the grid has changed. This happens for examples when a
   * filter or sorting changes.
   */
  stateChanged() {}
  /**
   * This method renders the `<th>` element and all the related attributes, classes and content.
   * Override this method if you want to customize how a header is rendered. Do not override this if
   * you only want to change the classes, contents or parts of the header. See this specific methods
   * for that.
   */
  renderHeaderRow(index) {
    if (index >= this.headerRowCount) {
      return nothing;
    }
    const classes = this.getClasses(),
      parts = ['header', ...this.getParts()];
    return html`
      <th
        class=${ifDefined(classes.join(' ') || void 0)}
        part=${parts.join(' ')}
        role="columnheader">
        ${this.renderHeaderLabel()}
      </th>
    `;
  }
  /**
   * This method renders the label for the header. This is used to render the content of the `<th>`
   * element. Override this method if you want to customize how a header label is rendered. Do not
   * override this if you only want to change the classes, contents or parts of the header.
   */
  renderHeaderLabel() {
    const className = this.hideHeaderText ? 'visually-hidden' : void 0;
    if (this.header) {
      return typeof this.header === 'string'
        ? html`<span class=${ifDefined(className)}>${this.header}</span>`
        : this.header(this);
    } else if (this.path) {
      return html`<span class=${ifDefined(className)}>${getNameByPath(this.path)}</span>`;
    }
    return void 0;
  }
  /**
   * This method renders the `<td>` element and all the related attributes, classes and content.
   * Override this method if you want to customize how a cell is rendered. Do not override this if
   * you only want to change the classes, contents or parts of the cell. See this specific methods
   * for that.
   */
  renderData(item) {
    const classes = this.getClasses(item.data),
      data = this.getDisplayValue(item.data),
      parts = ['data', ...this.getParts(item.data)];
    if (this.ellipsizeText && typeof data === 'string') {
      return html`
        <td class=${ifDefined(classes.join(' ') || void 0)} part=${parts.join(' ')} role="cell">
          <sl-ellipsize-text>${data}</sl-ellipsize-text>
        </td>
      `;
    } else {
      return html`
        <td class=${ifDefined(classes.join(' ') || void 0)} part=${parts.join(' ')} role="cell">
          ${data}
        </td>
      `;
    }
  }
  /** Override this method to provide internal styling for a cell. */
  renderStyles() {}
  /**
   * Returns an array of strings that are set as class attribute on the `<td>` element. This is used
   * for styling the cells internally. Override this method if you want to add custom classes to the
   * cells.
   */
  getClasses(_item) {
    const classes = [];
    if (this.sticky && this.stickyOrder && this.stickyPosition) {
      classes.push(`sticky-${this.stickyPosition}-${this.stickyOrder}`);
    } else if (this.sticky && this.stickyPosition) {
      classes.push(`sticky-${this.stickyPosition}`);
    }
    return classes;
  }
  /**
   * Returns the display value for the given item. This is used to render the cell content. The
   * logic here is as follows: 1. If a renderer is set, it will be used to render the cell content.
   * 2. If the item is a placeholder, a skeleton will be returned. 3. If a path is set, the value
   * will be retrieved from the item using the path. 4. If no path is set, the value 'No path set'
   * will be returned.
   *
   * Override this method if you want to change the way the cell content is rendered.
   */
  getDisplayValue(item) {
    if (this.renderer) {
      return this.renderer(item);
    } else if (item === ListDataSourcePlaceholder) {
      return html`
        <sl-skeleton style="inline-size: ${Math.max(Math.random() * 100, 30)}%"></sl-skeleton>
      `;
    } else if (this.path) {
      return getValueByPath(item, this.path);
    } else {
      return 'No path set';
    }
  }
  /** Returns a label for form controls rendered inside this column. */
  getFormControlLabel(item) {
    const columnLabel = this.#getHeaderLabel(),
      rowLabel = this.formControlLabel?.(item)?.trim();
    return [columnLabel, rowLabel].filter(Boolean).join(' ');
  }
  /**
   * Returns an array of strings that are set as part attributes on the `<td>` element. This is used
   * for styling the cells externally. Override this method if you want to add custom parts to the
   * cells.
   */
  getParts(item) {
    let parts = [];
    if (typeof this.parts === 'string') {
      parts = this.parts.split(' ');
    } else if (typeof this.parts === 'function' && item) {
      parts = this.parts(item)?.split(' ') ?? [];
    }
    if (item === ListDataSourcePlaceholder) {
      parts.push('placeholder');
    }
    if (this.path) {
      parts.push(dasherize(this.path.replaceAll('.', '-')));
    }
    return parts;
  }
  #getHeaderLabel() {
    const formControlColumnLabel = this.formControlColumnLabel?.trim(),
      headerLabel = typeof this.header === 'string' ? this.header.trim() : '';
    return formControlColumnLabel || headerLabel || (this.path ? getNameByPath(this.path) : '');
  }
}
__decorateClass([property()], GridColumn.prototype, 'align', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'auto-width' })],
  GridColumn.prototype,
  'autoWidth',
  2
);
__decorateClass(
  [event({ name: 'sl-column-update' })],
  GridColumn.prototype,
  'columnUpdateEvent',
  2
);
__decorateClass(
  [property({ type: Boolean, attribute: 'ellipsize-text' })],
  GridColumn.prototype,
  'ellipsizeText',
  2
);
__decorateClass(
  [property({ attribute: 'form-control-column-label' })],
  GridColumn.prototype,
  'formControlColumnLabel',
  2
);
__decorateClass([property({ attribute: false })], GridColumn.prototype, 'formControlLabel', 2);
__decorateClass([property({ attribute: false })], GridColumn.prototype, 'grid', 1);
__decorateClass([property({ type: Number })], GridColumn.prototype, 'grow', 2);
__decorateClass([property()], GridColumn.prototype, 'header', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'hide-header-text' })],
  GridColumn.prototype,
  'hideHeaderText',
  2
);
__decorateClass([property()], GridColumn.prototype, 'path', 2);
__decorateClass([property()], GridColumn.prototype, 'parts', 2);
__decorateClass([property({ attribute: false })], GridColumn.prototype, 'renderer', 2);
__decorateClass([property({ attribute: false })], GridColumn.prototype, 'scopedElements', 1);
__decorateClass([property({ type: Boolean })], GridColumn.prototype, 'sticky', 2);
__decorateClass([state()], GridColumn.prototype, 'stickyOrder', 2);
__decorateClass([state()], GridColumn.prototype, 'stickyPosition', 2);
__decorateClass([property({ type: Number })], GridColumn.prototype, 'width', 1);
//# sourceMappingURL=column.js.map
