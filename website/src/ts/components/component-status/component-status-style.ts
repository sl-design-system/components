import { css } from 'lit';

export const componentStatusStyles = css`
  :host {
    --sl-button-bar-vertical: var(--sl-ON);

    display: grid;
    grid-column-gap: 7.2rem;
    grid-template-columns: 1fr;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    margin-block-start: var(--scale-400-scale);
  }

  h4,
  .ds-heading-4 {
    font-family: 'the-message', sans-serif;
    font-size: 1.4rem;
    line-height: 2.4rem;
    margin-block-end: var(--scale-50-scale);
    font-weight: 600;
  }

  .component-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 0.1rem solid var(--control-color-border-200-border);
    padding-block-end: 2.4rem;

    sl-badge {
      width: fit-content;
    }
  }

  .links {
    display: block;
    padding-block-start: 2.4rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--scale-50-scale);
  }

  .info:first-of-type {
    padding-inline-end: 1.6rem;
    border-right: 0.1rem solid var(--control-color-surface-400-surface);
  }

  .info:not(:first-of-type) {
    padding-inline-start: 2.4rem;
  }

  sl-button-bar {
    --sl-button-bar-vertical: var(--sl-ON);
    --sl-button-bar-direction-column: column;
  }

  .link {
    display: flex;
    gap: var(--scale-50-scale);
    align-items: center;

     sl-icon {
      --sl-icon-fill-default: var(--control-color-border-400-border);
    }
  }

  a:not(.ds-button) {
    color: var(--link-color);
    cursor: pointer;
    transition: transform $transition-timing;

    &:active {
      color: var(--link-active-color);
    }

    &:visited {
      color: var(--link-visited-color);
    }

    &:hover {
    color: var(--link-hover-color);
    }

    &.header-anchor {
      color: var(--font-color);
    }
  }

  .ds-button {
    --_background: var(--color-button-default-outline-idle-background);
    --_border-color: var(--control-color-text-base-text);
    --_color: var(--helper-text);

    align-items: center;
    justify-content: center;
    background: var(--_background);
    border: 0.1rem solid var(--_border-color);
    border-radius: 0.2rem;
    color: var(--_color);
    display: inline-flex;
    font-size: 1.4rem;
    font-weight: 600;
    gap: 0.8rem;
    line-height: 2.4rem;
    padding: 0.7rem 1.2rem;
    position: relative;
    text-decoration: none;
    transition: background-color 200ms linear;

    * {
      color: var(--_color);
    }

    sl-icon {
      fill: var(--_color);
    }

    &:hover {
      --_background: var(--control-color-text-base-text);
      --_border-color: var(--control-color-state-accent-border-hover-state);
      --_color: var(--control-color-state-accent-border-hover-state);

      sl-icon {
        fill: var(--_color);
      }
    }

    &:active {
      --_background: var(--control-color-visuals-component-text);
      --_border-color: var(--control-color-state-accent-border-active-state);
      --_color: var(--control-color-state-accent-border-hover-state);
    }

    &:focus-visible {
      border-radius: 0.2rem;
      outline: 0.2rem solid var(--control-color-focus-accent-focus);
      outline-offset: 0.2rem;
    }
  }

  @media screen and (min-width: 750px) {
    .component-info {
      display: flex;
      align-items: start;
      border-bottom: none;
    }

    sl-button-bar {
        --sl-button-bar-vertical: var(--sl-OFF);
        --sl-button-bar-align: end;
    }

    .ds-button {
        justify-content: center;
        flex-grow: 1;
        inline-size: fit-content;
    }

    .links {
        padding-block-start: 0;
    }
  }

  @media screen and (min-width: 1200px) {
    :host {
      grid-template-columns: 6fr 1fr;
    }

    .wrapper {
       display: flex;
       flex-direction: row;
       justify-content: space-between;
       align-items: center;
     }

    sl-button-bar {
      --sl-button-bar-vertical: var(--sl-OFF);
      --sl-button-bar-align: end;

      sl-button {
        flex-grow: 0;
      }
    }

    .info:not(:first-of-type) {
      padding-inline-start: 1.6rem;
    }

    .component-info {
      padding-block-end: 0;
    }

    .links {
      padding-block-start: 0;
    }
  }

  @media screen and (min-width: 1600px) {
    :host {
      grid-template-columns: 88rem 1fr;
    }
  }

  h2 {
    font: var(--typography-h2);
    margin-block: var(--typography-h2-margin-block);
  }

  a.header-anchor {
    color: inherit;
    font-size: inherit;
    text-decoration: none;
  }

  .ds-tabs {
    position: sticky;
    inset-block-start: 15%;
  }

  .ds-tabs-wrapper {
    column-gap: 0.4rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-x: scroll;
    padding-inline-start: 0;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .ds-tabs-wrapper::before {
    content: 'CONTENTS';
    display: block;
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.5rem;
    margin-block-end: 0.8rem;
    margin-inline-start: 0.8rem;
  }

  .ds-tabs__container {
    display: flex;
    flex-direction: row-reverse;
    justify-content: start;
    margin: auto;
    overflow: hidden;
    padding-block-start: 0;
    background-color: var(--background-color);
    inset-block-start: -0.1rem;
    overflow-x: hidden;
    transition: padding-top 300ms;
  }

  .ds-tabs__vertical-indicator {
    background-color: var(--tab-indicator-background);
    block-size: 100%;
    border-radius: 0.1rem;
    inline-size: 0.2rem;
    inset-block-start: 2.3rem;
    position: relative;
    height: 3.2rem;
    transition: all 400ms cubic-bezier(0.38, 0.8, 0.32, 1.07);
  }

  .ds-tab--vertical.active:not(:focus-visible) {
    color: var(--highlight-color);
  }

  .ds-tabs__vertical-slider {
    background-color: var(--vertical-slider-background);
    position: relative;
  }

  .ds-tab--vertical {
    background: none;
    border: 0;
    color: var(--tab-color);
    cursor: pointer;
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 2rem;
    padding: 0.6rem 0 0.6rem 0.8rem;
    text-decoration: none;
    transition: color $transition-timing linear;

    &.active:not(:focus-visible) {
      color: var(--highlight-color);
    }

    &:hover {
      color: var(--highlight-color);
    }

    &:focus-visible {
      border-radius: 0.6rem;
      box-shadow: inset var(--focus-box-shadow);
      outline: none;
    }
  }
`;
