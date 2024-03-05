import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Card } from './card.js';

describe('sl-card', () => {
  let el: Card;
  const image = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
    title = 'Title',
    subHeader = 'subHeader',
    bodyCopy = 'Lorem Ipsum';

  describe('with image', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-card>
          <img slot="media" src=${image} />
          <sl-icon name="pinata" slot="icon"></sl-icon>
          <h2>${title}</h2>
          <h3 slot="header">${subHeader}</h3>
          <p slot="body">${bodyCopy}</p>
          <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="ellipsis"></sl-icon></sl-button>
        </sl-card>`
      );
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have the class "sl-horizontal" by default when an image is present', () => {
      expect(el).to.have.class('sl-horizontal');
    });

    it('should have the class "sl-has-icon" when an icon is present', () => {
      expect(el).to.have.class('sl-has-icon');
    });

    describe('vertical', () => {
      beforeEach(async () => {
        el.setAttribute('orientation', 'vertical');
        await el.updateComplete;
      });

      it('should not add the class "sl-horizontal" but it should add "has media"', () => {
        expect(el).not.to.have.class('sl-horizontal');
        expect(el).to.have.class('sl-has-media');
      });
    });
  });

  describe('without image', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-card>
          <h2>${title}</h2>
          <h3 slot="header">${subHeader}</h3>
          <p slot="body">${bodyCopy}</p>
          <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="ellipsis"></sl-icon></sl-button>
        </sl-card>`
      );
    });

    it('should not have the class "sl-horizontal" by default when no image is present', () => {
      expect(el).not.to.have.class('sl-horizontal');
    });

    it('should not have the class "sl-has-icon" when an icon is present', () => {
      expect(el).not.to.have.class('sl-has-icon');
    });
  });

  describe('with breakpoint set', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-card style="--sl-card-horizontal-breakpoint:1800px">
          <img slot="media" src=${image} />
          <h2>${title}</h2>
          <h3 slot="header">${subHeader}</h3>
          <p slot="body">${bodyCopy}</p>
          <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="ellipsis"></sl-icon></sl-button>
        </sl-card>`
      );
    });

    it('should switch to vertical mode when a breakpoint is set that is larger than the current screen width', () => {
      expect(el).not.to.have.class('sl-horizontal');
    });
  });
});
