import { css } from 'lit';
export default css`
  :host {
    --_transition-duration: var(--sl-animation-button-duration);
    --_transition-easing: var(--sl-animation-button-easing);
    --_border-compensation: var(--_toggle-group-border, var(--_border-width));
    --_border-width: var(--sl-size-borderWidth-none);
    --_button-border-radius: var(--sl-size-borderRadius-default);
    --_group-compensation-start: 0px;
    --_group-compensation-end: 0px;

    display: inline-flex;
    flex-shrink: 0;
    vertical-align: middle;
  }

  :host([fill='outline']) {
    --_border-width: var(--sl-size-borderWidth-action);
  }

  :host([fill='outline']) button {
    --_bg-color: transparent;
    --_bg-mix-color: var(--sl-color-background-neutral-interactive-plain);
  }

  :host([shape='pill']) {
    --_button-border-radius: var(--sl-size-borderRadius-full);
  }

  :host(:state(error)) button {
    --_bg-color: var(--sl-color-background-accent-red-bold);
    --_bg-mix-color: var(--sl-color-background-accent-red-interactive-bold);

    color: var(--sl-color-foreground-selected-onBold);
  }

  :host(:state(text-only)) button {
    --_check-compensation: calc((var(--sl-size-075) + var(--sl-size-new-icon-md)) / 2);
  }

  :host(:where([size='sm'])) button {
    --_check-compensation: calc((var(--sl-size-075) + var(--sl-size-new-icon-xs)) / 2);

    padding: calc(var(--sl-size-025) - var(--_border-compensation))
      calc(
        var(--sl-size-175) + var(--_check-compensation) - var(--_border-compensation) +
          var(--_group-compensation-end)
      )
      calc(var(--sl-size-025) - var(--_border-compensation))
      calc(
        var(--sl-size-175) + var(--_check-compensation) - var(--_border-compensation) +
          var(--_group-compensation-start)
      );
  }

  :host(:state(text-only):where([size='sm'])) button {
    --_check-compensation: calc((var(--sl-size-075) + var(--sl-size-new-icon-xs)) / 2);
  }

  :host(:where([size='lg'])) button {
    padding: calc(var(--sl-size-125) - var(--_border-compensation))
      calc(
        var(--sl-size-300) + var(--_check-compensation) - var(--_border-compensation) +
          var(--_group-compensation-end)
      )
      calc(var(--sl-size-125) - var(--_border-compensation))
      calc(
        var(--sl-size-300) + var(--_check-compensation) - var(--_border-compensation) +
          var(--_group-compensation-start)
      );
  }

  :host(:state(pressed)) button {
    --_bg-color: var(--sl-color-background-selected-bold);
    --_bg-mix-color: var(--sl-color-background-selected-interactive-bold);
    --_check-compensation: 0px;
  }

  :host(:state(icon-only)) button {
    --_check-compensation: 0px;

    aspect-ratio: 1;
    line-height: var(--sl-size-new-icon-md);
    padding: calc(var(--sl-size-125) - var(--_border-compensation))
      calc(var(--sl-size-125) - var(--_border-compensation) + var(--_group-compensation-end))
      calc(var(--sl-size-125) - var(--_border-compensation))
      calc(var(--sl-size-125) - var(--_border-compensation) + var(--_group-compensation-start));
  }

  :host(:state(icon-only)[size='sm']) button {
    line-height: var(--sl-size-new-icon-xs);
    padding: calc(var(--sl-size-075) - var(--_border-compensation))
      calc(var(--sl-size-075) - var(--_border-compensation) + var(--_group-compensation-end))
      calc(var(--sl-size-075) - var(--_border-compensation))
      calc(var(--sl-size-075) - var(--_border-compensation) + var(--_group-compensation-start));
  }

  :host(:state(icon-only)[size='lg']) button {
    padding: calc(var(--sl-size-200) - var(--_border-compensation))
      calc(var(--sl-size-200) - var(--_border-compensation) + var(--_group-compensation-end))
      calc(var(--sl-size-200) - var(--_border-compensation))
      calc(var(--sl-size-200) - var(--_border-compensation) + var(--_group-compensation-start));
  }

  button {
    --_bg-color: var(--sl-color-background-neutral-bold);
    --_bg-mix-color: var(--sl-color-background-neutral-interactive-bold);
    --_bg-opacity: var(--sl-opacity-interactive-plain-idle);
    --_check-compensation: 0px;

    align-items: center;
    appearance: none;
    background: color-mix(
      in srgb,
      var(--_bg-color),
      var(--_bg-mix-color) calc(100% * var(--_bg-opacity))
    );
    border: var(--_border-width) solid var(--sl-color-border-plain);
    border-radius: var(--_button-border-radius);
    box-sizing: content-box;
    color: var(--sl-color-foreground-neutral-onBold);
    cursor: pointer;
    display: inline-flex;
    flex: 1 1 auto;
    font: inherit;
    gap: var(--sl-size-075);
    justify-content: center;
    margin: 0;
    min-block-size: 1lh;
    min-inline-size: 0;
    outline: transparent solid var(--sl-size-borderWidth-focusRing);
    outline-offset: var(--sl-size-outlineOffset-default);
    padding: calc(var(--sl-size-075) - var(--_border-compensation))
      calc(
        var(--sl-size-200) + var(--_check-compensation) - var(--_border-compensation) +
          var(--_group-compensation-end)
      )
      calc(var(--sl-size-075) - var(--_border-compensation))
      calc(
        var(--sl-size-200) + var(--_check-compensation) - var(--_border-compensation) +
          var(--_group-compensation-start)
      );
    user-select: none;
  }

  button:focus-visible {
    outline-color: var(--sl-color-border-focused);
    z-index: 1;
  }

  button:hover {
    --_bg-opacity: var(--sl-opacity-interactive-plain-hover);
  }

  button:active {
    --_bg-opacity: var(--sl-opacity-interactive-plain-active);
  }

  button:disabled {
    pointer-events: none;
  }

  button[aria-pressed='true'] {
    border-color: var(--sl-color-border-selected);
    color: var(--sl-color-foreground-selected-onBold);
  }

  button[aria-pressed='true'] slot[name='default'] {
    display: none;
  }

  button[aria-pressed='true'] slot[name='pressed'] {
    display: contents;
  }

  button:is(:disabled, [aria-disabled]) {
    --_bg-color: transparent;
    --_bg-mix-color: transparent;

    border-color: var(--sl-color-border-disabled);
    color: var(--sl-color-foreground-disabled);
    cursor: default;
  }

  button:is(:disabled, [aria-disabled])[aria-pressed='true'] {
    --_bg-color: var(--sl-color-background-neutral-bold);
  }

  @media (prefers-reduced-motion: no-preference) {
    button:where(:active, :focus-visible, :hover) {
      transition-duration: var(--_transition-duration);
      transition-property: background, border-color, color, outline-color;
      transition-timing-function: var(--_transition-easing);
    }
  }

  slot[name='pressed'] {
    display: none;
  }

  sl-icon,
  ::slotted(sl-icon) {
    fill: currentcolor;
    pointer-events: none;
  }
`;
//# sourceMappingURL=toggle-button.scss.js.map
