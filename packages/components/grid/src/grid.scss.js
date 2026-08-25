import { css } from 'lit';
export default css`
  @property --_body-cell-background-interactive-opacity {
    inherits: true;
    initial-value: 0;
    syntax: '<number>';
  }

  :host {
    --_body-cell-background: var(--sl-elevation-surface-raised-default);
    --_body-cell-background-interactive: linear-gradient(
      var(--_body-cell-background-interactive-mix),
      var(--_body-cell-background-interactive-mix)
    );
    --_body-cell-background-interactive-color: transparent;
    --_body-cell-background-interactive-mix: color-mix(
      in srgb,
      transparent,
      var(--_body-cell-background-interactive-color)
        calc(100% * var(--_body-cell-background-interactive-opacity))
    );
    --_body-cell-background-interactive-opacity: 0;
    --_body-cell-padding-block: var(--sl-size-125);
    --_body-cell-padding-inline: var(--sl-size-150);
    --_head-cell-background: var(--sl-elevation-surface-raised-alternative);
    --_head-cell-padding-block: var(--sl-size-175);
    --_head-cell-padding-inline: var(--sl-size-150);
    --_border: var(--_border-width) solid var(--_border-color);
    --_border-color: var(--sl-color-border-plain);
    --_border-width: var(--sl-size-borderWidth-default);
    --_vertical-border: linear-gradient(var(--_border-color), var(--_border-color)) 0
      calc(100% - var(--_vertical-border-offset)) / var(--_border-width)
      calc(100% - var(--_vertical-border-offset) * 2) no-repeat;
    --_vertical-border-offset: var(--sl-size-100);
    --_drop-target-outline: 2px solid #056dc2;
    --_drop-target-outline-offset: -2px;

    color: var(--sl-color-foreground-plain);
    display: block;
    outline: none;
    position: relative;
  }

  :host([items-group-by]) {
    --_first-cell-padding-inline-start: 28px;
  }

  :host([no-border]) thead {
    border-block-start: none;
    border-inline: none;
  }

  :host([no-border]) tbody,
  :host([no-border]) tfoot {
    border: none;
  }

  :host([no-row-border]) td {
    border: none;
  }

  :host([row-action]) [part~='row'] {
    --_body-cell-background-interactive-color: var(--sl-color-background-input-interactive);
    --_body-cell-background-interactive-opacity: var(--sl-opacity-interactive-plain-idle);

    cursor: pointer;
  }

  :host([row-action]) [part~='row']:hover {
    --_body-cell-background-interactive-opacity: var(--sl-opacity-interactive-plain-hover);
  }

  :host([row-action]) [part~='row']:active {
    --_body-cell-background-interactive-opacity: var(--sl-opacity-interactive-plain-active);
  }

  :host([row-action]) tr[part~='active'] td:first-of-type::before {
    background: var(--sl-color-border-selected);
    content: '';
    inline-size: var(--sl-size-025);
    inset: 0 auto 0 0;
    position: absolute;
  }

  :host([row-action]) tr[part~='active'],
  :host([row-action]) tr[part~='selected'] {
    --_body-cell-background-interactive-color: var(
      --sl-color-background-selected-interactive-plain
    );
  }

  :host([column-divider]) td,
  :host([column-divider]) th {
    --_vertical-border-offset: 0px;
  }

  :host([column-divider]) th {
    background: var(--_vertical-border), var(--_head-cell-background);
  }

  :host([column-divider]) th:first-of-type {
    background: var(--_head-cell-background);
  }

  :host([column-divider]) td {
    background:
      var(--_vertical-border), var(--_body-cell-background-interactive),
      var(--_body-cell-background);
  }

  :host([column-divider]) td:first-of-type {
    background: var(--_body-cell-background-interactive), var(--_body-cell-background);
  }

  :host([scrollable-start]) {
    --_vertical-border-end: linear-gradient(var(--_border-color), var(--_border-color)) 100% 100% /
      var(--_border-width) 100% no-repeat;
  }

  :host([scrollable-start]) table:not(:has(.sticky-start-last))::before {
    background: linear-gradient(to right, rgb(79 79 79 / 10%), transparent);
    content: '';
    inline-size: 1rem;
    inset: 0 auto 0 0;
    position: absolute;
    z-index: 2;
  }

  :host([scrollable-start]) :is(td, th).sticky-start-last {
    overflow: visible clip;
  }

  :host([scrollable-start]) :is(td, th).sticky-start-last::after {
    background: linear-gradient(to right, rgb(79 79 79 / 10%), transparent);
    content: '';
    inline-size: 1rem;
    inset: 0 -1rem 0 auto;
    position: absolute;
    z-index: 1;
  }

  :host([scrollable-start]) td.sticky-start-last {
    background:
      var(--_vertical-border-end), var(--_body-cell-background-interactive),
      var(--_body-cell-background);
  }

  :host([scrollable-start]) th.sticky-start-last {
    background: var(--_vertical-border), var(--_vertical-border-end), var(--_head-cell-background);
  }

  :host([scrollable-start]) th.sticky-start-last + th {
    background: var(--_head-cell-background);
  }

  :host([scrollable-start]) sl-scrollbar::before {
    background: var(--sl-color-border-plain);
    content: '';
    inline-size: var(--sl-size-borderWidth-default);
    inset: 0 auto 0 calc(var(--sl-size-borderWidth-default) * -1);
    position: absolute;
  }

  :host([scrollable-end]) table:not(:has(.sticky-end-first))::after {
    background: linear-gradient(to right, transparent, rgb(79 79 79 / 10%));
    content: '';
    inline-size: 1rem;
    inset: 0 0 0 auto;
    position: absolute;
    z-index: 1;
  }

  :host([scrollable-end]) :is(td, th).sticky-end-first {
    --_vertical-border: linear-gradient(var(--_border-color), var(--_border-color)) 0
      calc(100% - var(--_vertical-border-offset)) / var(--_border-width)
      calc(100% - var(--_vertical-border-offset) * 2) no-repeat;
    --_vertical-border-offset: 0px;

    overflow: visible clip;
  }

  :host([scrollable-end]) :is(td, th).sticky-end-first::after {
    background: linear-gradient(to right, transparent, rgb(79 79 79 / 10%));
    content: '';
    inline-size: 1rem;
    inset: 0 0 0 -1rem;
    position: absolute;
    z-index: 1;
  }

  :host([scrollable-end]) td.sticky-end-first {
    background:
      var(--_vertical-border), var(--_body-cell-background-interactive),
      var(--_body-cell-background);
  }

  :host([scrollable-end]) th.sticky-end-first {
    background: var(--_vertical-border), var(--_head-cell-background);
  }

  :host([scrollable-end]) sl-scrollbar::after {
    background: var(--sl-color-border-plain);
    content: '';
    inline-size: var(--sl-size-borderWidth-default);
    inset: 0 calc(var(--sl-size-borderWidth-default) * -1) 0 auto;
    position: absolute;
  }

  :host(:where([scrollable-start], [scrollable-end])) th[class*='sticky'],
  :host(:where([scrollable-start], [scrollable-end])) td[class*='sticky'] {
    z-index: 1;
  }

  :host([striped]) tr[part~='even'] {
    --_body-cell-background: var(--sl-elevation-surface-raised-alternative);
  }

  table {
    anchor-name: --table;
    border-block-start: 0;
    border-radius: var(--sl-size-borderRadius-default);
    display: flex;
    flex-direction: column;
    inline-size: fit-content;
    min-inline-size: 100%;
    overflow: clip;
    position: relative;
    z-index: 1;
  }

  caption {
    background: var(--sl-elevation-surface-raised-default);
    block-size: 100%;
    inline-size: 100%;
    position: absolute;
    position-anchor: --thead;
    position-area: center;
    z-index: 1;
  }

  @supports not (position-area: center) {
    caption {
      display: none;
    }
  }

  thead,
  tbody {
    box-sizing: border-box;
  }

  thead {
    anchor-name: --thead;
    border: var(--_border);
    border-start-end-radius: var(--sl-size-borderRadius-default);
    border-start-start-radius: var(--sl-size-borderRadius-default);
    inset-block-start: 0;
    max-inline-size: var(--sl-grid-width);
    overflow-x: hidden;
    position: sticky;
    z-index: 1;
  }

  thead tr + tr th {
    border-block-start: var(--_border);
  }

  tbody {
    background-color: var(--sl-elevation-surface-raised-default);
    border-block-end: var(--_border);
    border-end-end-radius: var(--sl-size-borderRadius-default);
    border-end-start-radius: var(--sl-size-borderRadius-default);
    border-inline: var(--_border);
    max-inline-size: calc(var(--sl-grid-width) - var(--sl-size-borderWidth-default) * 2);
    min-block-size: var(--sl-grid-tbody-min-height);
    overflow: auto clip;
    overscroll-behavior: contain auto;
    scrollbar-width: none;
  }

  tbody::-webkit-scrollbar {
    display: none;
  }

  tbody:has(+ tfoot) {
    border-block-end: 0;
    border-end-end-radius: 0;
    border-end-start-radius: 0;
  }

  tbody.drop-target {
    position: relative;
  }

  tbody.drop-target::before {
    border: var(--_drop-target-outline);
    content: '';
    inset: 0;
    pointer-events: none;
    position: absolute;
    z-index: 1;
  }

  tbody tr:last-of-type td {
    border-block-end: none;
  }

  tr {
    display: flex;
    inline-size: max(var(--sl-grid-row-width), 100%);
    margin: 0;
  }

  tr:focus-within {
    z-index: 1;
  }

  tr[draggable] {
    cursor: grabbing;
  }

  tr[part~='group'] {
    z-index: 1;
  }

  tr[part~='dragging'] {
    position: relative;
  }

  tr[part~='dragging']::before {
    background: var(--sl-elevation-surface-raised-sunken);
    border-block-end: var(--sl-size-borderWidth-default) solid var(--sl-color-border-plain);
    content: '';
    inset: 0;
    position: absolute;
    z-index: 1;
  }

  tr[part~='selected'] {
    --_body-cell-background: color-mix(
      in srgb,
      var(--sl-color-background-accent-blue-bold) calc(var(--sl-opacity-subtlest) * 100%),
      var(--sl-elevation-surface-raised-default)
    );
  }

  tr.drop-target {
    outline: var(--_drop-target-outline);
    outline-offset: var(--_drop-target-outline-offset);
  }

  th,
  td {
    align-items: center;
    box-sizing: border-box;
    display: inline-flex;
    flex-shrink: 0;
    overflow: clip;
    overflow-clip-margin: border-box
      calc(var(--sl-size-outlineOffset-default) + var(--sl-size-borderWidth-focusRing));
  }

  th {
    background: var(--_vertical-border), var(--_head-cell-background);
    font-weight: var(--sl-text-typeset-fontWeight-regular);
    padding: 0 var(--_head-cell-padding-inline);
    text-align: start;
  }

  th:first-of-type {
    --_vertical-border: none;
  }

  th > span:not(.visually-hidden) {
    font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
    padding-block: var(--_head-cell-padding-block);
  }

  th .visually-hidden {
    block-size: 1px;
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    inline-size: 1px;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
  }

  th[part~='drag-handle'] {
    inline-size: var(--sl-size-600);
    padding-inline: 0;
  }

  th[part~='filter'],
  th[part~='sort'] {
    padding: 0;
  }

  th[part~='selection'] {
    padding: calc(var(--sl-size-175) / 2) var(--sl-size-175);
  }

  td {
    background: var(--_body-cell-background-interactive), var(--_body-cell-background);
    border-block-end: var(--_border);
    justify-content: start;
    padding: var(--_body-cell-padding-block) var(--_body-cell-padding-inline);
  }

  @media (prefers-reduced-motion: no-preference) {
    td {
      transition:
        background-color 0.2s ease-in-out,
        --_body-cell-background-interactive-opacity 0.2s ease-in-out;
    }
  }

  td:has(> :not(sl-ellipsize-text, sl-tooltip)) {
    padding-block: 0;
  }

  td[part~='drag-handle'] {
    inline-size: var(--sl-size-600);
    justify-content: center;
    padding-inline: 0;
  }

  td[part~='drag-handle']:not([part~='fixed']) {
    cursor: grab;
  }

  td[part~='drag-handle']:hover sl-icon {
    opacity: var(--sl-opacity-interactive-reversed-hover);
  }

  td[part~='drag-handle']:active sl-icon {
    opacity: var(--sl-opacity-interactive-reversed-hover);
  }

  td[part~='drag-handle'] sl-icon {
    color: var(--sl-color-foreground-neutral-bold);
    opacity: var(--sl-opacity-interactive-reversed-idle);
  }

  td[part~='group-header'] {
    --_body-cell-background: var(--sl-elevation-surface-raised-sunken);

    inline-size: 100%;
    padding: 0;
  }

  td[part~='placeholder'] {
    padding-block: var(--_body-cell-padding-block);
  }

  td[part~='placeholder'] sl-skeleton {
    block-size: 1lh;
    inline-size: 100%;
  }

  td[part~='select'],
  td[part~='text-field'] {
    --_body-cell-padding-block: var(--sl-size-025);
  }

  td[part~='select'] sl-select,
  td[part~='select'] sl-text-field,
  td[part~='text-field'] sl-select,
  td[part~='text-field'] sl-text-field {
    flex-grow: 1;
  }

  td[part~='selection'] {
    padding: var(--sl-size-050) var(--sl-size-175);
  }

  .drop-placeholder {
    background: #eee;
    inline-size: 100%;
    inset-block-start: 0;
    position: absolute;
    z-index: 1;
  }

  a[href] {
    color: var(--sl-color-link-idle);
  }

  a[href]:active {
    color: var(--sl-color-link-active);
  }

  a[href]:hover {
    color: var(--sl-color-link-hover);
  }

  /* Set some base styles, so it is easy to see */
  a[class^='skip-link'] {
    background-color: var(--sl-color-background-accent-yellow-bold);
    color: var(--sl-color-foreground-accent-yellow-onBold);
    display: inline-block;
    inset-inline-start: calc(anchor(left) + var(--sl-size-100));
    opacity: 0;
    padding: var(--sl-size-100) var(--sl-size-200);
    pointer-events: none;
    position: fixed;
    position-anchor: --table;
    transition: opacity 0.3s ease-in-out;
  }

  a[class^='skip-link']:focus {
    opacity: 1;
    outline: var(--sl-color-border-focused) solid var(--sl-size-borderWidth-focusRing);
    outline-offset: var(--sl-size-outlineOffset-default);
    pointer-events: auto;
    z-index: 2;
  }

  a[class^='skip-link']:hover {
    color: var(--sl-link-focused-hover);
  }

  .skip-link-start:focus {
    /* stylelint-disable-next-line declaration-property-value-no-unknown */
    inset-block-end: anchor(top);
    position-try: --start-fallback;
  }

  .skip-link-end:focus {
    /* stylelint-disable-next-line declaration-property-value-no-unknown */
    inset-block-start: anchor(bottom);
    position-try: --end-fallback;
  }

  @position-try --start-fallback {
    /* stylelint-disable-next-line at-rule-descriptor-value-no-unknown */
    inset-block: anchor(top) auto;
  }

  @position-try --end-fallback {
    /* stylelint-disable-next-line at-rule-descriptor-value-no-unknown */
    inset-block: auto anchor(bottom);
  }

  tfoot {
    border: var(--_border);
    border-block-start: 0;
    border-end-end-radius: var(--sl-size-borderRadius-default);
    border-end-start-radius: var(--sl-size-borderRadius-default);
    inset-block-end: 0;
    max-inline-size: var(--sl-grid-width);
    overflow: hidden;
    position: sticky;
  }

  tfoot td {
    border: 0;
    display: flex;
    flex: 1;
    max-inline-size: calc(var(--sl-grid-width) - var(--sl-size-borderWidth-default) * 2);
    padding: 0 !important;
  }

  tfoot sl-scrollbar {
    flex: 1;
    inline-size: var(--sl-grid-scrollbar-inline-size);
    margin-inline: var(--sl-grid-scrollbar-margin-inline);
    position: relative;
  }

  [part='bulk-actions'] {
    align-items: center;
    background: var(--sl-color-background-selected-bold);
    border: 0;
    border-radius: var(--sl-size-borderRadius-default);
    box-shadow: var(--sl-elevation-shadow-overlay);
    color: var(--sl-color-foreground-inverted-plain);
    gap: var(--sl-size-100);
    inset-block-start: calc(anchor(bottom) + var(--sl-size-200));
    /* stylelint-disable-next-line declaration-property-value-no-unknown */
    justify-self: anchor-center;
    margin: 0;
    max-inline-size: calc(var(--sl-grid-width) - var(--sl-size-800) * 2);
    overflow: clip;
    padding: 0;
    padding-inline-end: var(--sl-size-100);
    position-anchor: --table;
    position-try: --viewport-block-end;
  }

  [part='bulk-actions']:popover-open {
    display: flex;
  }

  @supports not (position-anchor: --foo) {
    [part='bulk-actions'] {
      margin-block-end: var(--sl-size-200);
      margin-inline: auto;
    }
  }

  [part='bulk-actions'] span {
    display: inline-flex;
    flex-shrink: 0;
    margin-inline: var(--sl-size-200);
    padding-block: var(--sl-size-050);
  }

  [part='bulk-actions'] sl-tool-bar {
    background: inherit;
    flex: 1 1 0;
    min-inline-size: 0;
    padding-block: var(--sl-size-100);
  }

  @position-try --viewport-block-end {
    inset-block: auto var(--sl-size-200);
    /* stylelint-disable-next-line at-rule-descriptor-no-unknown */
    position-anchor: initial;
  }
`;
//# sourceMappingURL=grid.scss.js.map
