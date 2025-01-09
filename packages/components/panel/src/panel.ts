import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { ToolBar } from '@sl-design-system/tool-bar';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './panel.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-panel': Panel;
  }
}

export type PanelElevation = 'none' | 'raised' | 'sunken';

export type SubtitlePlacement = 'bottom' | 'top';

export type TogglePlacement = 'start' | 'end';

/**
 * A container that can be collapsed and expanded.
 *
 * @csspart header - The header of the panel.
 * @csspart wrapper - The wrapper around the heading.
 * @csspart body - The body of the panel.
 * @csspart inner - The inner container of the panel.
 * @csspart content - The content container of the panel.
 * @csspart titles - The container for the heading and subtitle.
 *
 * @slot heading - The panel's heading. Use this if the `heading` property does not suffice.
 * @slot aside - Additional content to show in the header; replaces the button bar.
 * @slot actions - The panel's actions; will slot in a button bar by default.
 * @slot default - The panel's content.
 * @slot prefix - Content to show before the heading.
 * @slot subtitle - The panel's subtitle. Use this if the `subtitle` property is not sufficient.
 * @slot suffix - Content to show after the heading.
 */
@localized()
export class Panel extends ScopedElementsMixin(LitElement) {
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

  /** Indicates whether the toggle button has been clicked. */
  #toggleClicked = false;

  /** Indicates whether the panel is collapsed or expanded . */
  @property({ type: Boolean, reflect: true }) collapsed?: boolean;

  /** Indicates whether the panel can be collapsed. */
  @property({ type: Boolean, reflect: true }) collapsible?: boolean;

  /** The elevation style of the panel. */
  @property({ reflect: true }) elevation?: PanelElevation;

  /**
   * The heading shown in the header. Use this property if your heading is a string. If you need
   * more flexibility, such as an icon or other elements, use the `heading` slot.
   */
  @property() heading?: string;

  /** Indicates whether the panel has no padding. */
  @property({ type: Boolean, reflect: true, attribute: 'no-padding' }) noPadding?: boolean;

  /** Indicates whether the panel has a border. */
  @property({ type: Boolean, reflect: true }) outline?: boolean;

  /**
   * The heading shown in the header. Use this property if your subtitle is a string. If you need
   * more flexibility, such as an icon or other elements, use the `subtitle` slot.
   */
  @property() subtitle?: string;

  /** The placement of the subtitle - below or above the heading. */
  @property({ reflect: true, attribute: 'subtitle-placement' }) subtitlePlacement?: SubtitlePlacement;

  /** The placement of the toggle button when it's collapsible.
   * @default `start`
   * */
  @property({ reflect: true, attribute: 'toggle-placement' }) togglePlacement?: TogglePlacement;

  /** @internal Emits when the panel expands/collapses. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('heading') || changes.has('subtitle') || changes.has('collapsible')) {
      this.#handleHeaderSlotChange();
    }
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.#handleHeaderSlotChange();
  }

  override render(): TemplateResult {
    return html`
      <div part="header" @slotchange=${this.#handleHeaderSlotChange}>
        ${this.collapsible && this.togglePlacement !== 'end'
          ? html`
              <sl-button
                @click=${() => this.toggle()}
                fill="ghost"
                aria-controls="body"
                aria-expanded=${this.collapsed ? 'false' : 'true'}
                class=${this.#toggleClicked ? 'clicked' : ''}
              >
                <sl-icon
                  class="icon ${!this.collapsed && !this.#toggleClicked ? 'upside-down' : ''}"
                  name="chevron-down"
                ></sl-icon>
              </sl-button>
              <div part="wrapper">${this.renderHeading()}</div>
            `
          : html`<div part="wrapper">${this.renderHeading()}</div>`}
        <slot name="aside">
          <sl-tool-bar align="end" no-border>
            <slot name="actions"></slot>
          </sl-tool-bar>
        </slot>
        ${this.collapsible && this.togglePlacement === 'end'
          ? html`<sl-button
              @click=${() => this.toggle()}
              fill="ghost"
              aria-controls="body"
              aria-expanded=${this.collapsed ? 'false' : 'true'}
              class=${this.#toggleClicked ? 'clicked' : ''}
            >
              <sl-icon
                class="icon ${!this.collapsed && !this.#toggleClicked ? 'upside-down' : ''}"
                name="chevron-down"
              ></sl-icon>
            </sl-button>`
          : nothing}
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
      <slot name="prefix"></slot>
      <div part="titles">
        <slot name="heading">${this.heading}</slot>
        <slot name="subtitle">${this.subtitle}</slot>
      </div>
      <slot name="suffix"></slot>
    `;
  }

  /**
   * Toggle's the collapsed state of the panel. This only does something if the panel is collapsible.
   * @param force - Whether to force the panel to be collapsed or expanded.
   */
  toggle(force = !this.collapsed): void {
    if (this.#toggleClicked) {
      return;
    }

    this.#toggleClicked = true;

    requestAnimationFrame(() => {
      this.collapsed = force;
      this.#toggleClicked = false;
      this.toggleEvent.emit(this.collapsed);
    });
  }

  #handleHeaderSlotChange(): void {
    const headerSlots = this.renderRoot.querySelectorAll('div[part="header"] slot'),
      hasContent = Array.from(headerSlots).some(slot => (slot as HTMLSlotElement).assignedNodes().length > 0);

    this.toggleAttribute('no-header', !hasContent && !this.heading && !this.subtitle && !this.collapsible);
    this.requestUpdate();
  }
}
