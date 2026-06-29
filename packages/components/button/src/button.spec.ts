import { type Form } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import {
  getForwardedAccessibleName,
  getForwardedAriaProperty,
  getForwardedDescription,
  isForwardedDisabled
} from '@sl-design-system/shared/helpers/forward-aria.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { restore, spy, stub } from 'sinon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Button, type ButtonType } from './button.js';

describe('sl-button', () => {
  let el: Button, button: HTMLButtonElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);
      button = el.renderRoot.querySelector('button')!;
    });

    it('should have a native button in the shadow DOM', () => {
      expect(button).to.exist;
      expect(button).to.have.attribute('type', 'button');
    });

    it('should have a "button" CSS part on the inner button', () => {
      expect(button).to.have.attribute('part', 'button');
    });

    it('should not be disabled', () => {
      expect(button).not.to.have.attribute('disabled');
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should delegate focus to the inner button', () => {
      el.focus();

      expect(el.shadowRoot?.activeElement).to.equal(button);
    });

    it('should not have an explicit shape', () => {
      expect(el).not.to.have.attribute('shape');
      expect(el.shape).to.be.undefined;
    });

    it('should have a pill shape when set', async () => {
      el.shape = 'pill';
      await el.updateComplete;

      expect(el).to.have.attribute('shape', 'pill');
    });

    it('should not have an explicit fill', () => {
      expect(el).not.to.have.attribute('fill');
      expect(el.fill).to.be.undefined;
    });

    it('should have a fill when set', async () => {
      el.fill = 'outline';
      await el.updateComplete;

      expect(el).to.have.attribute('fill', 'outline');
    });

    it('should not have an explicit size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should be small size when set', async () => {
      el.size = 'sm';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'sm');
    });

    it('should be large size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should not have an explicit variant', () => {
      expect(el).not.to.have.attribute('variant');
      expect(el.variant).to.be.undefined;
    });

    it('should have a variant when set', async () => {
      el.variant = 'primary';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'primary');
    });

    it('should emit a click event on mouse click', async () => {
      const button = el.renderRoot.querySelector('button'),
        onClick = spy();

      el.addEventListener('click', onClick);
      await userEvent.click(button!);

      expect(onClick).to.have.been.calledOnce;
    });

    it('should emit a click event on Enter', async () => {
      const onClick = spy();

      el.addEventListener('click', onClick);
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(onClick).to.have.been.calledOnce;
    });

    it('should emit a click event on Space', async () => {
      const onClick = spy();

      el.addEventListener('click', onClick);
      el.focus();
      await userEvent.keyboard('{ }');

      expect(onClick).to.have.been.calledOnce;
    });
  });

  describe('icon', () => {
    describe('icon only, directly in button', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-button tooltip="Tooltip">
            <sl-icon name="star"></sl-icon>
          </sl-button>
        `);

        // Wait for the MutationObserver to detect the sl-icon and update the icon-only state.
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      it('should have the icon-only state', () => {
        expect(el).to.match(':state(icon-only)');
      });

      it('should not have the icon-only state when text is added', async () => {
        el.appendChild(document.createTextNode('Favorite'));
        await el.updateComplete;

        expect(el).not.to.match(':state(icon-only)');
      });
    });

    describe('icon only, wrapped in container', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-button tooltip="Tooltip">
            <span><sl-icon name="star"></sl-icon></span>
          </sl-button>
        `);

        // Wait for the MutationObserver to detect the sl-icon and update the icon-only state.
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      it('should have the icon-only state', () => {
        expect(el).to.match(':state(icon-only)');
      });
    });

    describe('icon combined with text', () => {
      beforeEach(async () => {
        el = await fixture(
          html`<sl-button size="lg"><sl-icon name="star"></sl-icon> You're a star</sl-button>`
        );
      });

      it('should not have an icon-only attribute', () => {
        expect(el).not.to.match(':state(icon-only)');
      });
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);
      button = el.renderRoot.querySelector('button')!;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(button).to.have.attribute('disabled');
    });

    it('should prevent click events from bubbling up the DOM', async () => {
      const el = await fixture<Button>(html`<sl-button disabled>Hello world</sl-button>`),
        clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true }),
        stopImmediatePropagationSpy = spy(clickEvent, 'stopImmediatePropagation');

      el.renderRoot.querySelector('button')?.dispatchEvent(clickEvent);

      expect(stopImmediatePropagationSpy).to.have.been.called;
    });

    it('should suppress events in the capture phase when disabled', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div id="wrapper">
          <sl-button disabled>Disabled</sl-button>
        </div>
      `);
      const button = wrapper.querySelector('sl-button'),
        innerButton = button?.renderRoot.querySelector('button');
      let captureCalled = false;
      let bubbleCalled = false;

      wrapper.addEventListener('click', () => (captureCalled = true), { capture: true });
      wrapper.addEventListener('click', () => (bubbleCalled = true));

      innerButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, composed: true, cancelable: true })
      );

      expect(captureCalled, 'capture listener on parent should be called').to.be.true;
      expect(bubbleCalled, 'bubble listener on parent should NOT be called').to.be.false;
    });

    it('should NOT suppress events when enabled', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div id="wrapper">
          <sl-button>Enabled</sl-button>
        </div>
      `);
      const button = wrapper.querySelector('sl-button'),
        innerButton = button?.renderRoot.querySelector('button');
      let captureCalled = false;
      let bubbleCalled = false;

      wrapper.addEventListener('click', () => (captureCalled = true), { capture: true });
      wrapper.addEventListener('click', () => (bubbleCalled = true));

      innerButton?.click();

      expect(captureCalled, 'capture listener on parent should be called').to.be.true;
      expect(bubbleCalled, 'bubble listener on parent should be called').to.be.true;
    });
  });

  describe('invoker API', () => {
    it('should not have a command by default', async () => {
      el = await fixture(html`<sl-button>Click me</sl-button>`);

      expect(el.command).to.be.undefined;
    });

    it('should not have a commandFor by default', async () => {
      el = await fixture(html`<sl-button>Click me</sl-button>`);

      expect(el.commandFor).to.be.undefined;
    });

    it('should not have a commandForElement by default', async () => {
      el = await fixture(html`<sl-button>Click me</sl-button>`);

      expect(el.commandForElement).to.be.undefined;
    });

    it('should pass the command to the inner button', async () => {
      el = await fixture(html`<sl-button command="show-modal">Click me</sl-button>`);

      expect(el.renderRoot.querySelector('button')).to.have.property('command', 'show-modal');
    });

    it('should set commandForElement on the inner button when commandFor matches a sibling element', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <sl-button commandfor="target">Click me</sl-button>
          <span id="target"></span>
        </div>
      `);

      el = wrapper.querySelector('sl-button')!;

      const button = el.renderRoot.querySelector('button'),
        target = wrapper.querySelector('#target');

      expect(button).to.have.property('commandForElement', target);
    });

    it('should set commandForElement to null when no matching element is found', async () => {
      el = await fixture(html`<sl-button commandfor="nonexistent">Click me</sl-button>`);

      expect(el.renderRoot.querySelector('button')).to.have.property('commandForElement', null);
    });

    it('should set commandForElement on the inner button when the property is set directly', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <sl-button command="show-modal">Click me</sl-button>
          <dialog>Dialog content</dialog>
        </div>
      `);

      el = wrapper.querySelector('sl-button')!;

      const target = wrapper.querySelector('dialog');
      el.commandForElement = target!;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('button')).to.have.property('commandForElement', target);
    });

    it('should prefer commandForElement over commandFor', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div>
          <sl-button command="show-modal" commandfor="other">Click me</sl-button>
          <span id="other"></span>
          <dialog>Dialog content</dialog>
        </div>
      `);

      el = wrapper.querySelector('sl-button')!;

      const target = wrapper.querySelector('dialog');
      el.commandForElement = target!;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('button')).to.have.property('commandForElement', target);
    });

    it('should open a dialog when command is "show-modal" and commandfor points to a dialog', async () => {
      const wrapper = await fixture(html`
        <div>
          <sl-button command="show-modal" commandfor="my-dialog">Open</sl-button>
          <dialog id="my-dialog">Dialog content</dialog>
        </div>
      `);

      el = wrapper.querySelector('sl-button')!;

      const dialog = wrapper.querySelector<HTMLDialogElement>('dialog')!;

      expect(dialog.open).to.be.false;

      el.renderRoot.querySelector('button')?.click();

      expect(dialog.open).to.be.true;
    });
  });

  describe('form integration', () => {
    it('should call reset() on the parent form when the button type is reset', async () => {
      const form: Form = await fixture(html`
        <sl-form>
          <sl-button type="reset">Button</sl-button>
        </sl-form>
      `);

      el = form.querySelector('sl-button')!;
      button = el.renderRoot.querySelector('button')!;

      spy(form, 'reset');

      button.click();

      expect(form.reset).to.have.been.calledOnce;
    });

    it('should call requestSubmit() on the parent form when the button type is submit', async () => {
      const form: Form = await fixture(html`
        <sl-form>
          <sl-button type="submit">Button</sl-button>
        </sl-form>
      `);

      el = form.querySelector('sl-button')!;
      button = el.renderRoot.querySelector('button')!;

      spy(form, 'requestSubmit');

      button.click();

      expect(form.requestSubmit).to.have.been.calledOnce;
    });
  });

  describe('native form integration', () => {
    let form: HTMLFormElement;

    const setup = async (type: ButtonType): Promise<void> => {
      form = await fixture(html`
        <form>
          <sl-button .type=${type}>Button</sl-button>
        </form>
      `);

      el = form.querySelector('sl-button')!;
      button = el.renderRoot.querySelector('button')!;
    };

    afterEach(() => restore());

    describe('defaults', () => {
      beforeEach(async () => await setup('button'));

      it('should have the form associated flag', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        expect((el.constructor as any).formAssociated).to.be.true;
      });

      it('should be associated with the form', () => {
        expect(el.internals.form).to.equal(form);
      });
    });

    describe('button type', () => {
      beforeEach(async () => await setup('button'));

      it('should not interact with the form when clicked', () => {
        const requestSubmit = stub(form, 'requestSubmit').returns(undefined),
          reset = stub(form, 'reset').returns(undefined);

        button.click();

        expect(requestSubmit).not.to.have.been.called;
        expect(reset).not.to.have.been.called;
      });

      it('should not interact with the form when Enter is typed', async () => {
        const requestSubmit = stub(form, 'requestSubmit').returns(undefined),
          reset = stub(form, 'reset').returns(undefined);

        el.focus();
        await userEvent.keyboard('{Enter}');

        expect(requestSubmit).not.to.have.been.called;
        expect(reset).not.to.have.been.called;
      });

      it('should not interact with the form when Space is typed', async () => {
        const requestSubmit = stub(form, 'requestSubmit').returns(undefined),
          reset = stub(form, 'reset').returns(undefined);

        el.focus();
        await userEvent.keyboard('{Space}');

        expect(requestSubmit).not.to.have.been.called;
        expect(reset).not.to.have.been.called;
      });
    });

    describe('reset type', () => {
      beforeEach(async () => await setup('reset'));

      it('should call reset() on the form when clicked', () => {
        const reset = stub(form, 'reset').returns(undefined);

        button.click();

        expect(reset).to.have.been.calledOnce;
      });

      it('should call reset() on the form when Enter is typed', async () => {
        const reset = stub(form, 'reset').returns(undefined);

        el.focus();
        await userEvent.keyboard('{Enter}');

        expect(reset).to.have.been.calledOnce;
      });

      it('should call reset() on the form when Space is typed', async () => {
        const reset = stub(form, 'reset').returns(undefined);

        el.focus();
        await userEvent.keyboard('{Space}');

        expect(reset).to.have.been.calledOnce;
      });
    });

    describe('submit type', () => {
      beforeEach(async () => await setup('submit'));

      it('should call requestSubmit() on the form when clicked', () => {
        const requestSubmit = stub(form, 'requestSubmit').returns(undefined);

        button.click();

        expect(requestSubmit).to.have.been.calledOnce;
      });

      it('should call requestSubmit() on the form when Enter is typed', async () => {
        const requestSubmit = stub(form, 'requestSubmit').returns(undefined);

        el.focus();
        await userEvent.keyboard('{Enter}');

        expect(requestSubmit).to.have.been.calledOnce;
      });

      it('should call requestSubmit() on the form when Space is typed', async () => {
        const requestSubmit = stub(form, 'requestSubmit').returns(undefined);

        el.focus();
        await userEvent.keyboard('{Space}');

        expect(requestSubmit).to.have.been.calledOnce;
      });
    });
  });

  describe('tabindex', () => {
    it('should default to 0', async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);
      button = el.renderRoot.querySelector('button')!;

      expect(button.tabIndex).to.equal(0);
    });

    it('should forward tabindex="-1" to the inner button', async () => {
      el = await fixture(html`<sl-button tabindex="-1">Hello world</sl-button>`);
      button = el.renderRoot.querySelector('button')!;

      expect(button.tabIndex).to.equal(-1);
    });
  });

  describe('accessibility', () => {
    describe('aria-disabled', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-button>Hello world</sl-button>`);
        button = el.renderRoot.querySelector('button')!;
      });

      it('should prevent click events from bubbling up the DOM', async () => {
        const clickEvent = new Event('click'),
          preventDefaultSpy = spy(clickEvent, 'preventDefault'),
          stopImmediatePropagationSpy = spy(clickEvent, 'stopImmediatePropagation');

        el.setAttribute('aria-disabled', 'true');
        await el.updateComplete;

        button.dispatchEvent(clickEvent);

        expect(preventDefaultSpy).to.have.been.called;
        expect(stopImmediatePropagationSpy).to.have.been.called;
      });

      it('should set aria-disabled on the inner button', async () => {
        el.setAttribute('aria-disabled', 'true');
        await el.updateComplete;

        expect(isForwardedDisabled(el)).to.equal('aria');
      });

      it('should be focusable when aria-disabled is set', async () => {
        el.setAttribute('aria-disabled', 'true');
        await el.updateComplete;

        el.focus();
        expect(el.shadowRoot?.activeElement).to.equal(button);
      });

      it('should not activate on mouse click when aria-disabled is set', async () => {
        const onClick = spy();

        el.setAttribute('aria-disabled', 'true');
        el.addEventListener('click', onClick);
        await el.updateComplete;

        // Do not use userEvent.click(button) since playwright does not trigger
        // click events on disabled elements, even if they are only aria-disabled.
        button.click();

        expect(onClick).not.to.have.been.called;
      });

      it('should not activate on Enter or Space when aria-disabled is set', async () => {
        const onClick = spy();

        el.setAttribute('aria-disabled', 'true');
        el.addEventListener('click', onClick);
        await el.updateComplete;

        el.focus();
        await userEvent.keyboard('{Enter}');
        await userEvent.keyboard('{ }');

        expect(onClick).not.to.have.been.called;
      });
    });

    describe('aria-labelledby', () => {
      it('should set ariaLabelledByElements on the inner button', async () => {
        const wrapper = await fixture(html`
          <div>
            <span id="my-label">Label text</span>
            <sl-button aria-labelledby="my-label">Click me</sl-button>
          </div>
        `);

        el = wrapper.querySelector('sl-button')!;

        expect(getForwardedAccessibleName(el)).to.equal('Label text');
      });

      it('should remove the aria-labelledby attribute from the host', async () => {
        el = await fixture(html`<sl-button aria-labelledby="my-label">Click me</sl-button>`);

        expect(el).not.to.have.attribute('aria-labelledby');
      });

      it('should set ariaLabelledByElements to an empty array when the referenced element does not exist', async () => {
        el = await fixture(html`<sl-button aria-labelledby="nonexistent">Click me</sl-button>`);

        expect(
          getForwardedAriaProperty(el, 'ariaLabelledByElements' as keyof HTMLElement)
        ).to.deep.equal([]);
      });
    });

    describe('aria-describedby', () => {
      it('should set ariaDescribedByElements on the inner button', async () => {
        const wrapper = await fixture(html`
          <div>
            <span id="my-desc">Description text</span>
            <sl-button aria-describedby="my-desc">Click me</sl-button>
          </div>
        `);

        el = wrapper.querySelector('sl-button')!;

        expect(getForwardedDescription(el)).to.equal('Description text');
      });

      it('should remove the aria-describedby attribute from the host', async () => {
        el = await fixture(html`<sl-button aria-describedby="my-desc">Click me</sl-button>`);

        expect(el).not.to.have.attribute('aria-describedby');
      });

      it('should set ariaDescribedByElements to an empty array when the referenced element does not exist', async () => {
        el = await fixture(html`<sl-button aria-describedby="nonexistent">Click me</sl-button>`);

        expect(
          getForwardedAriaProperty(el, 'ariaDescribedByElements' as keyof HTMLElement)
        ).to.deep.equal([]);
      });
    });
  });

  describe('tooltip', () => {
    it('should not have a tooltip by default', async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);

      expect(el.renderRoot.querySelector('sl-tooltip')).to.be.null;
    });

    it('should render an sl-tooltip when the tooltip property is set', async () => {
      el = await fixture(html`<sl-button tooltip="My tooltip">Hello world</sl-button>`);

      expect(el.renderRoot.querySelector('sl-tooltip')).to.exist;
    });

    it('should have an sl-tooltip with a tooltip part when set', async () => {
      el = await fixture(html`<sl-button tooltip="My tooltip">Hello world</sl-button>`);

      expect(el.renderRoot.querySelector('[part="tooltip"]')).to.exist;
    });

    it('should set the tooltip text content', async () => {
      el = await fixture(html`<sl-button tooltip="My tooltip">Hello world</sl-button>`);

      expect(el.renderRoot.querySelector('sl-tooltip')).to.have.trimmed.text('My tooltip');
    });

    it('should set ariaDescribedByElements on the inner button when a text button has a tooltip', async () => {
      el = await fixture(html`<sl-button tooltip="My tooltip">Hello world</sl-button>`);
      button = el.renderRoot.querySelector('button')!;

      const tooltipEl = el.renderRoot.querySelector('sl-tooltip')!;
      await tooltipEl.updateComplete;

      expect(button.ariaDescribedByElements).to.include(tooltipEl);
      expect(button.ariaLabelledByElements).not.to.include(tooltipEl);
    });

    it('should set ariaLabelledByElements on the inner button when an icon-only button has a tooltip', async () => {
      el = await fixture(
        html`<sl-button tooltip="Mark as favorite"><sl-icon name="star"></sl-icon></sl-button>`
      );

      // The first render uses type="description" because icon-only is detected asynchronously via
      // requestAnimationFrame. Wait for that rAF and the resulting re-render, which changes the
      // tooltip type to "label" and updates its ARIA relations.
      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      button = el.renderRoot.querySelector('button')!;
      const tooltipEl = el.renderRoot.querySelector('sl-tooltip')!;
      await tooltipEl.updateComplete;

      expect(button.ariaLabelledByElements).to.include(tooltipEl);
      expect(button.ariaDescribedByElements ?? []).not.to.include(tooltipEl);
    });

    it('should remove the tooltip when the tooltip property is unset', async () => {
      el = await fixture(html`<sl-button tooltip="My tooltip">Hello world</sl-button>`);
      el.tooltip = undefined;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-tooltip')).to.be.null;
    });

    it('should include both the tooltip and aria-describedby element in ariaDescribedByElements', async () => {
      const wrapper = await fixture(html`
        <div>
          <span id="icon-btn-label">Favorite star</span>
          <sl-button aria-describedby="icon-btn-label" tooltip="Mark as favorite">
            Hello world
          </sl-button>
        </div>
      `);

      el = wrapper.querySelector('sl-button')!;

      const button = el.renderRoot.querySelector('button')!,
        tooltip = el.renderRoot.querySelector('sl-tooltip')!,
        span = wrapper.querySelector<HTMLElement>('#icon-btn-label')!;

      expect(button.ariaDescribedByElements).to.include(span);
      expect(button.ariaDescribedByElements).to.include(tooltip);
    });
  });
});
