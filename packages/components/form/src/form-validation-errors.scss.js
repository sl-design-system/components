import { css } from 'lit';
export default css`
  :host {
    display: none;
  }

  ul {
    display: inline;
    margin: 0;
    padding: 0;
  }

  li {
    display: inline;
  }

  li::after {
    content: ', ';
  }

  li:last-of-type::after {
    content: '';
  }
`;
//# sourceMappingURL=form-validation-errors.scss.js.map
