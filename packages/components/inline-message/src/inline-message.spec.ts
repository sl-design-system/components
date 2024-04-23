import { expect, fixture } from '@open-wc/testing';
import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { html } from 'lit';
import '../register.js';
import { InlineMessage } from './inline-message.js';

describe('sl-inline-message', () => {
  let el: InlineMessage;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-inline-message id="inlMsg-1" closing-button>
          <span slot="title">Inline message title</span>
        </sl-inline-message>
      `);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have the info variant by default', () => {
      expect(el).to.have.attribute('variant', 'info');
    });

    it('should be dismissible by default', () => {
      expect(el.hasAttribute('dismissible')).to.be.true;
    });

    it('should not have the no-icon by default', () => {
      expect(el.hasAttribute('no-icon')).to.be.false;
    });

    it('should have success variant when set', async () => {
      el.variant = 'success';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'success');
    });

    it('should not indismissible when set', async () => {
      el.indismissible = true;
      await el.updateComplete;

      expect(el?.shadowRoot?.querySelector('slot[name="close-button"] sl-button')).to.be.null;
    });
  });

  describe('Closing inline message', () => {
    it('should close the inline message when the close button is clicked', async () => {
      const msg = await fixture<InlineMessage>(html`
        <sl-inline-message variant="danger">
          <span slot="title">Variant danger inline message</span>
          A place for additional description
        </sl-inline-message>
      `);
      const closeButton = msg.shadowRoot?.querySelector('slot[name="close-button"] sl-button') as Button;

      setTimeout(() => closeButton.click());
      await new Promise(resolve => setTimeout(resolve, 500));

      expect(document.querySelectorAll('sl-inline-message')).not.to.exist;
    });

    it('should close the inline message when remove is called', async () => {
      const elMsg = await fixture<InlineMessage>(html`
        <sl-inline-message variant="info">
          <span slot="title">inline message</span>
          A place for additional description
        </sl-inline-message>
      `);

      elMsg.remove();

      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(document.querySelectorAll('sl-inline-message')).not.to.exist;
    });
  });
});
