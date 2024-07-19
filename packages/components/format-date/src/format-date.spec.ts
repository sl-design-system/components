import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { FormatDate } from './format-date.js';

describe('sl-format-number', () => {
  let el: FormatDate;
  const date = new Date(2022, 11, 17, 14, 5, 42);

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-format-date date=${date}></sl-format-date>`);
    });

    it('should render a date by default', () => {
      expect(el.renderRoot).to.have.trimmed.text('12/17/2022');
    });

    it('should use a proper locale when set', async () => {
      el.locale = 'pl-PL';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('17.12.2022');
    });

    it('should not use formatting options except day, month and year by default', () => {
      expect(el.weekday).to.be.undefined;
      expect(el.era).to.be.undefined;
      expect(el.dayPeriod).to.be.undefined;
      expect(el.hour).to.be.undefined;
      expect(el.minute).to.be.undefined;
      expect(el.second).to.be.undefined;
      expect(el.timeZoneName).to.be.undefined;
      expect(el.timeZone).to.be.undefined;
      expect(el.hour12).to.be.undefined;
    });

    it('should format date with the right long era when set', async () => {
      el.era = 'long';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('12/17/2022 Anno Domini');
    });

    it('should format date with the long weekday when set', async () => {
      el.weekday = 'long';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('Saturday');
    });

    it('should format date with the numeric year when set', async () => {
      el.year = 'numeric';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('2022');
    });

    it('should format date with the long month when set', async () => {
      el.month = 'long';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('December');
    });

    it('should format date with the numeric day when set', async () => {
      el.day = 'numeric';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('17');
    });

    it('should format date with the long day period when set', async () => {
      el.dayPeriod = 'long';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('in the afternoon');
    });

    it('should format date (time) with the numeric hour when set', async () => {
      el.hour = 'numeric';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('2 PM');
    });

    it('should format date (time) with the numeric minute when set', async () => {
      el.minute = 'numeric';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('5');
    });

    it('should format date (time) with the numeric second when set', async () => {
      el.second = 'numeric';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('42');
    });

    it('should format date (time) with the set time zone', async () => {
      el.timeZone = 'UTC';
      el.timeZoneName = 'short';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('12/17/2022, UTC');
    });

    it('should format date (time) with the long time zone name when set', async () => {
      el.timeZone = 'UTC';
      el.timeZoneName = 'long';

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('12/17/2022, Coordinated Universal Time');
    });

    it('should format date (time) with the 24h time when set', async () => {
      el.hour = 'numeric';
      el.minute = 'numeric';
      el.hour12 = false;

      await el.updateComplete;
      expect(el.renderRoot).to.have.trimmed.text('14:05');
    });
  });

  describe('fallback', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-format-date>This is not a proper date.</sl-format-date>`);
    });

    it('should not render the slotted content if the date is valid', async () => {
      el.date = new Date(Date.UTC(2022, 11, 17, 14, 5, 42));
      await el.updateComplete;

      expect(el.renderRoot).to.have.trimmed.text('12/17/2022');
    });

    it('should render the slotted content if the number is not a number', async () => {
      el.date = 'is it a proper date format?';
      await el.updateComplete;

      const slot = el.renderRoot.querySelector('slot');

      expect(slot).to.exist;
      expect(
        slot!
          .assignedNodes()
          .map(n => n.textContent)
          .join('')
      ).to.equal('This is not a proper date.');
    });
  });
});
