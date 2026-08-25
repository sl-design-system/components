import { css } from 'lit';
export default css`
  :host {
    display: flex;
    flex: 1;
  }

  [part='wrapper'] {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--sl-size-050);
    margin-inline: var(--sl-space-new-md);
  }

  slot[name='header'] .heading,
  slot[name='header']::slotted(*) {
    color: var(--sl-color-foreground-subtlest);
    font-size: 0.8571428571em;
    line-height: 1.3333333333em;
    padding: var(--sl-space-new-md) 0;
  }
`;
//# sourceMappingURL=menu-item-group.scss.js.map
