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

  describe('description', () => {
    it('should set description from property', async () => {
      el = await fixture(html`<sl-radio description="Helper text">Option</sl-radio>`);
      await el.updateComplete;

      expect(el.hasAttribute('has-description')).to.be.true;
      const descriptionSlot = el.renderRoot.querySelector('slot[name="description"]');
      expect(descriptionSlot).to.exist;

      await new Promise(resolve => setTimeout(resolve, 50));
      const descriptionEl = el.querySelector('[slot="description"]');
      expect(descriptionEl).to.exist;
      expect(descriptionEl?.textContent).to.equal('Helper text');
      const wrapper = el.renderRoot.querySelector<HTMLElement>('[part="wrapper"]');
      expect(wrapper?.ariaDescribedByElements).to.include(descriptionEl as HTMLElement);
    });

    it('should set description from slot', async () => {
      el = await fixture(html`
        <sl-radio>
          Option
          <span slot="description">Slotted description</span>
        </sl-radio>
      `);
      await el.updateComplete;

      expect(el.hasAttribute('has-description')).to.be.true;
      await new Promise(resolve => setTimeout(resolve, 50));
      const descriptionEl = el.querySelector('[slot="description"]');
      expect(descriptionEl).to.exist;
      const wrapper = el.renderRoot.querySelector<HTMLElement>('[part="wrapper"]');
      expect(wrapper?.ariaDescribedByElements).to.include(descriptionEl as HTMLElement);
    });

    it('should prefer slotted description over property fallback', async () => {
      el = await fixture(html`
        <sl-radio description="Property fallback">
          Option
          <span slot="description"></span>
        </sl-radio>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const slottedEl = el.querySelector('span[slot="description"]'),
        wrapper = el.renderRoot.querySelector<HTMLElement>('[part="wrapper"]');
      expect(el.hasAttribute('has-description')).to.be.false;
      expect(el.querySelector('[slot="description"]')?.textContent).to.equal('');
      expect(wrapper?.ariaDescribedByElements).to.include(slottedEl as HTMLElement);
    });

    it('should keep a tracked slotted description when property fallback changes', async () => {
      el = await fixture(html`
        <sl-radio description="Property fallback">
          Option
          <span slot="description">Slotted description</span>
        </sl-radio>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const slottedEl = el.querySelector('span[slot="description"]') as HTMLElement,
        wrapper = el.renderRoot.querySelector<HTMLElement>('[part="wrapper"]')!;
      el.description = 'Updated property fallback';
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const descriptions = Array.from(el.querySelectorAll('[slot="description"]'));
      expect(descriptions).to.deep.equal([slottedEl]);
      expect(wrapper.ariaDescribedByElements).to.include(slottedEl);
      expect(slottedEl.textContent).to.equal('Slotted description');
    });

    it('should link all slotted description elements to the wrapper', async () => {
      el = await fixture(html`
        <sl-radio>
          Option
          <span slot="description">First description</span>
          <span slot="description" aria-hidden="false">Second description</span>
        </sl-radio>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const descriptions = Array.from(el.querySelectorAll<HTMLElement>('[slot="description"]')),
        wrapper = el.renderRoot.querySelector<HTMLElement>('[part="wrapper"]')!;
      expect(descriptions).to.have.length(2);
      descriptions.forEach(description => {
        expect(description.getAttribute('aria-hidden')).to.equal('true');
        expect(wrapper.ariaDescribedByElements).to.include(description);
      });

      descriptions[1].remove();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(descriptions[1].getAttribute('aria-hidden')).to.equal('false');
      expect(wrapper.ariaDescribedByElements).to.include(descriptions[0]);
      expect(wrapper.ariaDescribedByElements).not.to.include(descriptions[1]);
    });

    it('should update has-description attribute dynamically', async () => {
      el = await fixture(html`<sl-radio>Option</sl-radio>`);
      await el.updateComplete;

      expect(el.hasAttribute('has-description')).to.be.false;

      el.description = 'Added description';
      await el.updateComplete;

      expect(el.hasAttribute('has-description')).to.be.true;

      el.description = undefined;
      await el.updateComplete;

      expect(el.hasAttribute('has-description')).to.be.false;
    });

    it('should restore synthesized description and aria-hidden when slotted description is removed and property is present', async () => {
      el = await fixture(html`
        <sl-radio description="Property fallback">
          Option
          <span slot="description">Slotted description</span>
        </sl-radio>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const slottedEl = el.querySelector('span[slot="description"]');
      expect(slottedEl).to.exist;
      expect(slottedEl?.getAttribute('aria-hidden')).to.equal('true');
      const wrapper = el.renderRoot.querySelector<HTMLElement>('[part="wrapper"]');
      expect(wrapper?.ariaDescribedByElements).to.include(slottedEl as HTMLElement);

      slottedEl?.remove();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(slottedEl?.hasAttribute('aria-hidden')).to.be.false;
      expect(el.hasAttribute('has-description')).to.be.true;
      const synthesizedEl = el.querySelector('[slot="description"]');
      expect(synthesizedEl).to.exist;
      expect(synthesizedEl?.textContent).to.equal('Property fallback');
      expect(wrapper?.ariaDescribedByElements).to.include(synthesizedEl as HTMLElement);
    });

    it('should preserve external ariaDescribedByElements when description is added', async () => {
      el = await fixture(html`<sl-radio>Option</sl-radio>`);
      await el.updateComplete;

      const external = document.createElement('div');
      external.id = 'external-desc';
      document.body.appendChild(external);

      const wrapper = el.renderRoot.querySelector<HTMLElement>('[part="wrapper"]')!;
      wrapper.ariaDescribedByElements = [external];

      el.description = 'Added description';
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(wrapper.ariaDescribedByElements).to.include(external);
      const descriptionEl = el.querySelector('[slot="description"]');
      expect(wrapper.ariaDescribedByElements).to.include(descriptionEl as HTMLElement);

      external.remove();
    });

    it('should update has-description when slotted text mutates reactively', async () => {
      el = await fixture(html`
        <sl-radio>
          Option
          <span slot="description"></span>
        </sl-radio>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.hasAttribute('has-description')).to.be.false;

      const span = el.querySelector('span[slot="description"]')!;
      span.textContent = 'Dynamic reactive description';
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.hasAttribute('has-description')).to.be.true;

      span.textContent = '';
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.hasAttribute('has-description')).to.be.false;
    });
  });

  describe('tooltip', () => {
    it('should render an sl-tooltip when tooltip property is set', async () => {
      el = await fixture(html`<sl-radio tooltip="Tooltip information">Option</sl-radio>`);
      await el.updateComplete;

      const tooltip = el.renderRoot.querySelector('sl-tooltip');
      expect(tooltip).to.exist;
      expect(tooltip?.getAttribute('for')).to.equal('wrapper');
      expect(tooltip?.getAttribute('type')).to.equal('description');
      expect(tooltip?.textContent?.trim()).to.equal('Tooltip information');
    });

    it('should link tooltip to wrapper via ariaDescribedByElements', async () => {
      el = await fixture(html`<sl-radio tooltip="Tooltip information">Option</sl-radio>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const tooltip = el.renderRoot.querySelector('sl-tooltip');
      expect(tooltip).to.exist;
      const wrapper = el.renderRoot.querySelector<HTMLElement>('[part="wrapper"]');
      expect(wrapper?.ariaDescribedByElements).to.include(tooltip as HTMLElement);
    });
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
