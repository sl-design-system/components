import { css } from 'lit';
export default css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  sl-form {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr 1fr;
  }

  sl-form > * {
    grid-column: span 2;
  }

  sl-form-field[name='firstName'],
  sl-form-field[name='lastName'] {
    grid-column: span 1;
  }

  sl-number-field[name='otherAge'] {
    margin-inline-start: 2rem;
  }
`;
//# sourceMappingURL=composite-form.scss.js.map
