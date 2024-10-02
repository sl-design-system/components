import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type EllipsisText } from './ellipsis-text.js';

describe('sl-ellipsis-text', () => {
  let el: EllipsisText;

  beforeEach(async () => {
    el = await fixture(html`<sl-ellipsis-text>This is a long text that should be truncated</sl-ellipsis-text>`);
  });

  it('should render a slot with the text', () => {
    const slot = el.renderRoot.querySelector('slot');

    expect(slot).to.exist;
    expect(
      slot
        ?.assignedNodes()
        .map(node => node.textContent?.trim())
        .join('')
    ).to.equal('This is a long text that should be truncated');
  });

  it('should not have a tooltip by default', () => {
    expect(el).not.to.have.attribute('aria-describedby');
  });

  describe('tooltip', () => {
    beforeEach(async () => {
      el.style.width = '100px';

      // Wait for the resize observer to trigger
      await new Promise(resolve => setTimeout(resolve, 100));

      // Trigger a focus event to create the tooltip
      el.dispatchEvent(new Event('focusin'));
    });

    it('should have a tooltip when there is not enough space', () => {
      const tooltip = el.nextElementSibling;

      expect(tooltip).to.exist;
      expect(tooltip).to.match('sl-tooltip');
      expect(el).to.have.attribute('aria-describedby', tooltip?.id);
    });

    it('should remove the tooltip when the element is removed from the DOM', () => {
      el.remove();

      expect(document.querySelector('sl-tooltip')).not.to.exist;
    });
  });
});
