import { css } from 'lit';
export default css`
  :host {
    align-items: center;
    background: color-mix(
      in srgb,
      var(--_bg-color),
      var(--_bg-mix-color) calc(100% * var(--_bg-opacity))
    );
    display: flex;
    gap: var(--sl-size-100);
    min-inline-size: 0;
  }

  :host([width='xs']) sl-button,
  :host([width='xs']) sl-menu-button {
    display: none;
  }

  :host([width='xs']) .wrapper {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--sl-size-100);
    justify-content: center;
  }

  :host([width='xs']) sl-select {
    min-inline-size: var(--sl-size-1000);
  }

  :host([width='xs']) sl-option::part(wrapper) {
    white-space: nowrap;
  }

  .page {
    box-sizing: border-box;
    flex-shrink: 0;
    inline-size: calc(1lh + var(--sl-size-100) * 2);
    padding-inline: 0;
  }

  :host([size='sm']) .page {
    inline-size: calc(1lh + var(--sl-size-050));
  }

  :host([size='lg']) .page {
    inline-size: calc(1lh + var(--sl-size-175) * 2);
  }

  .wrapper {
    display: none;
  }
`;
//# sourceMappingURL=paginator.scss.js.map
