import { css } from 'lit';

export const verticalTabsStyles = css`
  :host {
    display: none;
  }

  @media screen and (min-width: 1200px) {
    :host {
      display: block;
      font: var(--typography-body);
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
    height: 32px;
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
