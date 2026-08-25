import { css } from 'lit';
export default css`
  :host {
    display: inline-flex;
  }

  sl-menu slot::slotted(:nth-child(1 of :not([slot]))) {
    border-block-start: 0;
    margin-block-start: 0;
    padding-block-start: 0;
  }
`;
//# sourceMappingURL=menu-button.scss.js.map
