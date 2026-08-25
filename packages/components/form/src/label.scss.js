import { css } from 'lit';
export default css`
  :host {
    align-items: center;
    display: inline-flex;
    gap: var(--sl-size-050);
  }

  ::slotted([slot='label']) {
    color: var(--sl-color-foreground-bold);
    font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
  }

  .optional,
  .required {
    font-weight: var(--sl-text-new-typeset-fontWeight-regular);
    margin-inline-start: var(--sl-size-050);
  }
`;
//# sourceMappingURL=label.scss.js.map
