import { expect, fixture } from '@open-wc/testing';
import { a11ySnapshot, sendKeys } from '@web/test-runner-commands';
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

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have a button role', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-confusing-void-expression
      const { role } = (await a11ySnapshot({ selector: 'sl-button' })) as any;

      expect(role).to.equal('button');
    });

    it('should have a tabindex', () => {
      expect(el).to.have.attribute('tabindex', '0');
    });

    it('should allow for a custom tabindex', async () => {
      el.tabIndex = 10;
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '10');
    });

    it('should remember the tabindex when being enabled', async () => {
      el.tabIndex = 10;
      await el.updateComplete;

      el.setAttribute('disabled', '');
      await el.updateComplete;

      el.removeAttribute('disabled');
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '10');
    });

    it('should be size medium', () => {
      expect(el).to.have.attribute('size', 'md');
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

    it('should have a default variant', () => {
      expect(el).to.have.attribute('variant', 'default');
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

      it('should have an icon the same size as the button', () => {
        expect(el.querySelector('sl-icon')).to.have.attribute('size', 'md');
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

      it('should have an icon the same size as the button', () => {
        expect(el.querySelector('sl-icon')).to.have.attribute('size', 'md');
      });
    });

    describe('icon combined with text', () => {
      beforeEach(async () => {
        el = await fixture(html`<sl-button size="lg"><sl-icon name="star"></sl-icon> You're a star</sl-button>`);
      });

      it('should not have an icon-only attribute', () => {
        expect(el).not.to.have.attribute('icon-only');
      });

      it('should have an icon the same size as the button', () => {
        expect(el.querySelector('sl-icon')).to.have.attribute('size', 'lg');
      });
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);
    });

    it('should not be disabled by default', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el).not.to.match(':disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should have the :disabled pseudo class', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.match(':disabled');
    });

    it('should not emit a click event when the button is disabled', async () => {
      const clickEvent = new Event('click');
      const preventDefaultSpy = spy(clickEvent, 'preventDefault');
      const stopPropagationSpy = spy(clickEvent, 'stopPropagation');

      el.disabled = true;
      await el.updateComplete;

      el.dispatchEvent(clickEvent);

      expect(preventDefaultSpy).to.have.been.called;
      expect(stopPropagationSpy).to.have.been.called;
    });
  });

  describe('form integration', () => {
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
