import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { Radio } from './radio.js';

describe('sl-radio', () => {
  let el: Radio;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-radio>Hello world</sl-radio>`);
    });

    it('should have a role of radio', () => {
      expect(el).to.have.attribute('role', 'radio');
    });

    it('should not have an explicit size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should have a size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should not be checked', () => {
      expect(el).to.have.attribute('aria-checked', 'false');
      expect(el).not.to.have.attribute('checked');
      expect(el.checked).not.to.be.true;
    });

    it('should be checked when clicked', async () => {
      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-checked', 'true');
      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
    });

    it('should be checked after Enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(el).to.have.attribute('aria-checked', 'true');
      expect(el).to.have.attribute('checked');
      expect(el.checked).to.equal(true);
    });

    it('should be checked after Space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');

      expect(el).to.have.attribute('aria-checked', 'true');
      expect(el).to.have.attribute('checked');
      expect(el.checked).to.equal(true);
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-radio disabled>Hello world</sl-radio>`);
    });

    it('should be disabled', () => {
      expect(el.disabled).to.be.true;
    });

    it('should ignore clicks', async () => {
      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-checked', 'false');
      expect(el).not.to.have.attribute('checked');
      expect(el.checked).not.to.be.true;
    });

    it('should ignore Enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(el).to.have.attribute('aria-checked', 'false');
      expect(el).not.to.have.attribute('checked');
      expect(el.checked).not.to.be.true;
    });

    it('should ignore Space', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(el).to.have.attribute('aria-checked', 'false');
      expect(el).not.to.have.attribute('checked');
      expect(el.checked).not.to.be.true;
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-radio checked>Hello world</sl-radio>`);
    });

    it('should be checked', () => {
      expect(el).to.have.attribute('aria-checked', 'true');
      expect(el.checked).to.be.true;
    });

    it('should not toggle checked after click', async () => {
      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-checked', 'true');
      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
    });
  });
});
