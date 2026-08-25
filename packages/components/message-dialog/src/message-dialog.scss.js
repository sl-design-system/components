import { css } from 'lit';
export default css`
  :host {
    --sl-message-dialog-inline-size: 30rem;

    display: contents;
  }

  dialog {
    background: var(--sl-elevation-surface-raised-default);
    border: 0;
    border-radius: var(--sl-size-borderRadius-default);
    box-sizing: border-box;
    color: var(--sl-color-foreground-plain);
    flex-direction: column;
    gap: var(--sl-size-200);
    inline-size: var(--sl-message-dialog-inline-size);
    margin: auto;
    max-block-size: calc(100dvh - var(--sl-size-400));
    max-inline-size: calc(100dvw - var(--sl-size-600));
    overflow: visible;
    padding: var(--sl-size-300) var(--sl-size-300);
  }

  dialog[open] {
    display: flex;
  }

  dialog[open]::backdrop {
    background: var(--sl-color-blanket-plain);
    opacity: 1;
  }

  @starting-style {
    dialog[open]::backdrop {
      opacity: 0;
    }
  }

  dialog:focus-visible {
    outline: var(--sl-color-border-focused) solid var(--sl-size-borderWidth-focusRing);
    outline-offset: var(--sl-size-outlineOffset-default);
  }

  dialog::backdrop {
    opacity: 0;
  }

  dialog:not(:modal) {
    opacity: 0;
    scale: 0.7;
  }

  @supports not (overlay: auto) {
    dialog:not(:modal) {
      transition-duration: 0s;
    }
  }

  @starting-style {
    dialog {
      display: flex;
      scale: 1.1;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    dialog,
    dialog::backdrop {
      transition: 0.4s ease-in-out;
      transition-behavior: allow-discrete;
      transition-property: display, opacity, overlay, scale;
    }

    dialog[open]::backdrop {
      transition-duration: 0.5s;
    }
  }

  h1 {
    color: var(--sl-color-foreground-bold);
    font-size: 1.7142857143em;
    font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
    line-height: 1em;
    margin: 0;
    text-box: trim-both cap alphabetic;
  }

  p {
    margin-block: 0;
  }

  @media (width <= 600px) {
    sl-button {
      align-self: stretch;
      flex: 1;
      text-align: center;
    }
  }
`;
//# sourceMappingURL=message-dialog.scss.js.map
