import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
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

    it('should render a unit if numberStyle is set to unit', async () => {
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

    it('should pad integer digits according to minimumIntegerDigits', async () => {
      el.number = 5;
      el.minimumIntegerDigits = 3;
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('005');
    });

    it('should render according to minimumSignificantDigits', async () => {
      el.number = 1.5;
      el.minimumSignificantDigits = 4;
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1.500');
    });

    it('should render according to maximumSignificantDigits', async () => {
      el.number = 1234.56;
      el.maximumSignificantDigits = 3;
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1,230');
    });

    it('should render in compact notation', async () => {
      el.notation = 'compact';
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1.2K');
    });

    it('should render in scientific notation', async () => {
      el.number = 1230;
      el.notation = 'scientific';
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1.23E3');
    });

    it('should always show the sign', async () => {
      el.signDisplay = 'always';
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('+1,234.56');
    });

    it('should never show the sign', async () => {
      el.number = -42;
      el.signDisplay = 'never';
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('42');
    });

    it('should render a negative number', async () => {
      el.number = -1234.56;
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('-1,234.56');
    });

    it('should render zero', async () => {
      el.number = 0;
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('0');
    });

    it('should render currency with code display', async () => {
      el.numberStyle = 'currency';
      el.currency = 'USD';
      el.currencyDisplay = 'code';
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('USD\u00a01,234.56');
    });

    it('should render currency with name display', async () => {
      el.numberStyle = 'currency';
      el.currency = 'USD';
      el.currencyDisplay = 'name';
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1,234.56 US dollars');
    });

    it('should use grouping if useGrouping is set to true', async () => {
      el.useGrouping = true;
      await el.updateComplete;

      expect(el.renderRoot).to.have.text('1,234.56');
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

    it('should render the slotted content if the number is NaN', async () => {
      el.number = NaN;
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

    it('should render the slotted content if no number is set', () => {
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

  describe('locale', () => {
    it('should format using the element locale attribute', async () => {
      el = await fixture(
        html`<sl-format-number number="1234.56" locale="nl-NL"></sl-format-number>`
      );

      expect(el.renderRoot).to.have.text('1.234,56');
    });
  });
});
