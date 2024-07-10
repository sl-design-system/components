import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './panel.scss.js';

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

  /** Whether the panel is collapsed. */
  @property({ type: Boolean, reflect: true }) collapsed?: boolean;

  /** Indicates whether the panel can be collapsed. */
  @property({ type: Boolean, reflect: true }) collapsible?: boolean;

  /** The heading shown in the header. */
  @property() heading?: string;

  /** @internal Emits when the panel expands/collapses. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  override render(): TemplateResult {
    return html`
      <div part="header">
        ${this.collapsible
          ? html`<button
              @click=${() => this.toggle()}
              aria-controls="body"
              aria-expanded=${this.collapsed ? 'false' : 'true'}
              part="wrapper"
            >
              ${this.renderHeading()}
            </button>`
          : html`<div part="wrapper">${this.renderHeading()}</div>`}
        <slot name="aside">
          <sl-button-bar>
            <slot name="actions"></slot>
          </sl-button-bar>
        </slot>
      </div>
      <div id="body" part="body" role="region">
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

  /** Toggle's the collapsed state of the panel. */
  toggle(): void {
    this.collapsed = !this.collapsed;
    this.toggleEvent.emit(this.collapsed);
  }
}
