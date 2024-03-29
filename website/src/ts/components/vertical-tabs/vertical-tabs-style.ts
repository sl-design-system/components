import { css } from 'lit';

export const verticalTabsStyles = css`
  :host {
    display: block;
    font: var(--typography-body);
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

  .ds-tabs-wrapper {
    column-gap: 0.4rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-x: scroll;
    padding-inline-start: 0;
    scrollbar-width: none;
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
    inset-block-start: 15%;
    justify-content: center;
    margin: auto;
    overflow: hidden;
    padding-block-start: 0;
  }

  .ds-tabs__vertical-indicator {
    background-color: var(--tab-indicator-background);
    block-size: 100%;
    border-radius: 0.1rem;
    inline-size: 0.2rem;
    inset-block-start: 2.3rem;
    position: relative;
    transition: all 400ms cubic-bezier(0.38, 0.8, 0.32, 1.07);
  }

  .ds-tab--vertical.active:not(:focus-visible) {
    color: var(--highlight-color);
  }

  .ds-tabs__vertical-slider {
    background-color: var(--vertical-slider-background);
    position: relative;
  }
`;
