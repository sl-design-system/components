import { type SlFormControlEvent } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/infotip/register.js';
import { Tooltip } from '@sl-design-system/tooltip';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Switch } from './switch.js';

/** Returns the horizontal center of the given element. */
const center = (el: Element): number => {
  const { left, right } = el.getBoundingClientRect();

  return (left + right) / 2;
};

describe('sl-switch', () => {
  let el: Switch, input: HTMLInputElement;

  it('should ignore non-infotip elements assigned to the infotip slot', async () => {
    el = await fixture(html`
      <sl-switch>
        Label
        <span slot="infotip">Not an infotip</span>
      </sl-switch>
    `);

    await el.updateComplete;

    expect(el.infotip).to.be.undefined;
  });

  it('should set an infotip describe label based on the switch label', async () => {
    el = await fixture(html`
      <sl-switch>
        Label
        <sl-infotip slot="infotip">More info</sl-infotip>
      </sl-switch>
    `);

    await el.updateComplete;

    expect(el.infotip?.size).to.equal('sm');
    expect(el.infotip?.describes).to.equal('Label');
  });

  it('should not toggle when clicking the infotip', async () => {
    el = await fixture(html`
      <sl-switch>
        Label
        <sl-infotip slot="infotip">More info</sl-infotip>
      </sl-switch>
    `);

    el.querySelector<HTMLElement>('sl-infotip')?.click();
    await el.updateComplete;

    expect(el.checked).not.to.be.true;
  });

  it('should toggle when clicking the label', async () => {
    el = await fixture(html`<sl-switch>Label</sl-switch>`);

    await userEvent.click(el.renderRoot.querySelector('[part="label"]')!);
    await el.updateComplete;

    expect(el.checked).to.be.true;
  });

  it('should not render an input element in the light DOM', async () => {
    el = await fixture(html`<sl-switch>Label</sl-switch>`);

    expect(el.querySelector('input')).to.be.null;
    expect(el.renderRoot.querySelector('input')).to.exist;
  });

  it('should be the form control element itself', async () => {
    el = await fixture(html`<sl-switch>Label</sl-switch>`);

    expect(el.formControlElement).to.equal(el);
  });

  it('should stop listening when disconnected', async () => {
    el = await fixture(html`<sl-switch>Label</sl-switch>`);

    const onFocus = spy();
    el.addEventListener('sl-focus', onFocus);

    const parent = el.parentElement!;
    el.remove();

    el.dispatchEvent(new Event('focusin'));

    expect(onFocus).not.to.have.been.called;

    // Reconnecting should start listening again
    parent.append(el);
    await el.updateComplete;

    el.dispatchEvent(new Event('focusin'));

    expect(onFocus).to.have.been.calledOnce;
  });

  it('should label the input with the slotted text', async () => {
    el = await fixture(html`<sl-switch>Label</sl-switch>`);
    await el.updateComplete;

    const label = el.renderRoot.querySelector<HTMLElement>('#label');

    expect(el).to.match(':state(has-label)');
    expect(el.renderRoot.querySelector('input')).to.have.attribute('aria-labelledby', 'label');
    expect(label).to.exist;
    expect(label!.querySelector('slot')!.assignedNodes()[0].textContent).to.contain('Label');
  });

  describe('description', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-switch>
          Label
          <span slot="description">Description</span>
        </sl-switch>
      `);

      await el.updateComplete;

      input = el.renderRoot.querySelector('input')!;
    });

    it('should have the has-description state', () => {
      expect(el).to.match(':state(has-description)');
    });

    it('should describe the input with the description', () => {
      expect(input).to.have.attribute('aria-describedby', 'description');
    });

    it('should render the description below the label', () => {
      const label = el.renderRoot.querySelector('[part="label"]')!.getBoundingClientRect(),
        description = el.renderRoot.querySelector('[part="description"]')!.getBoundingClientRect();

      expect(description.top).to.be.at.least(label.bottom);
    });

    it('should indent the description to the same level as the label', () => {
      const label = el.renderRoot.querySelector('[part="label"]')!.getBoundingClientRect(),
        description = el.renderRoot.querySelector('[part="description"]')!.getBoundingClientRect();

      expect(description.left).to.equal(label.left);
    });

    it('should indent the description to the same level as the label when reversed', async () => {
      el.reverse = true;
      await el.updateComplete;

      const label = el.renderRoot.querySelector('[part="label"]')!.getBoundingClientRect(),
        description = el.renderRoot.querySelector('[part="description"]')!.getBoundingClientRect();

      expect(description.left).to.equal(label.left);
    });

    it('should not describe the input when there is no description', async () => {
      const withoutDescription = await fixture<Switch>(html`<sl-switch>Label</sl-switch>`);
      await withoutDescription.updateComplete;

      expect(withoutDescription).not.to.match(':state(has-description)');
      expect(withoutDescription.renderRoot.querySelector('input')).not.to.have.attribute(
        'aria-describedby'
      );
    });
  });

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch aria-label="Test switch"></sl-switch>`);
      input = el.renderRoot.querySelector('input')!;
    });

    it('should not be checked', () => {
      expect(el.checked).not.to.be.true;
      expect(el).not.to.match(':state(checked)');
      expect(input).to.have.attribute('aria-checked', 'false');
      expect(input).not.to.match(':checked');
    });

    it('should be checked when set', async () => {
      el.checked = true;
      await el.updateComplete;

      expect(el).to.match(':state(checked)');
      expect(input).to.have.attribute('aria-checked', 'true');
      expect(input).to.match(':checked');
    });

    it('should not be disabled', () => {
      expect(el.disabled).not.to.be.true;
      expect(input).not.to.match(':disabled');
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(input).to.match(':disabled');
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

    it('should not have an icon when size is sm', async () => {
      el.size = 'sm';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-icon')).to.be.null;
    });

    it('should have an icon when size is md or lg', async () => {
      expect(el.renderRoot.querySelector('sl-icon')).to.exist;

      el.size = 'lg';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-icon')).to.exist;
    });

    it('should have a checkbox input with role switch', () => {
      expect(input).to.exist;
      expect(input).to.have.attribute('role', 'switch');
      expect(input.type).to.equal('checkbox');
    });

    it('should not reference the label element when there is no slotted text', () => {
      expect(el).not.to.match(':state(has-label)');
      expect(input).not.to.have.attribute('aria-labelledby');
    });

    it('should reference the label element once text is slotted', async () => {
      el.append(document.createTextNode('Label'));
      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      expect(el).to.match(':state(has-label)');
      expect(input).to.have.attribute('aria-labelledby', 'label');
    });

    it('should forward the aria-disabled attribute to the input element', async () => {
      el.setAttribute('aria-disabled', 'true');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-disabled');
      expect(input).to.have.attribute('aria-disabled', 'true');
    });

    it('should forward the aria-label attribute to the input element', async () => {
      el.setAttribute('aria-label', 'Label');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-label');
      expect(input).to.have.attribute('aria-label', 'Label');
    });

    it('should forward the aria-labelledby attribute to the input element', async () => {
      const label = document.createElement('span');
      label.id = 'switch-label';
      el.parentElement!.prepend(label);

      el.setAttribute('aria-labelledby', 'switch-label');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-labelledby');
      expect(input.ariaLabelledByElements).to.include(label);

      label.remove();
    });

    it('should not toggle when aria-disabled is set', async () => {
      el.setAttribute('aria-disabled', 'true');
      await new Promise(resolve => setTimeout(resolve, 50));

      el.toggle();
      await el.updateComplete;

      expect(el.checked).not.to.be.true;
    });

    it('should not toggle on Space when aria-disabled is set', async () => {
      el.setAttribute('aria-disabled', 'true');
      await new Promise(resolve => setTimeout(resolve, 50));

      el.focus();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;

      expect(el.checked).not.to.be.true;
      expect(input).not.to.match(':checked');
    });

    it('should still be focusable when aria-disabled is set', async () => {
      el.setAttribute('aria-disabled', 'true');
      await new Promise(resolve => setTimeout(resolve, 50));

      el.focus();

      expect(el.shadowRoot!.activeElement).to.equal(input);
    });

    it('should be pristine', () => {
      expect(el.dirty).not.to.be.true;
    });

    it('should be dirty after toggling', () => {
      el.toggle();

      expect(el.dirty).to.be.true;
    });

    it('should emit an sl-update-state event after toggling', () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.toggle();

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should be untouched', () => {
      expect(el.touched).not.to.be.true;
    });

    it('should be touched after losing focus', () => {
      el.focus();
      el.blur();

      expect(el.touched).to.be.true;
    });

    it('should emit an sl-update-state event after losing focus', async () => {
      const onUpdateState = spy();

      el.addEventListener('sl-update-state', onUpdateState);
      el.focus();
      el.blur();

      await el.updateComplete;

      expect(onUpdateState).to.have.been.calledOnce;
    });

    it('should emit an sl-change event when toggling', async () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.toggle();
      await el.updateComplete;

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
      await el.updateComplete;

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

    it('should emit an sl-validate event when toggling', async () => {
      const onValidate = spy();

      el.addEventListener('sl-validate', onValidate);
      el.toggle();
      await el.updateComplete;

      expect(onValidate).to.have.been.calledOnce;
    });

    it('should have a blank validation message', () => {
      expect(el.validationMessage).to.equal('');
    });

    it('should have a validation message after custom validation', () => {
      el.addEventListener('sl-validate', () => el.setCustomValidity('Custom validation message'));
      el.toggle();

      expect(el.validationMessage).to.equal('Custom validation message');
    });

    it('should toggle the state when calling toggle()', async () => {
      el.toggle();
      await el.updateComplete;

      expect(el.checked).to.equal(true);
      expect(input).to.have.attribute('aria-checked', 'true');
      expect(input).to.match(':checked');

      el.toggle();
      await el.updateComplete;

      expect(el.checked).to.equal(false);
      expect(input).to.have.attribute('aria-checked', 'false');
      expect(input).not.to.match(':checked');
    });

    it('should set a specific state when calling toggle() with a force argument', async () => {
      el.toggle(true);
      await el.updateComplete;

      expect(el.checked).to.equal(true);
      expect(input).to.match(':checked');

      el.toggle(true);
      await el.updateComplete;

      expect(el.checked).to.equal(true);
      expect(input).to.match(':checked');

      el.toggle(false);
      await el.updateComplete;

      expect(el.checked).to.equal(false);
      expect(input).not.to.match(':checked');
    });

    it('should not emit an sl-change event when toggle() does not change the state', () => {
      const onChange = spy();

      el.addEventListener('sl-change', onChange);
      el.toggle(false);

      expect(onChange).not.to.have.been.called;
    });

    it('should toggle the state when clicking the toggle', async () => {
      el.renderRoot.querySelector<HTMLElement>('[part="toggle"]')?.click();
      await el.updateComplete;

      expect(el.checked).to.equal(true);
      expect(input).to.have.attribute('aria-checked', 'true');
      expect(input).to.match(':checked');
    });

    it('should toggle the state on Enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(el.checked).to.equal(true);
      expect(input).to.have.attribute('aria-checked', 'true');
      expect(input).to.match(':checked');

      await userEvent.keyboard('{Enter}');

      expect(el.checked).to.equal(false);
      expect(input).to.have.attribute('aria-checked', 'false');
      expect(input).not.to.match(':checked');
    });

    it('should toggle the state on Space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');

      expect(el.checked).to.equal(true);
      expect(input).to.have.attribute('aria-checked', 'true');
      expect(input).to.match(':checked');

      await userEvent.keyboard('{Space}');

      expect(el.checked).to.equal(false);
      expect(input).to.have.attribute('aria-checked', 'false');
      expect(input).not.to.match(':checked');
    });

    it('should support custom icons', async () => {
      el.iconOn = 'sun';
      el.iconOff = 'moon';
      await el.updateComplete;

      const icon = el.renderRoot.querySelector<Icon>('sl-icon');

      expect(icon?.name).to.equal('moon');

      el.toggle();
      await el.updateComplete;

      expect(icon?.name).to.equal('sun');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch aria-label="Test switch" disabled></sl-switch>`);
      await el.updateComplete;

      input = el.renderRoot.querySelector('input')!;
    });

    it('should have an attribute', () => {
      expect(el).to.have.attribute('disabled');
    });

    it('should disable the input element', () => {
      expect(input).to.have.attribute('disabled');
    });

    it('should not change the state when toggled', () => {
      el.toggle();

      expect(el.checked).not.to.equal(true);
      expect(input).to.have.attribute('aria-checked', 'false');
      expect(input).not.to.match(':checked');
    });

    it('should not change the state on Enter', async () => {
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(el.checked).not.to.equal(true);
      expect(input).to.have.attribute('aria-checked', 'false');
      expect(input).not.to.match(':checked');
    });

    it('should not change the state on Space', async () => {
      el.focus();
      await userEvent.keyboard('{Space}');

      expect(el.checked).not.to.equal(true);
      expect(input).to.have.attribute('aria-checked', 'false');
      expect(input).not.to.match(':checked');
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch aria-label="Test switch" checked></sl-switch>`);
      await el.updateComplete;

      input = el.renderRoot.querySelector('input')!;
    });

    it('should be on when the property is set', () => {
      expect(el.checked).to.equal(true);
      expect(el).to.match(':state(checked)');
      expect(input).to.have.attribute('aria-checked', 'true');
      expect(input).to.match(':checked');
    });
  });

  describe('tooltip', () => {
    let tooltip: Tooltip;

    const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    beforeEach(async () => {
      // The switch is given a fixed width away from the viewport edges, so the tooltip has room
      // to center itself on whichever part of the switch it is anchored to.
      const wrapper = await fixture<HTMLElement>(html`
        <div style="margin: 100px auto; width: 300px">
          <sl-switch tooltip="More information">Label</sl-switch>
        </div>
      `);

      el = wrapper.querySelector('sl-switch')!;
      await el.updateComplete;

      input = el.renderRoot.querySelector('input')!;
      tooltip = el.renderRoot.querySelector('sl-tooltip')!;
      await tooltip.updateComplete;
    });

    it('should not have a tooltip by default', async () => {
      const withoutTooltip = await fixture<Switch>(html`<sl-switch>Label</sl-switch>`);
      await withoutTooltip.updateComplete;

      expect(withoutTooltip.renderRoot.querySelector('sl-tooltip')).to.be.null;
    });

    it('should render an sl-tooltip with a tooltip part when the property is set', () => {
      expect(tooltip).to.exist;
      expect(el.renderRoot.querySelector('[part="tooltip"]')).to.equal(tooltip);
      expect(tooltip).to.have.trimmed.text('More information');
    });

    it('should remove the tooltip when the property is unset', async () => {
      el.tooltip = undefined;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-tooltip')).to.be.null;
    });

    it('should describe the input when the switch has a label', () => {
      expect(tooltip.type).to.equal('description');
      expect(input.ariaDescribedByElements).to.include(tooltip);
      expect(input.ariaLabelledByElements ?? []).not.to.include(tooltip);
    });

    it('should describe the input alongside the description', async () => {
      const withDescription = await fixture<Switch>(html`
        <sl-switch tooltip="More information">
          Label
          <span slot="description">Description</span>
        </sl-switch>
      `);
      await withDescription.updateComplete;

      const describedBy =
        withDescription.renderRoot.querySelector('input')!.ariaDescribedByElements;

      expect(describedBy).to.include(withDescription.renderRoot.querySelector('sl-tooltip'));
      expect(describedBy).to.include(
        withDescription.renderRoot.querySelector('[part="description"]')
      );
    });

    it('should label the input when the switch has no label', async () => {
      const withoutLabel = await fixture<Switch>(
        html`<sl-switch tooltip="Toggle dark mode"></sl-switch>`
      );
      await withoutLabel.updateComplete;

      const tooltipEl = withoutLabel.renderRoot.querySelector('sl-tooltip')!;
      await tooltipEl.updateComplete;

      const inputEl = withoutLabel.renderRoot.querySelector('input')!;

      expect(tooltipEl.type).to.equal('label');
      expect(inputEl.ariaLabelledByElements).to.include(tooltipEl);
      expect(inputEl.ariaDescribedByElements ?? []).not.to.include(tooltipEl);
    });

    it('should center the tooltip on the entire switch when hovering', async () => {
      el.renderRoot
        .querySelector('[part="track"]')!
        .dispatchEvent(new Event('mouseover', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 50);

      const container = el.renderRoot.querySelector('[part="container"]')!;

      expect(tooltip).to.match(':popover-open');
      expect(tooltip.anchor).to.equal(container);
      expect(center(tooltip)).to.be.closeTo(center(container), 1);
    });

    it('should center the tooltip on the toggle when it has focus', async () => {
      await userEvent.tab();
      await waitFor(50);

      const toggle = el.renderRoot.querySelector('[part="toggle"]')!;

      expect(el.shadowRoot!.activeElement).to.equal(input);
      expect(tooltip).to.match(':popover-open');
      expect(tooltip.anchor).to.equal(toggle);
      expect(center(tooltip)).to.be.closeTo(center(toggle), 1);
    });

    it('should show the tooltip when hovering a disabled switch', async () => {
      const disabled = await fixture<Switch>(
        html`<sl-switch disabled tooltip="Ask your teacher to unlock this">Label</sl-switch>`
      );
      await disabled.updateComplete;

      const tooltipEl = disabled.renderRoot.querySelector('sl-tooltip')!;
      await tooltipEl.updateComplete;

      disabled.renderRoot
        .querySelector('[part="track"]')!
        .dispatchEvent(new Event('mouseover', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 50);

      expect(tooltipEl).to.match(':popover-open');
    });

    it('should position the tooltip of each switch against its own switch', async () => {
      const wrapper = await fixture<HTMLElement>(html`
        <div style="display: grid; gap: 200px; grid-template-columns: 1fr 1fr; margin: 100px">
          <sl-switch tooltip="First">First</sl-switch>
          <sl-switch tooltip="Second">Second</sl-switch>
        </div>
      `);

      const [first, second] = Array.from(wrapper.querySelectorAll<Switch>('sl-switch'));
      await Promise.all([first.updateComplete, second.updateComplete]);

      const secondTooltip = second.renderRoot.querySelector('sl-tooltip')!;
      await secondTooltip.updateComplete;

      second.renderRoot
        .querySelector('[part="track"]')!
        .dispatchEvent(new Event('mouseover', { bubbles: true }));
      await waitFor(Tooltip.hoverShowDelay + 50);

      const secondContainer = second.renderRoot.querySelector('[part="container"]')!;

      expect(secondTooltip).to.match(':popover-open');
      expect(center(secondTooltip)).to.be.closeTo(center(secondContainer), 1);
    });
  });

  describe('form reset', () => {
    let form: HTMLFormElement;

    describe('unchecked', () => {
      beforeEach(async () => {
        form = await fixture(html`
          <form>
            <sl-switch aria-label="Test switch"></sl-switch>
          </form>
        `);

        el = form.firstElementChild as Switch;

        input = el.renderRoot.querySelector('input')!;
      });

      it('should revert back to the initial state', async () => {
        el.toggle();

        await el.updateComplete;

        expect(el.checked).to.equal(true);
        expect(input).to.have.attribute('aria-checked', 'true');
        expect(input).to.match(':checked');
        expect(input).to.match(':checked');

        form.reset();

        await el.updateComplete;

        expect(el.checked).to.equal(false);
        expect(input).to.have.attribute('aria-checked', 'false');
        expect(input).not.to.match(':checked');
        expect(input).not.to.match(':checked');
      });

      it('should emit an sl-change event', async () => {
        const onChange = spy();

        el.toggle();
        await el.updateComplete;

        el.addEventListener('sl-change', onChange);
        form.reset();

        expect(onChange).to.have.been.calledOnce;
      });
    });

    describe('checked', () => {
      beforeEach(async () => {
        form = await fixture(html`
          <form>
            <sl-switch aria-label="Test switch" checked></sl-switch>
          </form>
        `);

        el = form.firstElementChild as Switch;

        input = el.renderRoot.querySelector('input')!;
      });

      it('should revert back to the initial states', async () => {
        el.toggle();

        await el.updateComplete;

        expect(el.checked).to.equal(false);
        expect(input).to.have.attribute('aria-checked', 'false');
        expect(input).not.to.match(':checked');
        expect(input).not.to.match(':checked');

        form.reset();

        await el.updateComplete;

        expect(el.checked).to.equal(true);
        expect(input).to.have.attribute('aria-checked', 'true');
        expect(input).to.match(':checked');
        expect(input).to.match(':checked');
      });

      it('should emit an sl-change event', async () => {
        const onChange = spy();

        el.toggle();
        await el.updateComplete;

        el.addEventListener('sl-change', onChange);
        form.reset();

        expect(onChange).to.have.been.calledOnce;
      });
    });
  });

  describe('form integration', () => {
    let el: FormIntegrationTestComponent;

    class FormIntegrationTestComponent extends LitElement {
      onFormControl: (event: SlFormControlEvent) => void = spy();

      override render(): TemplateResult {
        return html`
          <sl-form-field label="Label">
            <sl-switch @sl-form-control=${this.onFormControl}></sl-switch>
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

    it('should focus the switch when the label is clicked', async () => {
      const control = el.renderRoot.querySelector('sl-switch'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(control).to.match(':state(checked)');
      expect(control?.checked).to.be.true;
    });

    it('should focus the switch when the label is clicked', async () => {
      const control = el.renderRoot.querySelector('sl-switch'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(el.shadowRoot!.activeElement).to.equal(control);
      expect(control!.shadowRoot!.activeElement).to.equal(
        control!.renderRoot.querySelector('input')
      );
    });

    it.only('should toggle the switch when the label is clicked', async () => {
      const control = el.renderRoot.querySelector('sl-switch'),
        label = el.renderRoot.querySelector('label');

      label?.click();
      await el.updateComplete;

      expect(control).to.match(':state(checked)');
      expect(control?.checked).to.be.true;
      expect(control!.renderRoot.querySelector('input')).to.have.attribute('aria-checked', 'true');
    });
  });
});
