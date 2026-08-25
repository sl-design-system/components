import { css } from 'lit';
export default css`
  :host([step-buttons='edges']) {
    padding: 0;
  }

  :host([step-buttons='edges']) slot[name='input']::slotted(input) {
    text-align: center;
  }

  ::slotted(input) {
    text-overflow: ellipsis;
  }

  .step-buttons {
    display: flex;
  }

  .step-buttons .plus {
    padding-inline-start: var(--sl-size-025);
  }

  .step-buttons .minus {
    padding-inline-end: var(--sl-size-025);
  }

  sl-field-button {
    aspect-ratio: auto;
    inline-size: auto;
  }

  sl-field-button.plus {
    padding-inline-end: calc(var(--sl-size-075) - var(--sl-size-borderWidth-default));
  }

  sl-field-button.minus {
    padding-inline-start: calc(var(--sl-size-075) - var(--sl-size-borderWidth-default));
  }
`;
//# sourceMappingURL=number-field.scss.js.map
