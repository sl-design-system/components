import { css } from 'lit';
export default css`
  :host {
    display: contents;
  }

  dialog {
    background: var(--sl-elevation-surface-raised-default);
    border: 0;
    border-radius: var(--sl-size-borderRadius-default);
    box-sizing: border-box;
    color: var(--sl-color-foreground-plain);
    flex-direction: column;
    margin: auto auto 0;
    max-block-size: calc(100dvh - var(--sl-size-400));
    min-inline-size: 100dvw;
    overflow: visible;
    padding: 0;
  }

  dialog[open] {
    display: flex;
  }

  dialog[open]::backdrop {
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

  @media (width <= 600px) {
    dialog {
      border: 0;
      border-radius: var(--sl-size-borderRadius-default) var(--sl-size-borderRadius-default) 0 0;
      max-inline-size: 100dvw;
    }

    dialog:not(:modal),
    dialog.closing {
      translate: 0 100%;
    }

    dialog.closing::backdrop {
      opacity: 0;
    }

    @starting-style {
      dialog.closing::backdrop {
        opacity: 1;
      }
    }

    @starting-style {
      dialog[open] {
        translate: 0 100%;
      }
    }
  }

  @media (width <= 600px) and (prefers-reduced-motion: no-preference) {
    dialog,
    dialog::backdrop {
      transition: 0.2s ease-in-out;
      transition-behavior: allow-discrete;
      transition-property: opacity, overlay, translate;
    }

    @supports (overlay: auto) {
      dialog,
      dialog::backdrop {
        transition-property: display, opacity, overlay, translate;
      }
    }

    dialog[open]:not(.closing)::backdrop {
      transition-duration: 0.5s;
    }
  }

  @media (width > 600px) {
    dialog {
      margin: auto;
      max-inline-size: calc(100dvw - var(--sl-size-600));
      min-inline-size: auto;
    }

    dialog::backdrop {
      background: var(--sl-color-blanket-plain);
    }

    dialog:not(:modal),
    dialog.closing {
      opacity: 0;
      scale: 0.7;
    }

    dialog.closing::backdrop {
      opacity: 0;
    }

    @starting-style {
      dialog.closing::backdrop {
        opacity: 1;
      }
    }

    @starting-style {
      dialog[open] {
        scale: 1.1;
      }
    }
  }

  @media (width > 600px) and (prefers-reduced-motion: no-preference) {
    dialog,
    dialog::backdrop {
      transition: 0.3s ease-in-out;
      transition-behavior: allow-discrete;
      transition-property: display, opacity, overlay, scale;
    }

    dialog[open]:not(.closing)::backdrop {
      transition-duration: 0.5s;
    }
  }

  [part='header'] {
    align-items: start;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding-block: var(--sl-size-300) var(--sl-size-200);
    padding-inline: var(--sl-size-300);
  }

  @media (width <= 600px) {
    [part='header'] {
      padding: var(--sl-size-050) var(--sl-size-200);
    }
  }

  [part='header'][sticky] {
    border-block-end: var(--sl-size-borderWidth-subtle) solid var(--sl-color-border-plain);
    box-shadow: var(--sl-elevation-shadow-overflow);
  }

  [part='titles'] {
    align-items: start;
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  @media (width <= 600px) {
    [part='titles'] {
      align-items: center;
      display: grid;
      gap: var(--sl-size-050);
      grid-template-columns: 1fr 2fr 1fr;
    }
  }

  slot[name='title'] h1,
  slot[name='title']::slotted(*) {
    color: var(--sl-color-foreground-bold);
    font-size: 1.7142857143em;
    font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
    line-height: 1em;
    margin: 0;
    padding-inline-end: calc(var(--sl-size-450) / 2);
    text-box: trim-both cap alphabetic;
    text-wrap: balance;
  }

  @media (width <= 600px) {
    slot[name='title'] h1,
    slot[name='title']::slotted(*) {
      font-size: 1.1428571429em;
      grid-area: 1/2;
      justify-self: center;
      padding-inline-end: 0;
    }
  }

  @media (width <= 600px) {
    slot[name='secondary-actions'] {
      display: flex;
      gap: var(--sl-size-100);
      justify-content: stretch;
      margin-block: var(--sl-size-200) var(--sl-size-100);
    }
  }

  @media (width <= 600px) {
    ::slotted(sl-button:nth-child(1 of [slot='primary-actions'])) {
      grid-area: 1/1;
      inline-size: fit-content;
    }
  }

  @media (width <= 600px) {
    ::slotted(sl-button:nth-child(2 of [slot='primary-actions'])) {
      grid-area: 1/3;
      inline-size: fit-content;
      justify-self: end;
    }
  }

  @media (width <= 600px) {
    ::slotted(:nth-last-child(1 of [slot='secondary-actions'])) {
      flex: 1;
    }
  }

  @media (width > 600px) {
    ::slotted(:nth-last-child(1 of [slot='secondary-actions'])) {
      margin-inline-end: auto;
    }
  }

  sl-button.sl-close {
    inset: var(--sl-size-100) var(--sl-size-100) auto auto;
    position: absolute;
  }

  [part='body'] {
    overflow: auto;
    padding-inline: var(--sl-size-300);
  }

  @media (width <= 600px) {
    [part='body'] {
      padding: var(--sl-size-100) var(--sl-size-200);
      scrollbar-width: thin;
    }
  }

  [part='footer'] {
    box-sizing: border-box;
    padding-block: var(--sl-size-200) var(--sl-size-300);
    padding-inline: var(--sl-size-300);
  }

  [part='footer'][sticky] {
    border-block-start: var(--sl-size-borderWidth-subtle) solid var(--sl-color-border-plain);
    box-shadow: var(--sl-elevation-shadow-overflow);
  }

  [part='footer-bar'] {
    align-items: stretch;
    flex-direction: column;
  }

  @media (width > 600px) {
    [part='footer-bar'] {
      align-items: center;
      flex-direction: row;
    }
  }
`;
//# sourceMappingURL=dialog.scss.js.map
