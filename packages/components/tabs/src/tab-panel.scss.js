import { css } from 'lit';
export default css`
  :host {
    display: block;
  }

  :host([aria-hidden='true']) {
    display: none;
    pointer-events: none;
  }
`;
//# sourceMappingURL=tab-panel.scss.js.map
