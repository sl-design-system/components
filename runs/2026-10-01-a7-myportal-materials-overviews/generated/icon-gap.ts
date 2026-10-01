import { type TemplateResult, html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * A reserved, empty footprint standing in for an icon the active theme does not register.
 *
 * The `bingel-dc` theme registers exactly 34 icons. This design draws 18 distinct glyphs, of which
 * only `home-blank`, `chevron-down` and (inside `sl-breadcrumbs`) `breadcrumb-separator` exist.
 * The other 15 have no registry entry and cannot be obtained here: `@fortawesome/*` is not
 * installed, so importing it is a **render** blocker rather than a type error, and drawing a
 * replacement SVG by hand would put invented artwork into a pixel comparison.
 *
 * So a missing glyph is **omitted with its footprint preserved**: this renders one empty inline
 * element of the glyph's exact drawn box and nothing else — no background, no border, no outline,
 * no placeholder mark — so surrounding geometry is unaffected and the omission is visible as
 * absence rather than as a shifted layout.
 *
 * The inline pixel sizes are deliberate and are the one sanctioned exception to "every visual
 * value comes from a token": the value's entire purpose is to equal the Figma box exactly, so
 * substituting the nearest token would defeat it. Every call site carries a comment naming the
 * glyph it stands in for.
 *
 * @param inlineSize The glyph's drawn width in px.
 * @param blockSize The glyph's drawn height in px. Defaults to `inlineSize` (a square box).
 */
export function iconGap(inlineSize: number, blockSize: number = inlineSize): TemplateResult {
  return html`<span
    aria-hidden="true"
    class="icon-gap"
    style=${styleMap({
      blockSize: `${blockSize}px`,
      display: 'inline-block',
      flex: '0 0 auto',
      inlineSize: `${inlineSize}px`
    })}
  ></span>`;
}
