import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button, ButtonFill } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { ToolBar } from '@sl-design-system/tool-bar';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './panel.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-panel': Panel;
  }
}

export type PanelDensity = 'plain' | 'comfortable';

export type PanelElevation = 'none' | 'raised' | 'sunken';

export type TogglePlacement = 'start' | 'end';

/**
 * A container that can be collapsed and expanded.
 *
 * @csspart header - The header of the panel.
 * @csspart wrapper - The wrapper around the heading.
 * @csspart body - The body of the panel.
 * @csspart inner - The inner container of the panel.
 * @csspart content - The content container of the panel.
 * @csspart titles - The container for the heading.
 *
 * @cssprop --sl-panel-content-padding - The padding for the panel content, e.g. set to 0 to have content without any padding.
 *
 * @slot heading - The panel's heading. Use this if the `heading` property does not suffice.
 * @slot aside - Additional content to show in the header; replaces the button bar.
 * @slot actions - The panel's actions; will slot in a tool bar by default.
 * @slot default - The panel's content.
 * @slot prefix - Content to show before the heading.
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

  /** Indicates whether the panel is collapsed or expanded . */
  @property({ type: Boolean, reflect: true }) collapsed?: boolean;

  /** Indicates whether the panel can be collapsed. */
  @property({ type: Boolean, reflect: true }) collapsible?: boolean;

  /**
   * The density of the panel.
   * @default plain
   */
  @property({ reflect: true }) density?: PanelDensity;

  /** Will render a horizontal divider when set. */
  @property({ type: Boolean, reflect: true }) divider?: boolean;

  /** The elevation style of the panel. */
  @property({ reflect: true }) elevation?: PanelElevation;

  /**
   * The fill of the button in the tool-bar.
   * @default 'ghost'
   */
  @property() fill: ButtonFill = 'ghost';

  /**
   * The heading shown in the header. Use this property if your heading is a string. If you need
   * more flexibility, such as an icon or other elements, use the `heading` slot.
   */
  @property() heading?: string;

  /** Hide the border around the panel when true. */
  @property({ type: Boolean, reflect: true, attribute: 'no-border' }) noBorder?: boolean;

  /** The placement of the toggle button when it's collapsible.
   * @default `start`
   * */
  @property({ reflect: true, attribute: 'toggle-placement' }) togglePlacement?: TogglePlacement;

  /** @internal Emits when the panel expands/collapses. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('heading') || changes.has('collapsible')) {
      this.#onHeaderSlotChange();
    }
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    requestAnimationFrame(() => {
      this.#onHeaderSlotChange();
    });
  }

  override render(): TemplateResult {
    return html`
      <div part="header" @slotchange=${this.#onHeaderSlotChange}>
        ${this.collapsible
          ? html`
              <sl-button
                @click=${() => this.toggle()}
                aria-label=${this.collapsed
                  ? msg('Expand panel', { id: 'sl.panel.expand' })
                  : msg('Collapse panel', { id: 'sl.panel.collapse' })}
                aria-controls="body"
                aria-expanded=${this.collapsed ? 'false' : 'true'}
                class="toggle"
                fill="ghost"
              >
                <sl-icon class=${!this.collapsed ? 'upside-down' : ''} name="chevron-down"></sl-icon>
              </sl-button>
              <div part="wrapper">${this.renderHeading()}</div>
            `
          : html`<div part="wrapper">${this.renderHeading()}</div>`}
        <slot name="aside">
          <sl-tool-bar align="end" no-border fill=${ifDefined(this.fill)}>
            <slot @slotchange=${this.#onActionsSlotChange} name="actions"></slot>
          </sl-tool-bar>
        </slot>
      </div>
      <div id="body" part="body" aria-labelledby="heading" role=${ifDefined(this.collapsible ? 'region' : undefined)}>
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
        <slot id="heading" name="heading">${this.heading}</slot>
      </div>
      <slot name="suffix"></slot>
    `;
  }

  /**
   * Toggle's the collapsed state of the panel. This only does something if the panel is collapsible.
   * @param force - Whether to force the panel to be collapsed or expanded.
   */
  toggle(force = !this.collapsed): void {
    requestAnimationFrame(() => {
      this.collapsed = force;
      this.toggleEvent.emit(this.collapsed);
    });
  }

  #onHeaderSlotChange(): void {
    const headerSlots = this.renderRoot.querySelectorAll('div[part="header"] slot'),
      hasContent = Array.from(headerSlots).find(slot =>
        (slot as HTMLSlotElement)
          .assignedNodes({ flatten: true })
          .some(
            node =>
              node.textContent?.trim() !== '' ||
              (node.nodeType === Node.ELEMENT_NODE &&
                (node as Element)?.tagName === 'SL-TOOL-BAR' &&
                !(node as Element)?.hasAttribute('empty'))
          )
      );

    this.toggleAttribute('no-header', !hasContent && !this.heading && !this.collapsible);
  }

  #onActionsSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true });

    elements.forEach(el => {
      if (el instanceof Button) {
        el.fill = this.fill;
      }
    });

    this.toggleAttribute('has-actions', elements.length > 0);
  }
}
