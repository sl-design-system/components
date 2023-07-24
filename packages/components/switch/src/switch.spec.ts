import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { Switch } from './switch.js';
import '../register.js';

describe('sl-switch', () => {
  let el: Switch;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch></sl-switch>`);
      await el.updateComplete;
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have an icon when size is md or lg', async () => {
      expect(el.renderRoot.querySelector('sl-icon')).not.to.be.null;

      el.size = 'sm';
      await el.updateComplete;
      expect(el.renderRoot.querySelector('sl-icon')).to.be.null;
      
      el.size = 'lg';
      await el.updateComplete;
      expect(el.renderRoot.querySelector('sl-icon')).not.to.be.null;
    });

    it('should not be on by default', () => {
      expect(el.checked).not.to.equal(true);
      expect(el.internals.ariaChecked).to.equal('false');
      expect(el.icon).to.equal('xmark');
    });

    it('should not be disabled by default', () => {
      expect(el).not.to.have.attribute('disabled');
    });

    it('should change the state to checked when clicked', async () => {
      el.click();

      expect(el.checked).to.equal(true);
      expect(el.icon).to.equal('check');
    });

    it('should change the state to on when clicked on the track', async () => {
      (el.renderRoot.querySelector('.track') as HTMLElement)?.click();

      expect(el.checked).to.equal(true);
    });

    it('should change the state to on on key down', async () => {
      el.focus();
      await sendKeys({ press: 'Enter' });

      expect(el.checked).to.equal(true);
    });

    it('should have a class to indicate it doesn\'t have a label', () => {
      expect(el.classList.contains('no-label')).to.equal(true);
    });

    it('should not have a class to indicate it doesn\'t have a label when there is a label present', async () => {
      el.innerHTML = 'Label';
      await el.updateComplete;

      expect(el.classList.contains('no-label')).to.equal(false);
      
      el.innerHTML = '';
      await el.updateComplete;
      expect(el.classList.contains('no-label')).to.equal(true);
    });

    it('should have the correct icon size', async () => {
      expect(el.iconSize).to.equal('xs');
      
      el.size = 'lg';
      await el.updateComplete;
      expect(el.iconSize).to.equal('md');
    });
    
    it('should use custom icon names', async () => {
      el.iconOn = 'sun';
      el.iconOff = 'moon';
      await el.updateComplete;

      expect(el.icon).to.equal('moon');
      el.click();
      expect(el.icon).to.equal('sun');
    });
  });
  
  describe('disabled', () => {
    beforeEach(async ()=>{
      el = await fixture(html`<sl-switch disabled></sl-switch>`);
    });

    it('should be disabled if set', async () => {
      expect(el).to.have.attribute('disabled');
    });

    it('should not change the state to on when clicked', async () => {
      el.click();

      expect(el.checked).not.to.equal(true);
    });

    it('should not change the state to on when clicked on the track', async () => {
      (el.renderRoot.querySelector('.track') as HTMLElement)?.click();

      expect(el.checked).not.to.equal(true);
    });

    it('should not change the state to on on key down', async () => {
      el.disabled = true;
      await el.updateComplete;

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(el.checked).not.to.equal(true);
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-switch checked></sl-switch>`);
    });

    it('should be on when the property is set', () => {
      expect(el.checked).to.equal(true);
      expect(el.internals.ariaChecked).to.equal('true');
    });

    it('should change the state to off when clicked', async () => {
      el.click();

      expect(el.checked).to.equal(false);
    });
  });

  describe('form integration', () => {
    describe('unchecked', () => {
      let form: HTMLFormElement;
      beforeEach(async () => {
        form = await fixture(html`
          <form>
              <sl-switch></sl-switch>
          </form>
        `);

        el = form.firstElementChild as Switch;
      });

      it('should revert back to the correct initial state (off) when the form is reset', () => {
        el.click();

        expect(el.checked).to.equal(true);
        
        el.formResetCallback();
        
        expect(el.checked).to.equal(false);
      });
    });

    describe('checked', () => {
      let form: HTMLFormElement;
      beforeEach(async () => {
        form = await fixture(html`
          <form>
              <sl-switch checked></sl-switch>
          </form>
        `);

        el = form.firstElementChild as Switch;
      });

      it('should revert back to the correct initial state (on) when the form is reset', () => {
        el.click();

        expect(el.checked).to.equal(false);
        
        el.formResetCallback();
        
        expect(el.checked).to.equal(true);
      });
    });
  });
});
