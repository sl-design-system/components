import { css } from 'lit';
export default css`
  :host {
    align-items: start;
    display: flex;
    flex-direction: column;
    gap: var(--sl-size-050);
    vertical-align: top;
  }

  :host([horizontal]) {
    flex-direction: row;
    gap: var(--sl-size-300);
  }
`;
//# sourceMappingURL=radio-group.scss.js.map
