import '@sl-design-system/infotip/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Radio } from './radio.js';

describe('sl-radio', () => {
  let el: Radio;

  it('should ignore non-infotip elements assigned to the infotip slot', async () => {
    el = await fixture(html`
      <sl-radio>
        Label
        <span slot="infotip">Not an infotip</span>
      </sl-radio>
    `);

    await el.updateComplete;

    expect(el.infotip).to.be.undefined;
  });

  it('should set an infotip describe label based on the radio label', async () => {
    el = await fixture(html`
      <sl-radio>
        Label
        <sl-infotip slot="infotip">More info</sl-infotip>
      </sl-radio>
    `);

    await el.updateComplete;

    expect(el.infotip?.size).to.equal('sm');
    expect(el.infotip?.describes).to.equal('Label');
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-radio>Hello world</sl-radio>`);
    });

    it('should have a role of radio', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('role', 'radio');
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
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('aria-checked', 'false');
      expect(el).not.to.have.attribute('checked');
      expect(el.checked).not.to.be.true;
    });

    it('should be checked when clicked', async () => {
      (el.renderRoot.querySelector('[part="wrapper"]') as HTMLElement)?.click();
      await el.updateComplete;

      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('aria-checked', 'true');
      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
    });

    it('should be checked after Enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');

      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('aria-checked', 'true');
      expect(el).to.have.attribute('checked');
      expect(el.checked).to.equal(true);
    });

    it('should be checked after Space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');

      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('aria-checked', 'true');
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

      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('aria-checked', 'false');
      expect(el).not.to.have.attribute('checked');
      expect(el.checked).not.to.be.true;
    });

    it('should ignore Enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('aria-checked', 'false');
      expect(el).not.to.have.attribute('checked');
      expect(el.checked).not.to.be.true;
    });

    it('should ignore Space', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('aria-checked', 'false');
      expect(el).not.to.have.attribute('checked');
      expect(el.checked).not.to.be.true;
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-radio checked>Hello world</sl-radio>`);
    });

    it('should be checked', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('aria-checked', 'true');
      expect(el.checked).to.be.true;
    });

    it('should not toggle checked after click', async () => {
      el.click();
      await el.updateComplete;

      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('aria-checked', 'true');
      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
    });
  });

  describe('focus and blur delegation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-radio>Test</sl-radio>`);
    });

    it('should delegate focus to wrapper', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]') as HTMLElement;
      const focusSpy = spy(wrapper, 'focus');

      el.focus();

      expect(focusSpy).to.have.been.calledOnce;
    });

    it('should delegate blur to wrapper', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]') as HTMLElement;
      const blurSpy = spy(wrapper, 'blur');

      el.blur();

      expect(blurSpy).to.have.been.calledOnce;
    });
  });

  describe('wrapper tabindex', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-radio>Test</sl-radio>`);
    });

    it('should have tabindex 0 when not disabled', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('tabindex', '0');
    });

    it('should update wrapper tabindex to -1 when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('tabindex', '-1');
    });

    it('should update wrapper tabindex to 0 when re-enabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      el.disabled = false;
      await el.updateComplete;

      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');
      expect(wrapper).to.have.attribute('tabindex', '0');
    });
  });

  describe('infotip click handling', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-radio>
          Label
          <sl-infotip slot="infotip">More info</sl-infotip>
        </sl-radio>
      `);
    });

    it('should not check radio when clicking infotip', async () => {
      const infotip = el.querySelector('sl-infotip') as HTMLElement;

      await userEvent.click(infotip);
      await el.updateComplete;

      expect(el.checked).not.to.be.true;
    });

    it('should check radio when clicking wrapper', async () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]') as HTMLElement;

      await userEvent.click(wrapper);
      await el.updateComplete;

      expect(el.checked).to.be.true;
    });
  });

  describe('infotip describes attribute', () => {
    it('should not overwrite user-set describes', async () => {
      el = await fixture(html`
        <sl-radio>
          Label
          <sl-infotip slot="infotip" describes="Custom description">More info</sl-infotip>
        </sl-radio>
      `);

      await el.updateComplete;

      expect(el.infotip?.describes).to.equal('Custom description');
    });

    it('should not update describes when label changes after initial render', async () => {
      el = await fixture(html`
        <sl-radio>
          <span id="label">Initial</span>
          <sl-infotip slot="infotip">More info</sl-infotip>
        </sl-radio>
      `);

      await el.updateComplete;
      expect(el.infotip?.describes).to.equal('Initial');

      const label = el.querySelector('#label');
      if (label) label.textContent = 'Updated';

      await el.updateComplete;
      // Trigger slotchange manually
      const slot = el.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
      slot?.dispatchEvent(new Event('slotchange'));

      await el.updateComplete;
      // Describes should remain unchanged after initial set
      expect(el.infotip?.describes).to.equal('Initial');
    });
  });

  describe('label text extraction', () => {
    it('should extract text from multiple nodes', async () => {
      el = await fixture(html`
        <sl-radio>
          <span>Part 1</span> <span>Part 2</span>
          <sl-infotip slot="infotip">More info</sl-infotip>
        </sl-radio>
      `);

      await el.updateComplete;

      expect(el.infotip?.describes).to.equal('Part 1 Part 2');
    });

    it('should normalize whitespace in label text', async () => {
      el = await fixture(html`
        <sl-radio>
          Label with extra spaces
          <sl-infotip slot="infotip">More info</sl-infotip>
        </sl-radio>
      `);

      await el.updateComplete;

      expect(el.infotip?.describes).to.equal('Label with extra spaces');
    });

    it('should trim leading and trailing whitespace', async () => {
      el = await fixture(html`
        <sl-radio>
          Label

          <sl-infotip slot="infotip">More info</sl-infotip>
        </sl-radio>
      `);

      await el.updateComplete;

      expect(el.infotip?.describes).to.equal('Label');
    });
  });

  describe('value property', () => {
    it('should accept string values', async () => {
      el = await fixture(html`<sl-radio value="option1">Option 1</sl-radio>`);

      expect(el.value).to.equal('option1');
    });

    it('should accept number values', async () => {
      el = await fixture(html`<sl-radio .value=${42}>Option 1</sl-radio>`);

      expect(el.value).to.equal(42);
    });

    it('should accept object values', async () => {
      const obj = { id: 1, name: 'test' };
      el = await fixture(html`<sl-radio .value=${obj}>Option 1</sl-radio>`);

      expect(el.value).to.equal(obj);
    });
  });

  describe('showValidity property', () => {
    it('should reflect showValidity attribute', async () => {
      el = await fixture(html`<sl-radio show-validity="invalid">Test</sl-radio>`);

      expect(el.showValidity).to.equal('invalid');
      expect(el).to.have.attribute('show-validity', 'invalid');
    });

    it('should update showValidity attribute when property changes', async () => {
      el = await fixture(html`<sl-radio>Test</sl-radio>`);

      el.showValidity = 'valid';
      await el.updateComplete;

      expect(el).to.have.attribute('show-validity', 'valid');
    });
  });
});
