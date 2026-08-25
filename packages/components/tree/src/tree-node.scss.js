import { css } from 'lit';
export default css`
  :host {
    --_bg-color: transparent;
    --_bg-mix-color: var(--sl-color-background-neutral-interactive-plain);
    --_bg-opacity: var(--sl-opacity-interactive-plain-idle);

    align-items: center;
    color: var(--sl-color-foreground-plain);
    display: flex;
    outline: 0;
    padding-inline-start: var(--sl-size-050);
    scroll-margin-block: var(--sl-size-100);
  }

  :host([aria-expanded='true']) sl-icon {
    rotate: 90deg;
  }

  :host([aria-selected='true']:not([multiple])) [role='gridcell'] {
    --_bg-color: var(--sl-color-background-selected-subtlest);
    --_bg-mix-color: var(--sl-color-background-selected-interactive-plain);
  }

  :host([aria-selected='true']:not([multiple])) [role='gridcell'] .expander {
    --_bg-mix-color: var(--sl-color-background-selected-interactive-plain);
  }

  :host(:focus-visible) [role='gridcell'] {
    outline-color: var(--sl-color-border-focused);
    z-index: 1;
  }

  :host(:where(:focus-visible, :focus-within)) sl-button-bar {
    display: flex;
  }

  :host([disabled]) {
    color: var(--sl-color-foreground-disabled);
    cursor: default;
    pointer-events: none;
  }

  sl-indent-guides {
    align-self: stretch;
    margin-block: calc(var(--sl-size-025) * -1);
  }

  [role='gridcell'] {
    --_bg-color: transparent;
    --_bg-mix-color: var(--sl-color-background-neutral-interactive-plain);
    --_bg-opacity: var(--sl-opacity-interactive-plain-idle);

    align-items: center;
    background: color-mix(
      in srgb,
      var(--_bg-color),
      var(--_bg-mix-color) calc(100% * var(--_bg-opacity))
    );
    border-radius: var(--sl-size-borderRadius-default);
    cursor: pointer;
    display: flex;
    inline-size: 100%;
    outline: transparent solid var(--sl-size-borderWidth-focusRing);
    position: relative;
  }

  @media (prefers-reduced-motion: no-preference) {
    [role='gridcell'] {
      transition: background 200ms ease-in-out;
    }
  }

  @media (hover: hover) {
    [role='gridcell']:hover sl-button-bar {
      display: flex;
    }
  }

  [role='gridcell']:hover:not(:has(.expander:hover, sl-button-bar:hover)) {
    --_bg-opacity: var(--sl-opacity-interactive-plain-hover);
  }

  [role='gridcell']:active:not(:has(.expander:active, sl-button-bar:active)) {
    --_bg-opacity: var(--sl-opacity-interactive-plain-active);
  }

  .expander {
    --_bg-mix-color: var(--sl-color-background-neutral-interactive-plain);
    --_bg-opacity: var(--sl-opacity-interactive-bold-idle);

    border-radius: var(--sl-size-borderRadius-default);
    display: inline-grid;
    padding: var(--sl-size-050);
    place-content: center;
    user-select: none;
  }

  .expander:hover {
    --_bg-opacity: var(--sl-opacity-interactive-bold-hover);
  }

  .expander:active {
    --_bg-opacity: var(--sl-opacity-interactive-bold-active);
  }

  .expander + [part='wrapper'] {
    padding-inline-start: 0;
  }

  .expander-inner {
    background: color-mix(
      in srgb,
      transparent,
      var(--_bg-mix-color) calc(100% * var(--_bg-opacity))
    );
    border-radius: var(--sl-size-borderRadius-default);
    cursor: pointer;
    display: inline-grid;
    padding: var(--sl-size-075);
    place-content: center;
  }

  @media (prefers-reduced-motion: no-preference) {
    .expander-inner {
      transition: background 200ms ease-in-out;
    }
  }

  sl-icon {
    color: var(--sl-color-foreground-bold);
    rotate: 0deg;
  }

  @media (prefers-reduced-motion: no-preference) {
    sl-icon {
      transition: rotate 100ms ease-in-out;
    }
  }

  [part='wrapper'] {
    align-items: center;
    display: flex;
    flex: 1;
    gap: var(--sl-size-075);
    padding-inline: var(--sl-size-400) var(--sl-size-050);
  }

  [part='content'] {
    align-items: center;
    display: flex;
    gap: var(--sl-size-050);
    padding-block: var(--sl-size-075);
  }

  slot[name='aside']::slotted(sl-badge) {
    margin-inline-start: auto;
  }

  ::slotted(sl-icon) {
    vertical-align: bottom;
  }

  sl-checkbox {
    align-items: center;
    gap: var(--sl-size-075);
    padding-block: var(--sl-size-075);
  }

  sl-checkbox::part(label) {
    align-items: center;
    display: inline-flex;
    gap: var(--sl-size-025);
    margin: 0;
  }

  sl-button-bar {
    display: none;
    margin-inline-start: auto;
  }

  sl-skeleton {
    block-size: 1lh;
  }
`;
//# sourceMappingURL=tree-node.scss.js.map
