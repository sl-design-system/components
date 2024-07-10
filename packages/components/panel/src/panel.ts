import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './panel.scss.js';

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
export class Panel extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button-bar': ButtonBar,
      'sl-icon': Icon
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

  override render(): TemplateResult {
    return html`
      <div part="header">
        ${this.collapsible
          ? html`
              <button
                @click=${() => this.toggle()}
                aria-controls="body"
                aria-expanded=${this.collapsed ? 'false' : 'true'}
                part="wrapper"
              >
                ${this.renderHeading()}
              </button>
            `
          : html`<div part="wrapper">${this.renderHeading()}</div>`}
        <slot name="aside">
          <sl-button-bar>
            <slot name="actions"></slot>
          </sl-button-bar>
        </slot>
      </div>
      <div id="body" part="body" role=${ifDefined(this.collapsible ? 'region' : undefined)}>
        <div part="inner">
          <div part="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  renderHeading(): TemplateResult {
    return html`
      ${this.collapsible ? html`<sl-icon name="chevron-down"></sl-icon>` : nothing}
      <slot name="heading">${this.heading}</slot>
    `;
  }

  /**
   * Toggle's the collapsed state of the panel. This only does something if the panel is collapsible.
   * @param force - Whether to force the panel to be collapsed or expanded.
   */
  toggle(force = !this.collapsed): void {
    this.collapsed = force;
    this.toggleEvent.emit(this.collapsed);
  }
}
