import { css } from 'lit';
export default css`
  :host {
    --_transition-duration: 0.3s;

    display: flex;
    outline: 0;
  }

  :host([disabled]) {
    pointer-events: none;
  }

  :host([disabled]) summary {
    color: var(--sl-color-foreground-disabled);
  }

  :host([icon-type='chevron']) details[open] sl-icon,
  :host([icon-type='chevron']) details.opening sl-icon {
    transform: rotate(-180deg);
  }

  :host([icon-type='chevron']) details[open].closing sl-icon {
    transform: rotate(0deg);
  }

  details {
    border-block-end: var(--sl-size-borderWidth-subtle) solid var(--sl-color-border-plain);
    flex: 1;
  }

  details[open] summary::after {
    background: var(--sl-color-border-plain);
    block-size: var(--sl-size-borderWidth-subtle);
    content: '';
    inline-size: calc(100% - 2 * var(--sl-size-500));
    inset-block-end: 0;
    inset-inline-start: 0;
    margin-inline: var(--sl-size-500);
    position: absolute;
  }

  details[open] .horizontal-line,
  details.opening .horizontal-line {
    transform: rotate(270deg);
  }

  details[open] .vertical-line,
  details.opening .vertical-line {
    transform: rotate(90deg);
  }

  details.opening .wrapper {
    animation-name: content-expand;
  }

  details.closing .horizontal-line {
    transform: rotate(90deg);
  }

  details.closing .vertical-line {
    transform: rotate(0deg);
  }

  details.closing .wrapper {
    animation-direction: reverse;
    animation-name: content-expand;
  }

  summary {
    --_bg-opacity: var(--sl-opacity-interactive-bold-idle);

    background: color-mix(
      in srgb,
      transparent,
      var(--sl-color-background-secondary-interactive-plain) calc(100% * var(--_bg-opacity))
    );
    color: var(--sl-color-foreground-plain);
    cursor: pointer;
    display: flex;
    font-size: 1.1428571429em;
    gap: var(--sl-size-100);
    line-height: 1.5em;
    outline: transparent solid var(--sl-size-borderWidth-focusRing);
    outline-offset: var(--sl-size-outlineOffset-default);
    padding: var(--sl-size-200);
    position: relative;
    z-index: 1; /* To work properly with sticky */
  }

  summary::-webkit-details-marker {
    display: none; /* Hides the default arrow in Safari */
  }

  summary:hover {
    --_bg-opacity: var(--sl-opacity-interactive-bold-hover);
  }

  summary:active {
    --_bg-opacity: var(--sl-opacity-interactive-bold-active);
  }

  summary:focus-visible {
    border-radius: var(--sl-size-borderRadius-default);
    outline-color: var(--sl-color-border-focused);
    position: relative;
    z-index: 2;
  }

  @media (prefers-reduced-motion: no-preference) {
    summary {
      transition-duration: var(--_transition-duration);
      transition-property: background, outline-color;
    }
  }

  slot[name='summary'] {
    display: block;
    inline-size: 100%;
    text-box: trim-both cap alphabetic;
  }

  svg,
  sl-icon {
    align-self: start;
    flex-shrink: 0;
    margin-block-start: calc((1lh - var(--sl-size-200)) / 2);
  }

  @supports (text-box: trim-both) {
    svg,
    sl-icon {
      margin-block-start: round(up, 1ex - 1cap, 1px);
    }
  }

  sl-icon {
    block-size: var(--sl-size-200);
  }

  @media (prefers-reduced-motion: no-preference) {
    sl-icon {
      transition: transform var(--_transition-duration) ease-in-out;
    }
  }

  svg {
    aspect-ratio: 1;
    block-size: var(--sl-size-200);
  }

  g {
    transform-origin: 0 0;
  }

  g.horizontal-line {
    transform: rotate(90deg);
  }

  @media (prefers-reduced-motion: no-preference) {
    g {
      transition: transform var(--_transition-duration) cubic-bezier(0.6, 2, 0.6, 1);
    }
  }

  .wrapper {
    animation-duration: 1ms;
    animation-fill-mode: both;
    animation-iteration-count: 1;
    animation-timing-function: linear;
    display: grid;
    overflow: hidden;
  }

  @media (prefers-reduced-motion: no-preference) {
    .wrapper {
      animation-duration: var(--_transition-duration);
      transition: all var(--_transition-duration) cubic-bezier(0.7, -0.4, 0.4, 1.4);
    }
  }

  .body {
    min-block-size: 0;
  }

  [part='panel'] {
    color: var(--sl-color-foreground-plain);
    padding: var(--sl-size-200) var(--sl-size-500);
    position: relative;
  }

  @keyframes content-expand {
    0% {
      grid-template-rows: 0fr;
    }

    100% {
      grid-template-rows: 1fr;
    }
  }
`;
//# sourceMappingURL=accordion-item.scss.js.map
