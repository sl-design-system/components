import { expect, fixture } from '@open-wc/testing';
import { type Form } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { restore, spy, stub } from 'sinon';
import '../register.js';
import { type Button, type ButtonType } from './button.js';

describe('sl-button', () => {
  let el: Button;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);
    });

    it('should have a button role', () => {
      expect(el).to.have.attribute('role', 'button');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el).not.to.match(':disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should have a tabindex', () => {
      expect(el).to.have.attribute('tabindex', '0');
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
        el = await fixture(html`<sl-button><sl-icon name="star"></sl-icon></sl-button>`);
      });

      it('should have an icon-only attribute', () => {
        expect(el).to.have.attribute('icon-only');
      });
    });

    describe('icon only, wrapped in container', () => {
      beforeEach(async () => {
        el = await fixture(html`
          <sl-button>
            <span><sl-icon name="star"></sl-icon></span>
          </sl-button>
        `);
      });

      it('should have an icon-only attribute', () => {
        expect(el).to.have.attribute('icon-only');
      });
    });

    describe('icon combined with text', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-button size="lg"><sl-icon name="star"></sl-icon> You're a star</sl-button>`);
      });

      it('should not have an icon-only attribute', () => {
        expect(el).not.to.have.attribute('icon-only');
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
      expect(el).to.match(':disabled');
    });

    it('should prevent click events from bubbling up the DOM', async () => {
      const clickEvent = new Event('click'),
        preventDefaultSpy = spy(clickEvent, 'preventDefault'),
        stopPropagationSpy = spy(clickEvent, 'stopPropagation');

      el.disabled = true;
      await el.updateComplete;

      el.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).to.have.been.called;
      expect(stopPropagationSpy).to.have.been.called;
    });

    it('should prevent Enter keydown event from bubbling up the DOM', async () => {
      const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' }),
        preventDefaultSpy = spy(keydownEvent, 'preventDefault'),
        stopPropagationSpy = spy(keydownEvent, 'stopPropagation');

      el.disabled = true;
      await el.updateComplete;

      el.dispatchEvent(keydownEvent);

      expect(preventDefaultSpy).to.have.been.called;
      expect(stopPropagationSpy).to.have.been.called;
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
        await sendKeys({ press: 'Enter' });

        expect(requestSubmit).not.to.have.been.called;
        expect(reset).not.to.have.been.called;
      });

      it('should not interact with the form when Space is typed', async () => {
        const requestSubmit = stub(form, 'requestSubmit').returns(undefined),
          reset = stub(form, 'reset').returns(undefined);

        el.focus();
        await sendKeys({ press: 'Space' });

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
        await sendKeys({ press: 'Enter' });

        expect(reset).to.have.been.calledOnce;
      });

      it('should call reset() on the form when Space is typed', async () => {
        const reset = stub(form, 'reset').returns(undefined);

        el.focus();
        await sendKeys({ press: 'Space' });

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
        await sendKeys({ press: 'Enter' });

        expect(requestSubmit).to.have.been.calledOnce;
      });

      it('should call requestSubmit() on the form when Space is typed', async () => {
        const requestSubmit = stub(form, 'requestSubmit').returns(undefined);

        el.focus();
        await sendKeys({ press: 'Space' });

        expect(requestSubmit).to.have.been.calledOnce;
      });
    });
  });
});
