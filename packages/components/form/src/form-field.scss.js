import { css } from 'lit';
export default css`
  :host {
    display: flex;
    flex-direction: column;
  }

  slot:not([name])::slotted(*) {
    margin-block-start: var(--sl-size-050);
  }

  slot:not([name])::slotted(:is(sl-checkbox, sl-switch[reverse])) {
    align-self: start;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
  }
`;
//# sourceMappingURL=form-field.scss.js.map
