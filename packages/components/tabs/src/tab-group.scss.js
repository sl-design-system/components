import { css } from 'lit';
export default css`
  :host {
    /* Has to be set to #000 because it's used in the mask-image, so when it's something else than black the mask doesn't work properly */
    /* stylelint-disable-next-line color-no-hex */
    --_mask-color: #000;

    display: flex;
    flex-direction: column;
    isolation: isolate;
  }

  :host([align-tabs='center']) .fade-container {
    justify-content: center;
  }

  :host([align-tabs='end']) .fade-container {
    justify-content: end;
  }

  :host([align-tabs='stretch']) .fade-container {
    justify-content: stretch;
  }

  :host([align-tabs='stretch']) [part='scroller'],
  :host([align-tabs='stretch']) ::slotted(sl-tab) {
    flex-grow: 1;
  }

  :host([align-tabs='stretch']) [part='tablist'] {
    inline-size: 100%;
  }

  :host(:not([no-panels])) [part='panels'] {
    padding: var(--sl-size-300);
  }

  :host([scroll-start]) .fade-start,
  :host([scroll-end]) .fade-end {
    visibility: visible;
  }

  :host([vertical]) {
    flex-direction: row;
  }

  :host([vertical]) [part='container'] {
    border-block-end: 0;
    border-inline-end: var(--sl-size-borderWidth-bold) solid var(--sl-color-border-plain);
    display: inline-flex;
    flex: 0 0 auto;
    flex-direction: column;
    max-inline-size: min(50vw, 200px);
  }

  :host([vertical]) [part='wrapper'] {
    block-size: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) auto;
  }

  :host([vertical]) .fade {
    block-size: 6rem;
    inline-size: 100%;
    inset: auto 0;
  }

  :host([vertical]) .fade-start {
    background: inherit;
    inset-block-start: 0;
    mask-image: linear-gradient(0deg, transparent, var(--_mask-color));
  }

  :host([vertical]) .fade-end {
    background: inherit;
    inset-block-end: 0;
    mask-image: linear-gradient(180deg, transparent, var(--_mask-color));
  }

  :host([vertical]) sl-menu-button {
    padding-block-start: var(--sl-size-050);
    padding-inline-start: 0;
  }

  :host([vertical]) sl-menu-button::part(button) {
    flex: 1;
  }

  :host([vertical]) [part='scroller'] {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    margin-inline-end: calc(var(--sl-size-borderWidth-bold) * -1);
    overflow: clip scroll;
    overscroll-behavior-y: contain;
    scroll-snap-points-y: repeat(100%);
    scroll-snap-type: block;
  }

  :host([vertical]) [part='tablist'] {
    flex-direction: column;
    inline-size: 100%;
  }

  :host([vertical]) .indicator {
    block-size: 100px;
    border-radius: var(--sl-size-050) 0 0 var(--sl-size-050);
    inline-size: var(--sl-size-050);
    inset: 0 0 auto auto;
    transform-origin: center top;
  }

  :host([vertical]) ::slotted(sl-tab) {
    flex-shrink: 1;
    justify-content: start;
  }

  [part='container'] {
    background: var(--sl-elevation-surface-raised-default);
    border-block-end: var(--sl-size-borderWidth-bold) solid var(--sl-color-border-plain);
    display: flex;
    inline-size: 100%;
  }

  [part='wrapper'] {
    background: inherit;
    display: grid;
    grid-template-columns: 1fr auto;
    inline-size: 100%;
  }

  .fade-container {
    background: inherit;
    display: flex;
    min-inline-size: 0;
    position: relative;
  }

  .fade {
    block-size: 100%;
    inline-size: 6rem;
    inset-block: 0;
    pointer-events: none;
    position: absolute;
    visibility: hidden;
    z-index: 1;
  }

  .fade-start {
    background: inherit;
    inset-inline-start: 0;
    mask-image: linear-gradient(-90deg, transparent, var(--_mask-color));
  }

  .fade-end {
    background: inherit;
    inset-inline-end: 0;
    mask-image: linear-gradient(90deg, transparent, var(--_mask-color));
  }

  [part='scroller'] {
    display: flex;
    justify-content: inherit;
    margin-block-end: calc(var(--sl-size-borderWidth-bold) * -1);
    overflow: scroll clip;
    overscroll-behavior-x: contain;
    scroll-behavior: auto;
    scroll-snap-points-x: repeat(100%);
    scroll-snap-type: inline;
    scrollbar-width: none;
  }

  [part='scroller']::-webkit-scrollbar {
    display: none;
  }

  @media (prefers-reduced-motion: no-preference) {
    [part='scroller'] {
      scroll-behavior: smooth;
    }
  }

  [part='tablist'] {
    display: flex;
    inline-size: fit-content;
    justify-content: inherit;
    position: relative;
  }

  .indicator {
    background: var(--sl-color-border-selected);
    block-size: var(--sl-size-050);
    border-radius: var(--sl-size-050) var(--sl-size-050) 0 0;
    inline-size: 100px;
    inset: auto auto 0 0;
    opacity: 0;
    position: absolute;
    transform-origin: center left;
    transition-property: width, height, translate;
    transition-timing-function: ease-in-out;
    translate: 0;

    /** z-index is set to 2 to make sure the indicator is above the tab, when that is selected, focused or hovered */
    z-index: 2;
  }

  @media (prefers-reduced-motion: no-preference) {
    .indicator {
      transition-duration: 0.5s;
    }
  }

  ::slotted(sl-tab:last-of-type):hover {
    position: relative;
    z-index: 2;
  }

  sl-menu-button {
    align-self: center;
    padding-inline-start: var(--sl-size-050);
    position: relative;
    z-index: 1;
  }

  sl-menu-button::part(menu) {
    max-inline-size: min(80vw, 50%);
  }
`;
//# sourceMappingURL=tab-group.scss.js.map
