import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import '@sl-design-system/infotip/register.js';
import {
  getForwardedAccessibleName,
  getForwardedAriaProperty,
  getForwardedDescription
} from '@sl-design-system/shared/helpers/forward-aria.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Checkbox } from './checkbox.js';

describe('sl-checkbox', () => {
  let el: Checkbox, input: HTMLInputElement;

  it('should ignore non-infotip elements assigned to the infotip slot', async () => {
    el = await fixture(html`
      <sl-checkbox>
        Label
        <span slot="infotip">Not an infotip</span>
      </sl-checkbox>
    `);

    await el.updateComplete;

    expect(el.infotip).to.be.undefined;
  });

  it('should set an infotip describe label based on the checkbox label', async () => {
    el = await fixture(html`
      <sl-checkbox>
        Label
        <sl-infotip slot="infotip">More info</sl-infotip>
      </sl-checkbox>
    `);

    await el.updateComplete;

    expect(el.infotip?.size).to.equal('sm');
    expect(el.infotip?.describes).to.equal('Label');
  });

  it('should not overwrite user-set describes on infotip', async () => {
    el = await fixture(html`
      <sl-checkbox>
        Label
        <sl-infotip slot="infotip" describes="Custom description">More info</sl-infotip>
      </sl-checkbox>
    `);

    await el.updateComplete;

    expect(el.infotip?.describes).to.equal('Custom description');
  });

  it('should extract text from multiple nodes for infotip describes', async () => {
    el = await fixture(html`
      <sl-checkbox>
        <span>Part 1</span> <span>Part 2</span>
        <sl-infotip slot="infotip">More info</sl-infotip>
      </sl-checkbox>
    `);

    await el.updateComplete;

    expect(el.infotip?.describes).to.equal('Part 1 Part 2');
  });

  it('should normalize whitespace in label text for infotip describes', async () => {
    el = await fixture(html`
      <sl-checkbox>
        Label with extra spaces
        <sl-infotip slot="infotip">More info</sl-infotip>
      </sl-checkbox>
    `);

    await el.updateComplete;

    expect(el.infotip?.describes).to.equal('Label with extra spaces');
  });

  it('should not check checkbox when clicking infotip', async () => {
    el = await fixture(html`
      <sl-checkbox>
        Label
        <sl-infotip slot="infotip">More info</sl-infotip>
      </sl-checkbox>
    `);

    const infotip = el.querySelector('sl-infotip') as HTMLElement;

    await userEvent.click(infotip);
    await el.updateComplete;

    expect(el.checked).not.to.be.true;
  });

  describe('description', () => {
    it('should set description from property', async () => {
      el = await fixture(html`<sl-checkbox description="Helper text">Option</sl-checkbox>`);
      await el.updateComplete;

      expect(el.hasAttribute('has-description')).to.be.true;
      const descriptionSlot = el.renderRoot.querySelector('slot[name="description"]');
      expect(descriptionSlot).to.exist;

      await new Promise(resolve => setTimeout(resolve, 50));
      const descriptionEl = el.querySelector('[slot="description"]');
      expect(descriptionEl).to.exist;
      expect(descriptionEl?.textContent).to.equal('Helper text');
      expect(el.input.ariaDescribedByElements).to.include(descriptionEl as HTMLElement);
    });

    it('should set description from slot', async () => {
      el = await fixture(html`
        <sl-checkbox>
          Option
          <span slot="description">Slotted description</span>
        </sl-checkbox>
      `);
      await el.updateComplete;

      expect(el.hasAttribute('has-description')).to.be.true;
      await new Promise(resolve => setTimeout(resolve, 50));
      const descriptionEl = el.querySelector('[slot="description"]');
      expect(descriptionEl).to.exist;
      expect(el.input.ariaDescribedByElements).to.include(descriptionEl as HTMLElement);
    });

    it('should prefer slotted description over property fallback', async () => {
      el = await fixture(html`
        <sl-checkbox description="Property fallback">
          Option
          <span slot="description"></span>
        </sl-checkbox>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const slottedEl = el.querySelector('span[slot="description"]');
      expect(el.hasAttribute('has-description')).to.be.false;
      expect(el.querySelector('[slot="description"]')?.textContent).to.equal('');
      expect(el.input.ariaDescribedByElements).to.include(slottedEl as HTMLElement);
    });

    it('should keep a tracked slotted description when property fallback changes', async () => {
      el = await fixture(html`
        <sl-checkbox description="Property fallback">
          Option
          <span slot="description">Slotted description</span>
        </sl-checkbox>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const slottedEl = el.querySelector('span[slot="description"]') as HTMLElement;
      el.description = 'Updated property fallback';
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const descriptions = Array.from(el.querySelectorAll('[slot="description"]'));
      expect(descriptions).to.deep.equal([slottedEl]);
      expect(el.input.ariaDescribedByElements).to.include(slottedEl);
      expect(slottedEl.textContent).to.equal('Slotted description');
    });

    it('should link all slotted description elements to the input', async () => {
      el = await fixture(html`
        <sl-checkbox>
          Option
          <span slot="description">First description</span>
          <span slot="description" aria-hidden="false">Second description</span>
        </sl-checkbox>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const descriptions = Array.from(el.querySelectorAll<HTMLElement>('[slot="description"]'));
      expect(descriptions).to.have.length(2);
      descriptions.forEach(description => {
        expect(description.getAttribute('aria-hidden')).to.equal('true');
        expect(el.input.ariaDescribedByElements).to.include(description);
      });

      descriptions[1].remove();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(descriptions[1].getAttribute('aria-hidden')).to.equal('false');
      expect(el.input.ariaDescribedByElements).to.include(descriptions[0]);
      expect(el.input.ariaDescribedByElements).not.to.include(descriptions[1]);
    });

    it('should update has-description attribute dynamically', async () => {
      el = await fixture(html`<sl-checkbox>Option</sl-checkbox>`);
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
        <sl-checkbox description="Property fallback">
          Option
          <span slot="description">Slotted description</span>
        </sl-checkbox>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const slottedEl = el.querySelector('span[slot="description"]');
      expect(slottedEl).to.exist;
      expect(slottedEl?.getAttribute('aria-hidden')).to.equal('true');
      expect(el.input.ariaDescribedByElements).to.include(slottedEl as HTMLElement);

      slottedEl?.remove();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(slottedEl?.hasAttribute('aria-hidden')).to.be.false;
      expect(el.hasAttribute('has-description')).to.be.true;
      const synthesizedEl = el.querySelector('[slot="description"]');
      expect(synthesizedEl).to.exist;
      expect(synthesizedEl?.textContent).to.equal('Property fallback');
      expect(el.input.ariaDescribedByElements).to.include(synthesizedEl as HTMLElement);
    });

    it('should preserve external ariaDescribedByElements when description is added', async () => {
      const external = document.createElement('div');
      external.id = 'external-desc';
      document.body.appendChild(external);

      el = await fixture(html`<sl-checkbox aria-describedby="external-desc">Option</sl-checkbox>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.input.ariaDescribedByElements).to.include(external);

      el.description = 'Added description';
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.input.ariaDescribedByElements).to.include(external);
      const descriptionEl = el.querySelector('[slot="description"]');
      expect(el.input.ariaDescribedByElements).to.include(descriptionEl as HTMLElement);

      external.remove();
    });

    it('should update has-description when slotted text mutates reactively', async () => {
      el = await fixture(html`
        <sl-checkbox>
          Option
          <span slot="description"></span>
        </sl-checkbox>
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
      el = await fixture(html`<sl-checkbox tooltip="Tooltip information">Option</sl-checkbox>`);
      await el.updateComplete;

      const tooltip = el.renderRoot.querySelector('sl-tooltip');
      expect(tooltip).to.exist;
      expect(tooltip?.getAttribute('for')).to.equal('wrapper');
      expect(tooltip?.getAttribute('type')).to.equal('description');
      expect(tooltip?.textContent?.trim()).to.equal('Tooltip information');
    });

    it('should link tooltip description to input via ariaDescribedByElements', async () => {
      el = await fixture(html`<sl-checkbox tooltip="Tooltip information">Option</sl-checkbox>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const tooltip = el.renderRoot.querySelector('sl-tooltip');
      expect(tooltip).to.exist;
      const tooltipDescription = el.querySelector<HTMLElement>('[slot="tooltip-description"]');
      expect(tooltipDescription).to.exist;
      expect(tooltipDescription?.textContent).to.equal('Tooltip information');
      expect(el.input.ariaDescribedByElements).to.include(tooltipDescription as HTMLElement);
    });

    it('should expose tooltip as the input description when inside a checkbox group', async () => {
      const group = await fixture<LitElement>(html`
        <sl-checkbox-group>
          <sl-checkbox tooltip="Tooltip for option 1" value="1">Option 1</sl-checkbox>
        </sl-checkbox-group>
      `);
      await group.updateComplete;
      el = group.querySelector('sl-checkbox')!;
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const tooltipDescription = el.querySelector<HTMLElement>('[slot="tooltip-description"]');
      expect(tooltipDescription).to.exist;
      expect(tooltipDescription?.hasAttribute('aria-hidden')).to.be.false;
      expect(el.input.ariaDescribedByElements).to.include(tooltipDescription as HTMLElement);
      expect(el.input.getAttribute('aria-describedby')).to.contain(tooltipDescription?.id);
      expect(getForwardedDescription(el)).to.equal('Tooltip for option 1');
    });

    it('should move description and tooltip references to a late-slotted input', async () => {
      el = await fixture(html`
        <sl-checkbox description="Helper text" tooltip="Tooltip information">Option</sl-checkbox>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const oldInput = el.input,
        input = document.createElement('input'),
        tooltipDescription = el.querySelector('[slot="tooltip-description"]') as HTMLElement,
        description = el.querySelector('[slot="description"]') as HTMLElement;
      input.slot = 'input';
      input.type = 'checkbox';
      el.append(input);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(oldInput.ariaDescribedByElements ?? []).not.to.include(description);
      expect(oldInput.ariaDescribedByElements ?? []).not.to.include(tooltipDescription);
      expect(oldInput.isConnected).to.be.false;
      expect(el.input).to.equal(input);
      expect(el.input.ariaDescribedByElements).to.include(description);
      expect(el.input.ariaDescribedByElements).to.include(tooltipDescription);
      expect(el.querySelector('label')?.htmlFor).to.equal(input.id);
    });

    it('should move forwarded ARIA state to a late-slotted input', async () => {
      const label = document.createElement('span');
      label.id = 'late-input-label';
      label.textContent = 'Forwarded label';

      el = await fixture(html`<sl-checkbox>Option</sl-checkbox>`);
      el.insertAdjacentElement('afterend', label);
      el.setAttribute('aria-label', 'Forwarded aria label');
      el.setAttribute('aria-disabled', 'true');
      el.setAttribute('aria-labelledby', 'late-input-label');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const fallbackInput = el.input,
        input = document.createElement('input');
      input.slot = 'input';
      input.type = 'checkbox';
      el.append(input);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(fallbackInput.ariaLabel).to.be.null;
      expect(fallbackInput.ariaDisabled).to.be.null;
      expect(fallbackInput.ariaLabelledByElements ?? []).not.to.include(label);
      expect(el.input).to.equal(input);
      expect(el.input.ariaLabel).to.equal('Forwarded aria label');
      expect(el.input.ariaDisabled).to.equal('true');
      expect(el.input.ariaLabelledByElements).to.include(label);

      label.remove();
    });

    it('should prefer a custom input inserted before the owned fallback input', async () => {
      el = await fixture(html`<sl-checkbox description="Helper text">Option</sl-checkbox>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const fallbackInput = el.input,
        input = document.createElement('input'),
        description = el.querySelector('[slot="description"]') as HTMLElement;
      input.slot = 'input';
      input.type = 'checkbox';
      el.insertBefore(input, fallbackInput);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(fallbackInput.isConnected).to.be.false;
      expect(el.input).to.equal(input);
      expect(el.input.ariaDescribedByElements).to.include(description);
      expect(el.querySelector('label')?.htmlFor).to.equal(input.id);
    });

    it('should restore an owned fallback input when a custom input is removed', async () => {
      el = await fixture(html`<sl-checkbox description="Helper text">Option</sl-checkbox>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      el.name = 'terms';
      el.value = 'accepted';
      el.setCustomValidity('Required custom message');
      await el.updateComplete;

      const firstInput = el.input,
        input = document.createElement('input'),
        description = el.querySelector('[slot="description"]') as HTMLElement;
      input.slot = 'input';
      input.type = 'checkbox';
      el.append(input);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(firstInput.isConnected).to.be.false;
      expect(el.input).to.equal(input);

      input.remove();
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.input).not.to.equal(input);
      expect(el.input.isConnected).to.be.true;
      expect(el.input.type).to.equal('checkbox');
      expect(el.input.name).to.equal('terms');
      expect(el.input.value).to.equal('accepted');
      expect(el.input.validationMessage).to.equal('Required custom message');
      expect(el.input.ariaDescribedByElements).to.include(description);
      expect(el.querySelector('label')?.htmlFor).to.equal(el.input.id);
    });

    it('should keep tooltip description when reconnected with unchanged tooltip', async () => {
      el = await fixture(html`<sl-checkbox tooltip="Tooltip information">Option</sl-checkbox>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const parent = el.parentElement!,
        tooltipDescription = el.querySelector('[slot="tooltip-description"]') as HTMLElement;
      expect(el.input.ariaDescribedByElements).to.include(tooltipDescription);

      el.remove();
      parent.append(el);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(tooltipDescription.isConnected).to.be.true;
      expect(el.input.ariaDescribedByElements).to.include(tooltipDescription);
    });

    it('should merge externally forwarded ariaDescribedByElements with owned descriptions', async () => {
      el = await fixture(html`
        <sl-checkbox description="Helper text" tooltip="Tooltip information">Option</sl-checkbox>
      `);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const external = document.createElement('span'),
        description = el.querySelector('[slot="description"]') as HTMLElement,
        tooltipDescription = el.querySelector('[slot="tooltip-description"]') as HTMLElement;
      external.textContent = 'External description';
      el.insertAdjacentElement('afterend', external);

      el.ariaDescribedByElements = [external];
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.input.ariaDescribedByElements).to.include(external);
      expect(el.input.ariaDescribedByElements).to.include(description);
      expect(el.input.ariaDescribedByElements).to.include(tooltipDescription);

      el.disabled = true;
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.input.ariaDescribedByElements).to.include(external);
      expect(el.input.ariaDescribedByElements).to.include(description);
      expect(el.input.ariaDescribedByElements).to.include(tooltipDescription);

      external.remove();
    });

    it('should not restore an external input reference removed by the consumer', async () => {
      el = await fixture(html`<sl-checkbox description="Helper text">Option</sl-checkbox>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const external = document.createElement('span'),
        description = el.querySelector('[slot="description"]') as HTMLElement;
      external.textContent = 'External description';
      el.insertAdjacentElement('afterend', external);
      el.input.ariaDescribedByElements = [...(el.input.ariaDescribedByElements ?? []), external];
      expect(el.input.ariaDescribedByElements).to.include(external);

      el.input.ariaDescribedByElements = (el.input.ariaDescribedByElements ?? []).filter(
        item => item !== external
      );
      el.tooltip = 'Tooltip information';
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.input.ariaDescribedByElements ?? []).not.to.include(external);
      expect(el.input.ariaDescribedByElements).to.include(description);

      external.remove();
    });

    it('should not restore an aria-describedby attribute removed before forwarding runs', async () => {
      const external = document.createElement('span');
      external.id = 'removed-description';
      external.textContent = 'Removed description';
      document.body.append(external);

      el = document.createElement('sl-checkbox');
      el.description = 'Helper text';
      el.textContent = 'Option';
      el.setAttribute('aria-describedby', 'removed-description');
      el.removeAttribute('aria-describedby');
      document.body.append(el);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      const description = el.querySelector('[slot="description"]') as HTMLElement;
      expect(el.input.ariaDescribedByElements).to.include(description);
      expect(el.input.ariaDescribedByElements ?? []).not.to.include(external);

      external.remove();
    });
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox>Hello world</sl-checkbox>`);
      input = el.querySelector('input')!;
    });

    it('should have an input of type checkbox', () => {
      expect(input).to.exist;
      expect(input.id).to.match(/sl-checkbox-(\d+)/);
      expect(input.type).to.equal('checkbox');
    });

    it('should not be checked', () => {
      expect(el.checked).not.to.be.true;
      expect(input.checked).not.to.be.true;
      expect(input).not.to.match(':checked');
      expect(input.checked).to.be.false;
    });

    it('should be checked when set', async () => {
      el.checked = true;
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(input).to.match(':checked');
      expect(input.checked).to.be.true;
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

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.disabled).to.be.true;
    });

    it('should not be indeterminate', () => {
      expect(el).not.to.have.attribute('indeterminate');
      expect(el.indeterminate).not.to.be.true;
      expect(input).not.to.match(':indeterminate');
      expect(input.indeterminate).to.be.false;
    });

    it('should be indeterminate when set', async () => {
      el.indeterminate = true;
      await el.updateComplete;

      expect(el).to.have.attribute('indeterminate');
      expect(input).to.match(':indeterminate');
      expect(input.indeterminate).to.be.true;
    });

    it('should not be required', () => {
      expect(el).not.to.have.attribute('required');
      expect(el.required).not.to.be.true;
      expect(input).not.to.have.attribute('required');
      expect(input.required).not.to.be.true;
    });

    it('should be required when set', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el).to.have.attribute('required');
      expect(input).to.have.attribute('required');
      expect(input.required).to.be.true;
    });

    it('should link the text to the input via label', () => {
      const label = el.querySelector('label');

      expect(label).to.exist;
      expect(label).to.have.text('Hello world');
      expect(label).to.have.attribute('for', input.id);
    });

    it('should proxy the aria-disabled attribute to the input element', async () => {
      el.setAttribute('aria-disabled', 'true');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-disabled');
      expect(el.input).to.have.attribute('aria-disabled', 'true');
    });

    it('should proxy the aria-label attribute to the input element', async () => {
      el.setAttribute('aria-label', 'Label');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-label');
      expect(el.input).to.have.attribute('aria-label', 'Label');
    });

    it('should proxy the aria-labelledby attribute to ariaLabelledByElements on the input', async () => {
      const label = document.createElement('span');
      label.id = 'my-label';
      label.textContent = 'My label';
      el.insertAdjacentElement('afterend', label);
      el.setAttribute('aria-labelledby', 'my-label');

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-labelledby');
      expect(getForwardedAriaProperty(el, 'ariaLabelledByElements')).to.deep.equal([label]);
      expect(getForwardedAccessibleName(el)).to.equal('My label');

      label.remove();
    });

    it('should proxy the aria-describedby attribute to ariaDescribedByElements on the input', async () => {
      const description = document.createElement('span');
      description.id = 'my-description';
      description.textContent = 'My description';
      el.insertAdjacentElement('afterend', description);
      el.setAttribute('aria-describedby', 'my-description');

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-describedby');
      expect(getForwardedAriaProperty(el, 'ariaDescribedByElements')).to.deep.equal([description]);

      description.remove();
    });

    it('should link the label to the input again after labelling references are removed', async () => {
      const tooltip = document.createElement('span');
      tooltip.textContent = 'Tooltip';
      el.insertAdjacentElement('afterend', tooltip);

      // An sl-tooltip labels its anchor this way, and removes the reference when it changes
      // type or is removed; that leaves an empty aria-labelledby attribute behind.
      el.ariaLabelledByElements = [tooltip];
      el.ariaLabelledByElements = [];
      expect(el.input).to.have.attribute('aria-labelledby', '');

      // Re-run the label linking, the way a slotchange does
      el.append(document.createTextNode(' '));
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.input).to.have.attribute('aria-labelledby', el.querySelector('label')!.id);
      expect(getForwardedAccessibleName(el)).to.equal('Hello world');

      tooltip.remove();
    });

    it('should proxy ariaLabelledByElements to the input element', async () => {
      // This is how an sl-tooltip labels its anchor
      const tooltip = document.createElement('span');
      tooltip.textContent = 'Tooltip';
      el.insertAdjacentElement('afterend', tooltip);

      el.ariaLabelledByElements = [tooltip];
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el.input.ariaLabelledByElements).to.deep.equal([tooltip]);
      expect(getForwardedAccessibleName(el)).to.equal('Tooltip');

      tooltip.remove();
    });

    it('should keep the label linked to the input after toggling checked', async () => {
      // An sl-tooltip with type="description" assigns an empty array while cleaning up a
      // labelling relation it never added. Syncing the input must not replay that.
      el.ariaLabelledByElements = [];

      // Re-run the label linking, the way a slotchange does
      el.append(document.createTextNode(' '));
      await new Promise(resolve => setTimeout(resolve, 50));

      const labelId = el.querySelector('label')!.id;
      expect(el.input).to.have.attribute('aria-labelledby', labelId);

      el.checked = true;
      await el.updateComplete;

      expect(el.input).to.have.attribute('aria-labelledby', labelId);
      expect(getForwardedAccessibleName(el)).to.equal('Hello world');
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after clicking the checkbox', () => {
      el.click();

      expect(el.dirty).to.be.true;
    });

    it('should emit an sl-update-state event after clicking the checkbox', () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.click();

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should be touched after losing focus', async () => {
      el.focus();
      el.blur();

      await new Promise(resolve => setTimeout(resolve));

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after losing focus', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.focus();
      el.blur();

      await new Promise(resolve => setTimeout(resolve));

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should toggle the state to checked when clicking the element', async () => {
      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(input).to.match(':checked');
      expect(input.checked).to.be.true;

      el.click();
      await el.updateComplete;

      expect(el).not.to.have.attribute('checked');
      expect(el.checked).to.be.false;
      expect(input).not.to.match(':checked');
      expect(input.checked).to.be.false;
    });

    it('should change the state to checked on when pressing enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(input).to.match(':checked');
      expect(input.checked).to.be.true;
    });

    it('should change the state to checked on when pressing space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;

      expect(el).to.have.attribute('checked');
      expect(el.checked).to.be.true;
      expect(input).to.match(':checked');
      expect(input.checked).to.be.true;
    });

    it('should emit an sl-change event when clicking an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when pressing the space key on an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.focus();
      await userEvent.keyboard('{Space}');

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when pressing the enter key on an option', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(onChange).to.have.been.calledOnce;
    });

    it('should emit an sl-focus event when focusing the group', async () => {
      const onFocus = spy();

      el.addEventListener('sl-focus', onFocus);
      el.focus();
      await new Promise(resolve => setTimeout(resolve));

      expect(onFocus).to.have.been.calledOnce;
    });

    it('should emit an sl-blur event when blurring the group', () => {
      const onBlur = spy();

      el.addEventListener('sl-blur', onBlur);
      el.focus();
      el.blur();

      expect(onBlur).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event when calling reportValidity', () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.reportValidity();

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should emit an sl-validate event after click', async () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onValidate).to.have.been.calledOnce;
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox disabled>Hello world</sl-checkbox>`);
      input = el.querySelector('input')!;
    });

    it('should be marked as disabled', () => {
      expect(el.disabled).to.be.true;
      expect(input.disabled).to.be.true;
      expect(input).to.have.attribute('disabled');
    });

    it('should not change the state to checked when clicked', async () => {
      el.click();
      await el.updateComplete;

      expect(el.checked).not.to.be.true;
      expect(input.checked).not.to.be.true;
    });

    it('should not change the state to checked on enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');
      await new Promise(resolve => setTimeout(resolve));

      expect(el.checked).not.to.be.true;
      expect(input.checked).not.to.be.true;
    });

    it('should not change the state to checked on space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');
      await new Promise(resolve => setTimeout(resolve));

      expect(el.checked).not.to.be.true;
      expect(input.checked).not.to.be.true;
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-checkbox>Hello world</sl-checkbox>`);
    });

    it('should be invalid when required and no option is selected', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validity.valueMissing).to.be.true;
    });

    it('should have no validation message when valid', () => {
      expect(el.validationMessage).to.equal('');
    });

    it('should be valid when checked and required', async () => {
      el.required = true;
      await el.updateComplete;

      expect(el.valid).to.be.false;

      el.click();
      await el.updateComplete;

      expect(el.valid).to.be.true;
    });

    it('should not have a show-validity attribute when reported', async () => {
      el.reportValidity();
      await el.updateComplete;

      expect(el).not.to.have.attribute('show-validity');
    });

    it('should have an invalid show-validity attribute when required and reported', async () => {
      el.required = true;
      await el.updateComplete;

      el.reportValidity();
      await el.updateComplete;

      expect(el).to.have.attribute('show-validity', 'invalid');
    });

    it('should emit an update-validity event when reported', async () => {
      const onUpdateValidity = spy();

      el.addEventListener('sl-update-validity', onUpdateValidity);
      el.reportValidity();
      await el.updateComplete;

      expect(onUpdateValidity).to.have.been.calledOnce;
    });

    it('should have a validation message when unchecked and required', async () => {
      el.required = true;
      await el.updateComplete;

      // Check the localized validation message, since the native one can change
      expect(el.getLocalizedValidationMessage()).to.equal('Please check this box.');
    });

    it('should have a custom validation message when it has a custom-validity attribute', async () => {
      el.setAttribute('custom-validity', 'Custom validation message');
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should have a custom validation message after calling setCustomValidity', async () => {
      el.setCustomValidity('Custom validation message');
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should have a custom validation message when calling setCustomValidity on validate', async () => {
      el.addEventListener('sl-validate', () => el.setCustomValidity('Custom validation message'));

      el.required = true;
      await el.updateComplete;

      el.click();
      await el.updateComplete;

      expect(el.validationMessage).to.equal('Custom validation message');
    });
  });

  describe('form integration', () => {
    let el: FormIntegrationTestComponent;

    class FormIntegrationTestComponent extends LitElement {
      onFormControl: (event: SlFormControlEvent) => void = spy();

      override render(): TemplateResult {
        return html`
          <sl-form-field label="Label">
            <sl-checkbox @sl-form-control=${this.onFormControl}>Checkbox</sl-checkbox>
          </sl-form-field>
        `;
      }
    }

    beforeEach(async () => {
      try {
        customElements.define('form-integration-test-component', FormIntegrationTestComponent);
      } catch {
        // empty
      }

      el = await fixture(html`<form-integration-test-component></form-integration-test-component>`);
    });

    it('should emit an sl-form-control event after first render', () => {
      expect(el.onFormControl).to.have.been.calledOnce;
    });

    it('should focus the input when the label is clicked', async () => {
      const input = el.renderRoot.querySelector('input'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(el.shadowRoot!.activeElement).to.equal(input);
    });

    it('should toggle the checkbox when the label is clicked', async () => {
      const checkbox = el.renderRoot.querySelector('sl-checkbox'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(checkbox).to.have.attribute('checked');
      expect(checkbox?.checked).to.be.true;
    });
  });
});
