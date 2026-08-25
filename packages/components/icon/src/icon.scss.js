import { css } from 'lit';
export default css`
  :host {
    --sl-icon-fill-accent: color-mix(in srgb, currentcolor 30%, transparent);
    --sl-icon-fill-default: currentcolor;
    --sl-icon-size: var(--sl-size-200, 1rem);

    aspect-ratio: 1/1;
    display: inline-grid;
    flex-shrink: 0;
    inline-size: max(0.8em, var(--sl-icon-size));
    outline: none;
    place-content: center;
    translate: 0;
  }

  @supports (inline-size: 1cap) {
    :host {
      inline-size: max(1cap, var(--sl-icon-size));
    }
  }

  :host([size='2xs']) {
    --sl-icon-size: var(--sl-size-125, 0.625rem);
  }

  :host([size='xs']) {
    --sl-icon-size: var(--sl-size-150, 0.75rem);
  }

  :host([size='sm']) {
    --sl-icon-size: var(--sl-size-175, 0.875rem);
  }

  :host([size='md']) {
    --sl-icon-size: var(--sl-size-200, 1rem);
  }

  :host([size='lg']) {
    --sl-icon-size: var(--sl-size-250, 1.25rem);
  }

  :host([size='xl']) {
    --sl-icon-size: var(--sl-size-300, 1.5rem);
  }

  :host([size='2xl']) {
    --sl-icon-size: var(--sl-size-400, 2rem);
  }

  :host([size='3xl']) {
    --sl-icon-size: var(--sl-size-600, 3rem);
  }

  :host([size='4xl']) {
    --sl-icon-size: var(--sl-size-800, 4rem);
  }

  svg {
    aspect-ratio: 1/1;
    inline-size: 100%;
    overflow: visible;
  }
`;
//# sourceMappingURL=icon.scss.js.map
