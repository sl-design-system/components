import { css } from 'lit';

export default css`
  :host {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  :host {
    --_border-radius: var(--sl-border-radius-button);
    --_padding: var(--sl-space-button-lg);
  }

  :host {
    background: var(--_background);
    border: var(--_border-width) solid var(--_border-color);
    border-radius: var(--_border-radius);
    color: var(--_color);
    cursor: pointer;
    display: inline-flex;
    padding: var(--_padding);
  }

  :host([fill='solid']) {
    --_background: var(--sl-color-button-primary-solid-idle-background);
    --_border-color: var(--sl-color-button-primary-solid-idle-border);
    --_border-width: var(--sl-border-width-button-outline, var(--sl-border-width-button));
    --_color: var(--sl-color-button-primary-solid-idle-foreground);
  }
`;
