import { css } from 'lit';
export default css`
  :host {
    display: block;
  }

  :host([inverted]) li:not(.more-menu) a,
  :host([inverted]) li:not(.more-menu) ::slotted(a) {
    color: var(--sl-color-link-inverted-idle) !important;
  }

  :host([inverted]) li:not(.more-menu) a:focus-visible,
  :host([inverted]) li:not(.more-menu) ::slotted(a):focus-visible {
    outline-color: var(--sl-color-border-inverted) !important;
  }

  :host([inverted]) li:not(.more-menu) a:hover,
  :host([inverted]) li:not(.more-menu) ::slotted(a):hover {
    color: var(--sl-color-link-inverted-hover) !important;
  }

  :host([inverted]) li:not(.more-menu) a:active,
  :host([inverted]) li:not(.more-menu) ::slotted(a):active {
    color: var(--sl-color-link-inverted-active) !important;
  }

  :host([inverted]) li:not(.more-menu) a[aria-current='page'],
  :host([inverted]) li:not(.more-menu) ::slotted(a)[aria-current='page'] {
    color: var(--sl-color-link-inverted-idle) !important;
  }

  :host([inverted]) sl-icon[name='breadcrumb-separator'] {
    color: var(--sl-color-border-inverted);
  }

  ul {
    align-items: center;
    display: flex;
    gap: var(--sl-size-100);
    margin: 0;
    padding: 0;
  }

  li {
    display: block;
    list-style: none;
    min-inline-size: 0;
  }

  li.home {
    flex-shrink: 0;
  }

  li.home ::slotted(a[href]),
  li.home a {
    align-items: center;
    display: flex;
    gap: var(--sl-size-050);
  }

  li.more-menu {
    flex-shrink: 0;
  }

  a,
  ::slotted(a[href]) {
    color: var(--sl-color-link-muted-idle) !important;
    display: block;
    overflow: clip visible;
    padding: var(--sl-size-100);
    text-decoration: underline;
    text-decoration-thickness: var(--sl-size-borderWidth-default);
    text-overflow: ellipsis;
    text-underline-offset: var(--sl-size-025);
    white-space: nowrap;
  }

  @media (width <= 600px) {
    a,
    ::slotted(a[href]) {
      padding-block: var(--sl-size-100);
    }
  }

  a:hover,
  ::slotted(a[href]:hover) {
    color: var(--sl-color-link-muted-hover) !important;
    text-decoration-thickness: var(--sl-size-borderWidth-bold);
  }

  a:active,
  ::slotted(a[href]:active) {
    color: var(--sl-color-link-muted-active) !important;
  }

  a[aria-current='page'],
  ::slotted(a[href][aria-current='page']) {
    color: var(--sl-color-foreground-plain) !important;
    text-decoration: none;
  }

  a:focus-visible,
  ::slotted(a[href]:focus-visible) {
    border-radius: var(--sl-size-borderRadius-default);
    outline: var(--sl-size-borderWidth-focusRing) solid var(--sl-color-border-focused);
    outline-offset: var(--sl-size-offset-focused);
  }

  sl-icon[name='breadcrumb-separator'] {
    color: var(--sl-color-border-plain);
  }

  sl-popover {
    box-shadow: var(--sl-elevation-shadow-overflow);
  }

  sl-popover::part(arrow) {
    display: none;
  }

  sl-popover::part(container) {
    display: flex;
    flex-direction: column;
    gap: var(--sl-size-050);
    padding: var(--sl-size-100) 0;
    scrollbar-width: thin;
  }

  sl-popover ::slotted(a[href]) {
    border-radius: var(--sl-size-borderRadius-default);
    margin-inline: var(--sl-size-100);
    overflow: visible;
    padding: var(--sl-size-075) var(--sl-size-100);
    position: relative;
    text-decoration: none;
  }

  sl-popover ::slotted(a[href]:hover),
  sl-popover ::slotted(a[href]:focus-visible) {
    background: color-mix(
      in srgb,
      transparent,
      var(--sl-color-background-primary-interactive-plain)
        calc(100% * var(--sl-opacity-interactive-plain-hover))
    );
    color: var(--sl-color-foreground-plain) !important;
  }

  sl-popover ::slotted(a[href]:focus-visible) {
    outline: var(--sl-size-borderWidth-focusRing) solid var(--sl-color-border-focused);
    outline-offset: var(--sl-size-outlineOffset-default);
  }

  sl-popover ::slotted(a[href]:hover)::before,
  sl-popover ::slotted(a[href]:focus-visible)::before {
    background: var(--sl-color-background-selected-bold);
    border-radius: var(--sl-size-borderRadius-none) var(--sl-size-borderRadius-child)
      var(--sl-size-borderRadius-child) var(--sl-size-borderRadius-none);
    content: '';
    inline-size: var(--sl-size-050);
    inset-block: var(--sl-size-025);
    inset-inline-start: calc(var(--sl-size-100) * -1);
    position: absolute;
  }
`;
//# sourceMappingURL=breadcrumbs.scss.js.map
