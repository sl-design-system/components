import { css } from 'lit';

export const componentStatusStyles = css`
  :host {
    --sl-button-bar-vertical: var(--sl-ON);

    display: grid;
    grid-column-gap: 7.2rem;
    grid-template-columns: 1fr; //88rem 1fr;
    //display: none;
    // display: block:
    // height: 200px;
    // border: 4px solid #AACBE9;
  }

  .wrapper {
    // display: grid;
    // grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
    background: #FFFFED; // #AACBE9;
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
    // display: flex;
    // align-items: center;
    border-bottom: 1px solid #C4C4C4;
    padding-block-end: 24px;

    sl-badge {
      width: fit-content;
    }
  }

  .links {
    display: block;
    // display: flex;
    // align-items: center;
    padding-block-start: 24px;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: var(--scale-50-scale);
    padding-inline-start: 1.6rem;
  }

  .info:first-of-type {
    padding-inline-end: 1.6rem;
    border-right: 1px solid #BCBCBC; // TODO: needs to be changed to token
  }

    sl-button-bar {
    --sl-button-bar-vertical: var(--sl-ON);
    --sl-button-bar-direction-column: column; // column-reverse;
  }

  .link {
    display: flex;
    gap: var(--scale-50-scale);
    align-items: center;
  }

  @media screen and (min-width: 750px) {
    .component-info {
      display: flex;
      align-items: center;
      border-bottom: none;
    }

    sl-button-bar {
        --sl-button-bar-vertical: var(--sl-OFF);
        --sl-button-bar-align: end;

        sl-button {
          flex-grow: 1;
        }
      }

     .links {
        padding-block-start: 0;
     }
  }

  @media screen and (min-width: 1200px) {
    :host {
    //   display: block;
    //   font: var(--typography-body);
         grid-template-columns: 6fr 1fr;
    }

     .wrapper {
        // grid-template-columns: 1fr 1fr;
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
