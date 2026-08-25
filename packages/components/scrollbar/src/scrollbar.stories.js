import { html } from 'lit';
import '../register.js';
export default {
  title: 'Utilities/Scrollbar',
  args: {
    vertical: false
  },
  render: ({ scrolled, vertical }) => {
    if (typeof scrolled === 'number') {
      setTimeout(() => {
        const scroller = document.querySelector('#scroller');
        scroller.scrollTo({ [vertical ? 'top' : 'left']: scrolled });
      });
    }
    return html`
      <style>
        #scroller {
          block-size: 100px;
          overflow: auto;
          scrollbar-width: none;
        }
        .scrolling {
          background: linear-gradient(to ${vertical ? 'bottom' : 'right'}, red, blue);
          block-size: 100px;
          inline-size: 400dvw;
        }
        #storybook-root {
          max-width: calc(100vw - 2rem);
        }
      </style>
      <div id="scroller">
        <div class="scrolling"></div>
      </div>
      <sl-scrollbar ?vertical=${vertical} scroller="scroller"></sl-scrollbar>
    `;
  }
};
export const Basic = {};
export const ScrollTo = {
  args: {
    scrolled: 400
  }
};
export const Vertical = {
  args: {
    vertical: true
  }
};
//# sourceMappingURL=scrollbar.stories.js.map
