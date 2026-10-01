import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './description-card.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-a6-description-card': A6DescriptionCard;
  }
}

/**
 * What a description link points at. The design draws a different parenthetical note per kind;
 * the note itself is presentation and lives in `LINK_KIND_NOTE` below, never in the data.
 */
export type DescriptionLinkKind = 'web-content' | 'resource';

/** One inline link in the description body. */
export interface DescriptionLink {
  /** Stable key for the link. */
  id: string;
  /** The link's own text, as authored — per-record free text, rendered directly. */
  label: string;
  /** Where the link points. */
  href: string;
  /** Which note follows the label; see `LINK_KIND_NOTE`. */
  kind: DescriptionLinkKind;
}

/** The data this component renders; owned/fetched by the page, passed in here. */
export interface DescriptionModel {
  /** The prose paragraph above the link list. */
  body: string;
  /** The bulleted inline links below the paragraph, in display order. */
  links: DescriptionLink[];
}

/**
 * The note drawn after each link label, keyed off the link's stable `kind`. This is structure,
 * not data: the model carries the key and this component owns the sentence.
 */
const LINK_KIND_NOTE: Record<DescriptionLinkKind, string> = {
  'web-content': '(link to web content)',
  resource: '(link to resource)'
};

/**
 * Figma `Card` `4200:13814` — the 728 x 192 white "Description" card above the file table: a
 * bold heading, a prose paragraph and a disc-bulleted list of inline links, each followed by a
 * plain-text note saying what the link points at.
 *
 * Presentational — the page owns the `model`. Emits nothing.
 *
 * Two deliberate non-compositions, both of which the manifest's component table gets wrong:
 *
 * - **Not `<sl-card>`.** That component is a *media* card: a `<figure>`/media slot, a resize
 *   observer, line-clamp math and a click handler that forwards clicks onto a title-slot `<a>`.
 *   This is a plain bordered container, so the container is written here instead.
 * - **The two inline links are plain `<a href>`, not `<sl-link>`.** `<sl-link>` is "a standalone
 *   link visually styled as a button", and Figma's own `Standalone link` annotation
 *   (`5483:11186`) says so explicitly: "There are 2 types of links: inline and standalone. This
 *   component represents only the standalone version. Please use text styles and color variables
 *   to create an inline link."
 *
 * The card's hidden child `4210:18675` (`FileUpload`, 664 x 105) is not rendered.
 *
 * ```html
 * <sl-a6-description-card .model=${model}></sl-a6-description-card>
 * ```
 *
 * @slot default - Rich body content. When filled it replaces the rendered `model.body` and
 *   `model.links` entirely (native slot fallback) — this is where a consumer injects real CMS
 *   content. The "Description" heading is always the component's own.
 */
export class A6DescriptionCard extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The description paragraph and its inline links. */
  @property({ attribute: false }) model?: DescriptionModel;

  override render(): TemplateResult {
    const links = this.model?.links ?? [];

    return html`
      <h2>Description</h2>
      <div class="body">
        <slot>
          ${this.model?.body ? html`<p>${this.model.body}</p>` : nothing}
          ${links.length
            ? html`
                <ul>
                  ${links.map(
                    link => html`
                      <li>
                        <a href=${link.href}>${link.label}</a>
                        ${LINK_KIND_NOTE[link.kind]}
                      </li>
                    `
                  )}
                </ul>
              `
            : nothing}
        </slot>
      </div>
    `;
  }
}
