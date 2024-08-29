import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { ToolBar } from '@sl-design-system/tool-bar';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './paginator.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-paginator': Paginator;
  }
}

/**
 * A container that can be collapsed and expanded.
 *
 * @csspart header - The header of the panel.
 * @csspart wrapper - The wrapper around the heading.
 * @csspart body - The body of the panel.
 * @csspart inner - The inner container of the panel.
 * @csspart content - The content container of the panel.
 *
 * @slot heading - The panel's heading. Use this is the `heading` property does not suffice.
 * @slot aside - Additional content to show in the header; replaces the button bar.
 * @slot actions - The panel's actions; will slot in a button bar by default.
 * @slot default - The panel's content.
 */
@localized()
export class Paginator extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-tool-bar': ToolBar
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Indicates whether the panel is collapsed or expanded . */
  @property({ type: Boolean, reflect: true }) collapsed?: boolean;

  /** Indicates whether the panel can be collapsed. */
  @property({ type: Boolean, reflect: true }) collapsible?: boolean;

  /**
   * The heading shown in the header. Use this property if your heading is a string. If you need
   * more flexibility, such as an icon or other elements, use the `heading` slot.
   */
  @property() heading?: string;

  /** @internal Emits when the panel expands/collapses. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  // TODO: how many pages? 'pages' prop? or state?
  // TODO: current page (state?)
  // TODO: data?
  // TODO: size md and lg?
  // TODO: elements per page?

  // TODO: total elements?

  // TODO: routing? with url change
  // TODO: emit event on page change

  /** Total items */
  @property() total?: number;

  override render(): TemplateResult {
    return html`
      <div>
        <sl-button fill="ghost" size="sm">&lt; Previous</sl-button>
        <sl-button fill="ghost" size="sm">1</sl-button>
        <sl-button fill="ghost" size="sm">2</sl-button>
        <sl-button fill="ghost" size="sm">2</sl-button>
        <sl-button fill="ghost" size="sm">Next &gt;</sl-button>
        <slot></slot>
        <div>Total elements: 100 ${this.total}</div>
      </div>
    `;
  }

  // renderHeading(): TemplateResult {
  //   return html`
  //     ${this.collapsible ? html`<sl-icon name="chevron-down"></sl-icon>` : nothing}
  //     <slot name="heading">${this.heading}</slot>
  //   `;
  // }

  /**
   * Toggle's the collapsed state of the panel. This only does something if the panel is collapsible.
   * @param force - Whether to force the panel to be collapsed or expanded.
   */
  toggle(force = !this.collapsed): void {
    this.collapsed = force;
    this.toggleEvent.emit(this.collapsed);
  }
}
