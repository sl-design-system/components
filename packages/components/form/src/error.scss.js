import { css } from 'lit';
export default css`
  :host {
    align-items: start;
    color: var(--sl-color-foreground-negative-plain);
    display: flex;
    font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
    gap: var(--sl-size-050);
    padding-block-start: var(--sl-size-050);
  }

  slot {
    display: inline-block;
  }

  sl-icon {
    margin-block-start: calc((1lh - max(0.8em, var(--sl-icon-size))) / 2);
  }

  @supports (inline-size: 1cap) {
    sl-icon {
      margin-block-start: calc((1lh - max(1cap, var(--sl-icon-size))) / 2);
    }
  }
`;
//# sourceMappingURL=error.scss.js.map
