import { css } from 'lit';
export default css`
  :host {
    align-items: center;
    display: flex;
    flex: 1;
    gap: var(--sl-size-100);
    padding: var(--sl-size-150);
  }

  slot {
    font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
  }

  sl-button {
    margin-inline-start: auto;
  }
`;
//# sourceMappingURL=sorter.scss.js.map
