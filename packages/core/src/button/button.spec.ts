import type { Button } from './button.js';
import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { restore, spy, stub } from 'sinon';
import './register.js';

describe('sl-button', () => {
  let el: Button;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
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
      
      el.disabled = true;
      await el.updateComplete;
      
      el.disabled = false;
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

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Hello world</sl-button>`);
    });

    it('should not be disabled by default', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el).not.to.match(':disabled');
    });

    it('should have the :disabled pseudo class', () => {
      el.setAttribute('disabled', '');

      expect(el).to.match(':disabled');
    });

    it('should have a tabindex of -1', async () => {
      el.setAttribute('disabled', '');
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '-1');
    });
  });

  describe('form integration', () => {
    let form: HTMLFormElement;

    beforeEach(async () => {
      form = await fixture(html`
        <form>
          <sl-button type="submit">Submit</sl-button>
        </form>
      `);

      el = form.firstElementChild as Button;
    });

    afterEach(() => restore());

    it('should have the form associated flag', () => {
      expect((el.constructor as any).formAssociated).to.be.true;
    });

    it('should be associated with the form', () => {
      expect(el.form).to.equal(form);
    })

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
      await sendKeys({ press: 'Space'});

      expect(requestSubmit).to.have.been.calledOnce;
    });

    it('should not call requestSubmit() if the button has type button', () => {
      const requestSubmit = spy(form, 'requestSubmit');
      
      el.type = 'button';
      el.click();

      expect(requestSubmit).not.to.have.been.called;
    });
  });
});
