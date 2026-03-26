import { type Form } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { restore, spy, stub } from 'sinon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { Button, type ButtonType } from './button.js';

describe('sl-button', () => {
  let el: Button;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);
    });

    it('should have a native button in the shadow DOM', () => {
      const button = el.renderRoot.querySelector('button');

      expect(button).to.exist;
      expect(button).to.have.attribute('type', 'button');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
      expect(el.renderRoot.querySelector('button')).not.to.have.attribute('disabled');
    });

    it('should delegate focus to the inner button', () => {
      el.focus();

      expect(el.renderRoot.querySelector('button')).to.equal(el.shadowRoot?.activeElement);
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
  });

  describe('icon', () => {
    describe('icon only, directly in button', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-button aria-label="Mark as favorite"><sl-icon name="star"></sl-icon></sl-button>
        `);
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
          <sl-button aria-label="Mark as favorite">
            <span><sl-icon name="star"></sl-icon></span>
          </sl-button>
        `);
      });

      it('should have the icon-only state', () => {
        expect(el).to.match(':state(icon-only)');
      });
    });

    describe('icon combined with text', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-button size="lg"><sl-icon name="star"></sl-icon> You're a star</sl-button>`);
      });

      it('should not have an icon-only attribute', () => {
        expect(el).not.to.match(':state(icon-only)');
      });
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.renderRoot.querySelector('button')).to.have.attribute('disabled');
    });

    it('should prevent click events from bubbling up the DOM', async () => {
      const el = await fixture<Button>(html`<sl-button disabled>Hello world</sl-button>`);
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      const stopImmediatePropagationSpy = spy(clickEvent, 'stopImmediatePropagation');

      el.dispatchEvent(clickEvent);

      expect(stopImmediatePropagationSpy).to.have.been.called;
    });

    it('should suppress events in the capture phase when disabled', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div id="wrapper">
          <sl-button disabled>Disabled</sl-button>
        </div>
      `);
      const button = wrapper.querySelector('sl-button')!;
      let captureCalled = false;
      let bubbleCalled = false;

      wrapper.addEventListener('click', () => (captureCalled = true), { capture: true });
      wrapper.addEventListener('click', () => (bubbleCalled = true));

      button.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));

      expect(captureCalled, 'capture listener on parent should be called').to.be.true;
      expect(bubbleCalled, 'bubble listener on parent should NOT be called').to.be.false;
    });

    it('should NOT suppress events when enabled', async () => {
      const wrapper = await fixture<HTMLDivElement>(html`
        <div id="wrapper">
          <sl-button>Enabled</sl-button>
        </div>
      `);
      const button = wrapper.querySelector('sl-button')!;
      let captureCalled = false;
      let bubbleCalled = false;

      wrapper.addEventListener('click', () => (captureCalled = true), { capture: true });
      wrapper.addEventListener('click', () => (bubbleCalled = true));

      button.click();

      expect(captureCalled, 'capture listener on parent should be called').to.be.true;
      expect(bubbleCalled, 'bubble listener on parent should be called').to.be.true;
    });
  });

  describe('aria-disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);
    });

    it('should prevent click events from bubbling up the DOM', async () => {
      const clickEvent = new Event('click'),
        preventDefaultSpy = spy(clickEvent, 'preventDefault'),
        stopImmediatePropagationSpy = spy(clickEvent, 'stopImmediatePropagation');

      el.setAttribute('aria-disabled', 'true');
      await el.updateComplete;

      el.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).to.have.been.called;
      expect(stopImmediatePropagationSpy).to.have.been.called;
    });

    it('should set aria-disabled on the inner button', async () => {
      el.setAttribute('aria-disabled', 'true');
      await el.updateComplete;

      expect(el.renderRoot.querySelector('button')).to.have.attribute('aria-disabled', 'true');
    });

    it('should be focusable when aria-disabled is set', async () => {
      el.setAttribute('aria-disabled', 'true');
      await el.updateComplete;

      const button = el.renderRoot.querySelector('button')!;

      expect(button).not.to.have.attribute('disabled');

      el.focus();
      expect(el.shadowRoot?.activeElement).to.equal(button);
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

      const button = el.renderRoot.querySelector('button')!,
        target = wrapper.querySelector('#target');

      expect(button).to.have.property('commandForElement', target);
    });

    it('should set commandForElement to null when no matching element is found', async () => {
      el = await fixture(html`<sl-button commandfor="nonexistent">Click me</sl-button>`);

      expect(el.renderRoot.querySelector('button')).to.have.property('commandForElement', null);
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

      el.renderRoot.querySelector('button')!.click();

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

      spy(form, 'reset');

      form.querySelector('sl-button')?.click();

      expect(form.reset).to.have.been.calledOnce;
    });

    it('should call requestSubmit() on the parent form when the button type is submit', async () => {
      const form: Form = await fixture(html`
        <sl-form>
          <sl-button type="submit">Button</sl-button>
        </sl-form>
      `);

      spy(form, 'requestSubmit');

      form.querySelector('sl-button')?.click();

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

      el = form.firstElementChild as Button;
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

        el.click();

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

        el.click();

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

        el.click();

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
});
