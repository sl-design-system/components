// import type { Accordion } from './accordion.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { Accordion } from './accordion.js';

describe('sl-accordion', () => {
  let el: Accordion;

  describe('empty', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-accordion></sl-accordion>`);
    });

    it('should not break', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });
  });

  // TODO: single version and click open close only one opened at once

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-accordion>
          <sl-accordion-item summary="Example 1">Content of accordion 1</sl-accordion-item>
          <sl-accordion-item summary="Example 2">Content of accordion 2</sl-accordion-item>
          <sl-accordion-item summary="Example 3">Content of accordion 3</sl-accordion-item>
        </sl-accordion>
      `);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    // it('should have a role of radiogroup', () => {
    //   expect(el.internals.role).to.equal('radiogroup');
    // });

    // it('should not be disabled', () => {
    //   const allDisabled = Array.from(el.querySelectorAll('sl-accordion-item')).every(accordion => accordion.disabled);
    //
    //   expect(el).not.to.have.attribute('disabled');
    //   console.log('eeel', el, allDisabled);
    //   expect(allDisabled).to.be.false;
    // });

    // it('should be disabled when set', async () => {
    //   el.disabled = true;
    //   await el.updateComplete;
    //
    //   expect(el).to.have.attribute('disabled');
    //   expect(el.radios?.every(radio => radio.disabled)).to.be.true;
    // });

    it('should not have single attribute by default', () => {
      // el.single = true;
      // await el.updateComplete;

      expect(el).not.to.have.attribute('single');
    });

    it('should be single when set', async () => {
      el.single = true;
      await el.updateComplete;

      expect(el).to.have.attribute('single');
    });

    // it('should emit an sl-change event when clicking an option', async () => {
    //   // const onChange = spy();
    //   //
    //   // el.addEventListener('sl-change', onChange);
    //   // el.querySelector('sl-radio')?.click();
    //   // await new Promise(resolve => setTimeout(resolve));
    //   //
    //   // expect(onChange).to.have.been.calledOnce;
    // });

    // it('should emit an sl-change event when pressing the space key on an option', async () => {
    //   const onChange = spy();
    //
    //   el.addEventListener('sl-change', onChange);
    //   el.querySelector('sl-radio')?.focus();
    //   await sendKeys({ press: 'Space' });
    //
    //   expect(onChange).to.have.been.calledOnce;
    // });
    //
    // it('should emit an sl-change event when pressing the enter key on an option', async () => {
    //   const onChange = spy();
    //
    //   el.addEventListener('sl-change', onChange);
    //   el.querySelector('sl-radio')?.focus();
    //   await sendKeys({ press: 'Enter' });
    //
    //   expect(onChange).to.have.been.calledOnce;
    // });

    // it('should emit an sl-focus event when focusing the group', async () => {
    //   const onFocus = spy();
    //
    //   el.addEventListener('sl-focus', onFocus);
    //   el.querySelector('sl-radio')?.focus();
    //   await new Promise(resolve => setTimeout(resolve));
    //
    //   expect(onFocus).to.have.been.calledOnce;
    // });

    // it('should emit an sl-blur event when blurring the group', () => {
    //   const onBlur = spy();
    //
    //   el.addEventListener('sl-blur', onBlur);
    //   el.querySelector('sl-radio')?.focus();
    //   el.querySelector('sl-radio')?.blur();
    //
    //   expect(onBlur).to.have.been.calledOnce;
    // });

    // it('should emit an sl-validate event when calling reportValidity', () => {
    //   const onValidate = spy();
    //
    //   el.addEventListener('sl-validate', onValidate);
    //   el.reportValidity();
    //
    //   expect(onValidate).to.have.been.calledOnce;
    // });

    // TODO: open on keyboard enter / space

    it('should toggle only one accordion when single is set', async () => {
      const items = Array.from(el.querySelectorAll('sl-accordion-item'));

      el.single = true;
      await el.updateComplete;

      // items.forEach(item => {
      //   if (item !== event.target) {
      //     if (item.renderRoot.querySelector('details')?.hasAttribute('open')) {
      //       item.renderRoot.querySelector('details')?.click();
      //       item.renderRoot.querySelector('details')?.removeAttribute('open');
      //     }
      //   }
      // });

      console.log(' items[0]', items[0], items, el.single, el);
      console.log('items[0].renderRoot', items[0].renderRoot.querySelector('summary'));

      // items[0].click();

      items[0]?.renderRoot.querySelector('summary')?.click();

      await el.updateComplete;

      // await new Promise(resolve => setTimeout(resolve, 100));
      await new Promise(resolve => setTimeout(resolve));

      console.log('222 items[0]', items[0].open, items[0], items[0].renderRoot);

      expect(items.at(0)?.open).to.be.true;

      // items[1].click();

      items[1]?.renderRoot.querySelector('summary')?.click();

      await el.updateComplete;

      // await new Promise(resolve => setTimeout(resolve, 100));
      await new Promise(resolve => setTimeout(resolve));

      console.log(' items[0] at the end', items[0], items, el.single, el);

      expect(items.at(0)?.open).to.be.false;
      expect(items.at(1)?.open).to.be.true;

      // expect(radios.at(0)?.checked).to.be.false;
      // expect(radios.at(0)?.tabIndex).to.equal(0);
      // expect(radios.at(1)?.checked).to.be.false;
      // expect(radios.at(1)?.tabIndex).to.equal(-1);
      //
      // radios.at(0)?.focus();
      // await sendKeys({ press: 'Space' });
      //
      // expect(radios.at(0)?.checked).to.be.true;
      // expect(radios.at(1)?.checked).to.be.false;
      //
      // await sendKeys({ press: 'ArrowRight' });
      // await sendKeys({ press: 'Enter' });
      //
      // expect(radios.at(0)?.checked).to.be.false;
      // expect(radios.at(1)?.checked).to.be.true;
    });

    it('should not toggle only one accordion when there is no single set', async () => {
      const items = Array.from(el.querySelectorAll('sl-accordion-item'));

      // el.single = true;
      // await el.updateComplete;

      // items.forEach(item => {
      //   if (item !== event.target) {
      //     if (item.renderRoot.querySelector('details')?.hasAttribute('open')) {
      //       item.renderRoot.querySelector('details')?.click();
      //       item.renderRoot.querySelector('details')?.removeAttribute('open');
      //     }
      //   }
      // });

      console.log(' items[0]', items[0], items, el.single, el);
      console.log('items[0].renderRoot', items[0].renderRoot.querySelector('summary'));

      // items[0].click();

      items[0].renderRoot.querySelector('summary')?.click();

      await el.updateComplete;

      // await new Promise(resolve => setTimeout(resolve, 100));
      await new Promise(resolve => setTimeout(resolve));

      console.log('222 items[0]', items[0].open, items[0], items[0].renderRoot);

      expect(items.at(0)?.open).to.be.true;

      // items[1].click();

      items[1].renderRoot.querySelector('summary')?.click();

      await el.updateComplete;

      // await new Promise(resolve => setTimeout(resolve, 100));
      await new Promise(resolve => setTimeout(resolve));

      console.log('333 items[0] at the end', items[0], items, el.single, el);

      expect(items.at(0)?.open).to.be.true;
      expect(items.at(1)?.open).to.be.true;

      // expect(radios.at(0)?.checked).to.be.false;
      // expect(radios.at(0)?.tabIndex).to.equal(0);
      // expect(radios.at(1)?.checked).to.be.false;
      // expect(radios.at(1)?.tabIndex).to.equal(-1);
      //
      // radios.at(0)?.focus();
      // await sendKeys({ press: 'Space' });
      //
      // expect(radios.at(0)?.checked).to.be.true;
      // expect(radios.at(1)?.checked).to.be.false;
      //
      // await sendKeys({ press: 'ArrowRight' });
      // await sendKeys({ press: 'Enter' });
      //
      // expect(radios.at(0)?.checked).to.be.false;
      // expect(radios.at(1)?.checked).to.be.true;
    });
  });

  //
  // describe('defaults', () => {
  //   beforeEach(async () => {
  //     el = await fixture(html`<sl-button>Hello world</sl-button>`);
  //   });
  //
  //   it('should render correctly', () => {
  //     expect(el).shadowDom.to.equalSnapshot();
  //   });
  //
  //   it('should have a button role', async () => {
  //     const { role } = await a11ySnapshot({ selector: 'sl-button' }) as any;
  //
  //     expect(role).to.equal('button');
  //   });
  //
  //   it('should have a tabindex', () => {
  //     expect(el).to.have.attribute('tabindex', '0');
  //   });
  //
  //   it('should allow for a custom tabindex', async () => {
  //     el.tabIndex = 10;
  //     await el.updateComplete;
  //
  //     expect(el).to.have.attribute('tabindex', '10');
  //   });
  //
  //   it('should remember the tabindex when being enabled', async () => {
  //     el.tabIndex = 10;
  //     await el.updateComplete;
  //
  //     el.setAttribute('disabled', '');
  //     await el.updateComplete;
  //
  //     el.removeAttribute('disabled');
  //     await el.updateComplete;
  //
  //     expect(el).to.have.attribute('tabindex', '10');
  //   });
  //
  //   it('should be size medium', () => {
  //     expect(el).to.have.attribute('size', 'md');
  //   });
  //
  //   it('should be small size when set', async () => {
  //     el.size = 'sm';
  //     await el.updateComplete;
  //
  //     expect(el).to.have.attribute('size', 'sm');
  //   });
  //
  //   it('should be large size when set', async () => {
  //     el.size = 'lg';
  //     await el.updateComplete;
  //
  //     expect(el).to.have.attribute('size', 'lg');
  //   });
  //
  //   it('should have a default variant', () => {
  //     expect(el).to.have.attribute('variant', 'default');
  //   });
  // });
  //
  // describe('icon', () => {
  //   describe('icon only, directly in button', () => {
  //     beforeEach(async () => {
  //       el = await fixture(html`<sl-button><sl-icon name="star"></sl-icon></sl-button>`);
  //     });
  //
  //     it('should have an icon-only attribute', () => {
  //       expect(el).to.have.attribute('icon-only');
  //     });
  //
  //     it('should have an icon the same size as the button', () => {
  //       expect(el.querySelector('sl-icon')).to.have.attribute('size','md');
  //     });
  //   });
  //
  //   describe('icon only, wrapped in container', () => {
  //     beforeEach(async () => {
  //       el = await fixture(html`<sl-button><span><sl-icon name="star"></sl-icon></span>
  //         </sl-button>`);
  //     });
  //
  //     it('should have an icon-only attribute', () => {
  //       expect(el).to.have.attribute('icon-only');
  //     });
  //
  //     it('should have an icon the same size as the button', () => {
  //       expect(el.querySelector('sl-icon')).to.have.attribute('size','md');
  //     });
  //   });
  //
  //   describe('icon combined with text', () => {
  //     beforeEach(async () => {
  //       el = await fixture(html`<sl-button size="lg"><sl-icon name="star"></sl-icon> You're a star</sl-button>`);
  //     });
  //
  //     it('should not have an icon-only attribute', () => {
  //       expect(el).not.to.have.attribute('icon-only');
  //     });
  //
  //     it('should have an icon the same size as the button', () => {
  //       expect(el.querySelector('sl-icon')).to.have.attribute('size','lg');
  //     });
  //   });
  // });
  //
  // describe('disabled', () => {
  //   beforeEach(async () => {
  //     el = await fixture(html`<sl-button>Hello world</sl-button>`);
  //   });
  //
  //   it('should not be disabled by default', () => {
  //     expect(el).not.to.have.attribute('disabled');
  //     expect(el).not.to.match(':disabled');
  //     expect(el.disabled).not.to.be.true;
  //   });
  //
  //   it('should have the :disabled pseudo class', async () => {
  //     el.disabled = true;
  //     await el.updateComplete;
  //
  //     expect(el).to.match(':disabled');
  //   });
  //
  //   it('should have a tabindex of -1', async () => {
  //     el.disabled = true;
  //     await el.updateComplete;
  //
  //     expect(el).to.have.attribute('tabindex', '-1');
  //   });
  //
  //   it('should not emit a click event when the button is disabled', async () => {
  //     const clickEvent = new Event('click');
  //     const preventDefaultSpy = spy(clickEvent, 'preventDefault');
  //     const stopPropagationSpy = spy(clickEvent, 'stopPropagation');
  //
  //     el.disabled = true;
  //     await el.updateComplete;
  //
  //     el.dispatchEvent(clickEvent);
  //
  //     expect(preventDefaultSpy).to.have.been.called;
  //     expect(stopPropagationSpy).to.have.been.called;
  //   });
  // });
  //
  // describe('form integration', () => {
  //   let form: HTMLFormElement;
  //
  //   const setup = async (type: ButtonType): Promise<void> => {
  //     form = await fixture(html`
  //       <form>
  //         <sl-button .type=${type}>Button</sl-button>
  //       </form>
  //     `);
  //
  //     el = form.firstElementChild as Button;
  //   };
  //
  //   afterEach(() => restore());
  //
  //   describe('defaults', () => {
  //     beforeEach(async () => setup('button'));
  //
  //     it('should have the form associated flag', () => {
  //       expect((el.constructor as any).formAssociated).to.be.true;
  //     });
  //
  //     it('should be associated with the form', () => {
  //       expect(el.internals.form).to.equal(form);
  //     });
  //   });
  //
  //   describe('button type', () => {
  //     beforeEach(async () => setup('button'));
  //
  //     it('should not interact with the form when clicked', () => {
  //       const requestSubmit = stub(form, 'requestSubmit').returns(undefined),
  //         reset = stub(form, 'reset').returns(undefined);
  //
  //       el.click();
  //
  //       expect(requestSubmit).not.to.have.been.called;
  //       expect(reset).not.to.have.been.called;
  //     });
  //
  //     it('should not interact with the form when Enter is typed', async () => {
  //       const requestSubmit = stub(form, 'requestSubmit').returns(undefined),
  //         reset = stub(form, 'reset').returns(undefined);
  //
  //       el.focus();
  //       await sendKeys({ press: 'Enter' });
  //
  //       expect(requestSubmit).not.to.have.been.called;
  //       expect(reset).not.to.have.been.called;
  //     });
  //
  //     it('should not interact with the form when Space is typed', async () => {
  //       const requestSubmit = stub(form, 'requestSubmit').returns(undefined),
  //         reset = stub(form, 'reset').returns(undefined);
  //
  //       el.focus();
  //       await sendKeys({ press: 'Space' });
  //
  //       expect(requestSubmit).not.to.have.been.called;
  //       expect(reset).not.to.have.been.called;
  //     });
  //   });
  //
  //   describe('reset type', () => {
  //     beforeEach(async () => setup('reset'));
  //
  //     it('should call reset() on the form when clicked', () => {
  //       const reset = stub(form, 'reset').returns(undefined);
  //
  //       el.click();
  //
  //       expect(reset).to.have.been.calledOnce;
  //     });
  //
  //     it('should call reset() on the form when Enter is typed', async () => {
  //       const reset = stub(form, 'reset').returns(undefined);
  //
  //       el.focus();
  //       await sendKeys({ press: 'Enter' });
  //
  //       expect(reset).to.have.been.calledOnce;
  //     });
  //
  //     it('should call reset() on the form when Space is typed', async () => {
  //       const reset = stub(form, 'reset').returns(undefined);
  //
  //       el.focus();
  //       await sendKeys({ press: 'Space' });
  //
  //       expect(reset).to.have.been.calledOnce;
  //     });
  //   });
  //
  //   describe('submit type', () => {
  //     beforeEach(async () => setup('submit'));
  //
  //     it('should call requestSubmit() on the form when clicked', () => {
  //       const requestSubmit = stub(form, 'requestSubmit').returns(undefined);
  //
  //       el.click();
  //
  //       expect(requestSubmit).to.have.been.calledOnce;
  //     });
  //
  //     it('should call requestSubmit() on the form when Enter is typed', async () => {
  //       const requestSubmit = stub(form, 'requestSubmit').returns(undefined);
  //
  //       el.focus();
  //       await sendKeys({ press: 'Enter' });
  //
  //       expect(requestSubmit).to.have.been.calledOnce;
  //     });
  //
  //     it('should call requestSubmit() on the form when Space is typed', async () => {
  //       const requestSubmit = stub(form, 'requestSubmit').returns(undefined);
  //
  //       el.focus();
  //       await sendKeys({ press: 'Space' });
  //
  //       expect(requestSubmit).to.have.been.calledOnce;
  //     });
  //   });
  // });
});
