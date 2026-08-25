import { css } from 'lit';
export default css`
  :host {
    display: block;
  }

  sl-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  sl-form-field[name='street'],
  sl-form-field[name='city'] {
    grid-column: span 2;
  }
`;
//# sourceMappingURL=child-form.scss.js.map
