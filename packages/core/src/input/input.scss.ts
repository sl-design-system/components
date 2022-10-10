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
    display: block;
  }

  :host([invalid]) input {
    border-color: red;
  }

  :host([invalid]) input {
    border-color: #ed1d23;
    border-radius: 3px;
  }

  :host([invalid]) .with-error {
    display: block;
  }

  input {
    border: 1px solid #d3d3d3;
    border-radius: 3px;
    margin-top: 3px;
    padding: 5px 7px;
  }

  input:focus-visible {
    border-color: hsl(207deg, 95%, 39%);
    box-shadow: 0 0 0 3px hsla(207deg, 95%, 47%, 0.25);
    outline: none;
  }

  .with-error {
    color: #ed1d23;
    display: none;
    padding: 5px 0;
  }
`;
