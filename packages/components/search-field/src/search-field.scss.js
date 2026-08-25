import { css } from 'lit';
export default css`
  button {
    align-items: center;
    appearance: none;
    aspect-ratio: 1;
    background: transparent;
    block-size: calc(1lh + (var(--sl-size-100) - var(--sl-size-borderWidth-default)) * 2);
    border: 0;
    cursor: pointer;
    display: inline-grid;
    font: inherit;
    justify-content: center;
    margin-inline-start: var(--sl-size-050);
    outline: 0;
    padding: 0;
  }

  button:hover sl-icon[name='circle-xmark'] {
    opacity: 0;
  }

  button:hover sl-icon[name='circle-xmark-solid'] {
    opacity: var(--sl-opacity-interactive-reversed-hover);
  }

  button:active sl-icon[name='circle-xmark-solid'] {
    opacity: var(--sl-opacity-interactive-reversed-active);
  }

  button sl-icon {
    align-items: center;
    aspect-ratio: 1;
    border-radius: var(--sl-size-borderRadius-default);
    color: var(--sl-color-foreground-plain);
    display: inline-flex;
    grid-area: 1/1;
    inline-size: var(--sl-size-200);
    justify-content: center;
    opacity: var(--sl-opacity-interactive-reversed-idle);
  }

  button sl-icon[name='circle-xmark-solid'] {
    opacity: 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    button sl-icon {
      transition: opacity 0.2s ease-in-out;
    }
  }
`;
//# sourceMappingURL=search-field.scss.js.map
