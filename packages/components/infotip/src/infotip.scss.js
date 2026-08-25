import { css } from 'lit';
export default css`
  :host {
    align-items: center;
    display: inline-flex;
    justify-content: center;
  }

  :host([size='sm']) sl-icon,
  :host([size='sm']) ::slotted(sl-icon) {
    --sl-icon-size: var(--sl-size-150);
  }
`;
//# sourceMappingURL=infotip.scss.js.map
