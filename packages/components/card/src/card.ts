import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './card.scss.js';

/**
 * Let the user know you are processing their data or that the (part of the) page is loading.
 *
 * ```html
 * <sl-card></sl-card>
 * ```

 */
export class Card extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  @property({ type: Boolean, reflect: true }) padding?: boolean;
  @property({ type: Boolean, reflect: true }) responsive?: boolean;
  @property({ reflect: true }) orientation = 'horizontal';
  @property({ reflect: true }) icon?: string;

  override connectedCallback(): void {
    super.connectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <div class="container">
        <slot name="media"></slot>
        <div class="content">
          ${this.icon ? html`<sl-icon .name=${this.icon}></sl-icon>` : nothing}
          <header>
            <slot class="title"></slot>
            <slot name="header"></slot>
          </header>
          <article><slot name="body"></slot></article>
        </div>
        <slot name="actions"></slot>
      </div>
    `;
  }

  removeStyleProp(elm: HTMLElement, props: string[]): void {
    elm.style.cssText = elm.style.cssText
      .split('; ')
      .filter(sp => props.every(p => !sp.startsWith(p)))
      .join(';');
  }

  // deals with editable content, where user can hit "ENTER" or "SHIFT+ENTER"
  // or complex content with nested block-level elements and <br>s
  addMeasureStyles(): void {
    document.head.insertAdjacentHTML(
      'beforeend',
      `<style id="measureSingleLineHeight">
      .measureSingleLineHeight{ position: absolute !important; }
        .measureSingleLineHeight br{ display: none !important; }
        .measureSingleLineHeight *{ display: inline !important; }
    </style>`
    );
  }

  lineCount(elm: HTMLElement): { lineCount: number; linesFit: number } | undefined {
    const originalStyle = elm.style.cssText;
    const computedStyles = getComputedStyle(elm);
    const isBorderBox = computedStyles.boxSizing == 'border-box';
    const boxVerticalPadding = ['padding-top', 'padding-bottom'].reduce(
      (acc, p) => acc + parseInt(computedStyles.getPropertyValue(p)),
      0
    );
    const minHeight = parseInt(computedStyles.minHeight);

    console.log(elm.clientHeight);
    if (!isNaN(minHeight) && elm.clientHeight <= minHeight) return;

    // normalize (should probably be done to all children also via treeWalker)
    // if "box-sizing: border-box;" skip next steps (but do them later for measuring single-line height)
    if (!isBorderBox) {
      elm.style.padding = '0'; // clear restrains that might harm measuring
      elm.style.border = '0'; // clear restrains that might harm measuring
    }

    // with original line-height & height
    const initialScrollHeight = elm.clientHeight - (isBorderBox ? boxVerticalPadding : 0);

    this.addMeasureStyles();
    elm.classList.add('measureSingleLineHeight');
    elm.style.whiteSpace = 'nowrap'; // make the whole text a single line, to measure line-height
    elm.style.height = 'auto'; // make the height fit exactly to the single-line
    elm.style.minHeight = 'auto';
    elm.style.padding = '0'; // clear restrains that might harm measuring
    elm.style.border = '0'; // clear restrains that might harm measuring

    const initialLineHeight = elm.scrollHeight - 1; // fix inaccurate height

    elm.style.minHeight = '0'; // clear restrains that might harm measuring
    elm.style.lineHeight = '1'; // normalize line-height to fit the font perfectly

    // measure
    const singleLineHeight = elm.scrollHeight; // easy with "white-space:nowrap"

    // cleanup
    document.head.querySelector('#measureSingleLineHeight')?.remove();
    elm.classList.remove('measureSingleLineHeight');
    this.removeStyleProp(elm, ['white-space', 'border', 'padding']); // bring back original border & padding because they affect the number of rendered lines (border-box)

    // with full normalization - "line-height:0 & "height:auto"
    const scrollHeight = elm.scrollHeight - (isBorderBox ? boxVerticalPadding : 0);

    const lineCount = Math.round(scrollHeight / singleLineHeight);
    const linesFit = Math.floor(initialScrollHeight / initialLineHeight);

    // undo above style changes
    elm.style.cssText = originalStyle;

    return {
      lineCount: isNaN(lineCount) || singleLineHeight == 0 ? 0 : lineCount,
      linesFit
    };
  }
}
