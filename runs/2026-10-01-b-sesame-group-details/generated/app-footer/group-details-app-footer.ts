import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { type AppFooterModel } from '../types.js';
import styles from './group-details-app-footer.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-b-sesame-group-details-legal-select': SlBSesameGroupDetailsLegalSelectEvent;
  }
}

/** Emitted when one of the legal links is activated. */
export type SlBSesameGroupDetailsLegalSelectEvent = CustomEvent<{ linkId: string }>;

/**
 * Structural, not data: the legal links are the same on every page of the product.
 *
 * Note this footer has **no language selector**, unlike the one on the sibling frame A4
 * (`a4-sesame-my-groups`). Both are built from the same Figma base component `2:69240`; the
 * composition around it differs per frame.
 */
const LEGAL_LINKS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms & conditions' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'support', label: 'Support' },
  { id: 'digital-services', label: 'About our digital services' }
];

/**
 * The application chrome at the bottom of the page: the organisation wordmark and five legal
 * links.
 *
 * The wordmark `2142:48479` is an image asset with no export step, so it renders as text at the
 * asset's measured footprint — a recorded Stage 4 discrepancy, not a substituted graphic.
 *
 * The links are laid out as a normal flex row. Figma fits them by giving their container a
 * `-143px` offset inside a 520px parent (Inconsistency 14); that is a Figma packing artefact, not
 * a layout instruction.
 *
 * @fires sl-b-sesame-group-details-legal-select - Emitted with the id of the activated link.
 */
export class GroupDetailsAppFooter extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The organisation named beside the wordmark. */
  @property({ attribute: false }) model?: AppFooterModel;

  /** @internal Emits when a legal link is activated. */
  @event({ name: 'sl-b-sesame-group-details-legal-select' })
  legalSelectEvent!: EventEmitter<SlBSesameGroupDetailsLegalSelectEvent>;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html`${nothing}`;
    }

    return html`
      <div class="gutter">
        <span class="wordmark">${model.organisationName}</span>

        <nav aria-label="Legal">
          <ul>
            ${LEGAL_LINKS.map(
              link => html`
                <li>
                  <a href="#" @click=${(event: Event) => this.#onLinkClick(event, link.id)}
                    >${link.label}</a
                  >
                </li>
              `
            )}
          </ul>
        </nav>
      </div>
    `;
  }

  #onLinkClick(event: Event, linkId: string): void {
    event.preventDefault();
    this.legalSelectEvent.emit({ linkId });
  }
}
