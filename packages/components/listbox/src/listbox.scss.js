import { css } from 'lit';
export default css`
  :host {
    align-items: stretch;
    contain: layout paint style;
    display: flex;
    flex-direction: column;
    gap: var(--sl-size-025);
    overflow: auto;
    overflow-anchor: none;
    overscroll-behavior: contain;
    padding: var(--sl-size-100) 0;
    scroll-padding-block: var(--sl-size-100);
    scrollbar-width: thin;
  }

  :host([data-virtual-unconstrained]) {
    max-block-size: 20rem;
  }

  ::slotted(hr) {
    border: 0;
    border-block-start: var(--sl-color-border-plain) solid var(--sl-size-borderWidth-default);
    margin: var(--sl-size-050) 0;
    padding: 0;
  }
`;
//# sourceMappingURL=listbox.scss.js.map
