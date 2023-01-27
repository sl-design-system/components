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
    border: 1px solid #4e1;
  }
`;
