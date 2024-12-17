import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { ToolBar } from '@sl-design-system/tool-bar';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './panel.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-panel': Panel;
  }
}

export type TogglePlacement = 'start' | 'end';

export type SubtitlePlacement = 'bottom' | 'top';

export type BadgesPlacement = 'bottom' | 'top';

export type PanelElevation = 'none' | 'raised' | 'sunken';

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
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-tool-bar': ToolBar
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  #hasBadge = false;

  @property({ reflect: true, attribute: 'badges-placement' }) badgesPlacement?: BadgesPlacement;

  /** Indicates whether the panel is collapsed or expanded . */
  @property({ type: Boolean, reflect: true }) collapsed?: boolean;

  /** Indicates whether the panel can be collapsed. */
  @property({ type: Boolean, reflect: true }) collapsible?: boolean;

  /** Indicates whether the panel has a border. */
  @property({ type: Boolean, reflect: true }) outline?: boolean;

  @property({ reflect: true }) elevation?: PanelElevation; // TODO: none by default

  /**
   * The heading shown in the header. Use this property if your heading is a string. If you need
   * more flexibility, such as an icon or other elements, use the `heading` slot.
   */
  @property() heading?: string;

  /**
   * The heading shown in the header. Use this property if your subtitle is a string. If you need
   * more flexibility, such as an icon or other elements, use the `subtitle` slot.
   */
  @property() subtitle?: string;

  @property({ reflect: true, attribute: 'subtitle-placement' }) subtitlePlacement?: SubtitlePlacement;

  /** The placement of the toggle button when it's collapsible. */ // TODO: add @default...
  @property({ reflect: true, attribute: 'toggle-placement' }) togglePlacement?: TogglePlacement; // togglePlacement

  /** @internal Emits when the panel expands/collapses. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  /** TODO: descriptions */
  @property({ type: Boolean, reflect: true, attribute: 'no-padding' }) noPadding?: boolean;

  // TODO: chevron on the left or on the right (toggle start / toggle end / none when not collapsible) toggle placement? (use TogglePlacement)

  override render(): TemplateResult {
    console.log('togglePlacement', this.togglePlacement);
    return html`
      <div part="header">
        ${this.collapsible && this.togglePlacement !== 'end'
          ? html`
              <sl-button
                @click=${() => this.toggle()}
                fill="ghost"
                aria-controls="body"
                aria-expanded=${this.collapsed ? 'false' : 'true'}
              >
                <sl-icon name="chevron-down"></sl-icon>
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
            >
              <sl-icon name="chevron-down"></sl-icon>
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

  // <button
  // @click=${() => this.toggle()}
  // aria-controls="body"
  // aria-expanded=${this.collapsed ? 'false' : 'true'}
  // part="wrapper"
  //   >
  //   ${this.renderHeading()}
  // </button>

  renderHeading(): TemplateResult {
    return html`
      <slot name="prefix" class=${this.#hasBadge ? 'hidden' : ''}></slot>
      <div part="main">
        <div part="titles">
          <slot name="heading">${this.heading}</slot>
          <slot name="subtitle">${this.subtitle}</slot>
        </div>
        <slot name="badge" @slotchange=${this.handleBadgeSlotChange}></slot>
      </div>
      <slot name="suffix" class=${this.#hasBadge ? 'hidden' : ''}></slot>
    `;
  } // <!-- ${this.collapsible ? html`<sl-icon name="chevron-down"></sl-icon>` : nothing} -->

  /**
   * Toggle's the collapsed state of the panel. This only does something if the panel is collapsible.
   * @param force - Whether to force the panel to be collapsed or expanded.
   */
  toggle(force = !this.collapsed): void {
    this.collapsed = force;
    this.toggleEvent.emit(this.collapsed);
  }

  private handleBadgeSlotChange(): void {
    const badgeSlot = this.shadowRoot?.querySelector('slot[name="badge"]') as HTMLSlotElement | null;
    this.#hasBadge = (badgeSlot && badgeSlot.assignedNodes().length > 0) || false;

    console.log('this.#hasBadge', this.#hasBadge);

    // TODO: when prefix there should be no suffix?

    this.requestUpdate();
  }
}
