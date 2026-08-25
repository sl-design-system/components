import { css } from 'lit';
export default css`
  :host {
    --_background: var(--sl-color-background-info-subtlest);

    align-items: center;
    background:
      linear-gradient(var(--_background), var(--_background)),
      var(--sl-elevation-surface-raised-default);
    border: var(--sl-size-borderWidth-default) solid var(--sl-color-border-info-bold);
    border-radius: var(--sl-size-borderRadius-default);
    color: var(--sl-color-foreground-info-bold);
    display: flex;
    gap: 0 var(--sl-size-100);
    overflow: clip;
    padding-block: calc(var(--sl-size-150) - var(--sl-size-borderWidth-default));
    padding-inline: calc(var(--sl-size-300) - var(--sl-size-borderWidth-default))
      calc(var(--sl-size-150) - var(--sl-size-borderWidth-default));
    position: relative;
  }

  :host::before {
    background: var(--sl-color-border-info-bold);
    content: '';
    inline-size: calc(var(--sl-size-050) - var(--sl-size-borderWidth-default));
    inset: 0 auto 0 0;
    position: absolute;
  }

  @media (prefers-reduced-motion: no-preference) {
    :host {
      transition: 0.2s cubic-bezier(0.25, 0, 0.3, 1);
      transition-behavior: allow-discrete;
      transition-property: display, opacity;
    }
  }

  @starting-style {
    :host {
      display: flex;
      opacity: 0;
    }
  }

  sl-button {
    margin-inline-start: auto;
  }

  :host([no-title]) [part='title'] {
    display: none;
  }

  :host([no-title]) [part='content'] {
    grid-area: 1/2;
  }

  :host([size='lg']) {
    display: grid;
    grid-template-columns: auto 1fr var(--sl-size-300);
    padding: calc(var(--sl-size-300) - var(--sl-size-borderWidth-default));
  }

  :host([size='lg']) [part='icon'] {
    align-self: start;
  }

  :host([size='lg']) sl-button {
    align-self: start;
    grid-area: 1/3;
    inset-block-start: calc(var(--sl-size-150) * -1);
    position: absolute;
  }

  :host([size='lg']) [part='content'] {
    grid-column: 2;
  }

  :host([size='lg'][indismissible]) {
    grid-template-columns: auto 1fr;
  }

  :host([variant='success']) {
    --_background: var(--sl-color-background-positive-subtlest);

    border-color: var(--sl-color-border-positive-bold);
    color: var(--sl-color-foreground-positive-bold);
  }

  :host([variant='success'])::before {
    background: var(--sl-color-border-positive-bold);
  }

  :host([variant='danger']) {
    --_background: var(--sl-color-background-negative-subtlest);

    border-color: var(--sl-color-border-negative-bold);
    color: var(--sl-color-foreground-negative-bold);
  }

  :host([variant='danger'])::before {
    background: var(--sl-color-border-negative-bold);
  }

  :host([variant='warning']) {
    --_background: var(--sl-color-background-caution-subtlest);

    border-color: var(--sl-color-border-caution-bold);
    color: var(--sl-color-foreground-caution-bold);
  }

  :host([variant='warning'])::before {
    background: var(--sl-color-border-caution-bold);
  }

  [part='icon'] {
    align-items: center;
    block-size: 1lh;
    display: inline-flex;
  }

  [part='title'] {
    align-self: start;
    font-size: 1.2em;
    font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
    grid-area: 1/2;
    margin-block-end: var(--sl-size-025);
  }

  [part='title'] slot {
    display: block;
  }

  [part='content'] slot {
    display: block;
    text-wrap: pretty;
  }
`;
//# sourceMappingURL=inline-message.scss.js.map
