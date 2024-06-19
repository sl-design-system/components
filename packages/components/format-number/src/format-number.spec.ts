import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type FormatNumber } from './format-number.js';

describe('sl-format-number', () => {
  let el: FormatNumber;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-format-number number="1234.56"></sl-format-number>`);
    });

    it('should render a decimal number by default', () => {
      expect(el.renderRoot).to.have.text('1,234.56');
    });

    it('should render a currency number if numberStyle is set to currency', async () => {
      el.numberStyle = 'currency';
      el.currency = 'USD';
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('$1,234.56');
    });

    it('should render a percentage if numberStyle is set to percent', async () => {
      el.numberStyle = 'percent';
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('123,456%');
    });

    it('should render a currency unit if numberStyle is set to unit', async () => {
      el.numberStyle = 'unit';
      el.unit = 'meter';
      el.unitDisplay = 'long';
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1,234.56 meters');
    });

    it('should not use grouping if useGrouping is set to false', async () => {
      el.useGrouping = false;
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1234.56');
    });

    it('should render fractions according to minimumFractionDigits', async () => {
      el.minimumFractionDigits = 3;
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1,234.560');
    });

    it('should render fractions according to maximumFractionDigits', async () => {
      el.maximumFractionDigits = 1;
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1,234.6');
    });

    it('should have formatOptions override any other formatting options', async () => {
      el.formatOptions = { minimumFractionDigits: 3 };
      el.minimumFractionDigits = 1;
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1,234.560');
    });
  });

  describe('fallback', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-format-number>Hello world</sl-format-number>`);
    });

    it('should not render the slotted content if the number is valid', async () => {
      el.number = 1234;
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1,234');
    });

    it('should render the slotted content if the number is not a number', async () => {
      el.number = 'lorem' as unknown as number;
      await el.updateComplete;

      const slot = el.renderRoot.querySelector('slot');

      expect(slot).to.exist;
      expect(
        slot!
          .assignedNodes()
          .map(n => n.textContent)
          .join('')
      ).to.equal('Hello world');
    });
  });
});
