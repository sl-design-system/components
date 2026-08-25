import { css } from 'lit';
export default css`
  :host {
    display: block;
  }

  slot {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
//# sourceMappingURL=ellipsize-text.scss.js.map
