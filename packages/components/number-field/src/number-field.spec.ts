import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type NumberField } from './number-field.js';

describe('sl-number-field', () => {
  let el: NumberField;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field></sl-search-field>`);
    });

    it('should have no buttons', () => {
      expect(el.renderRoot.querySelector('button')).not.to.exist;
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

    it('should not be readonly', () => {
      expect(el).not.to.have.attribute('readonly');
      expect(el.readonly).not.to.be.true;
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('readonly');
      expect(el.readonly).to.be.true;
    });
  });

  describe('with value', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field value="10"></sl-search-field>`);
    });

    // it('should have a clear button', () => {
    //   const button = el.renderRoot.querySelector('button');
    //
    //   expect(button).to.exist;
    //   expect(button).to.contain('sl-icon[name="xmark"]');
    // });

    // it('should not have a clear button when disabled', async () => {
    //   el.disabled = true;
    //   await el.updateComplete;
    //
    //   expect(el.renderRoot.querySelector('button')).to.not.exist;
    // });

    // it('should clear the input when the clear button is clicked', () => {
    //   el.renderRoot.querySelector('button')?.click();
    //
    //   expect(el.value).to.equal('');
    // });

    // it('should clear the input when the escape key is pressed', async () => {
    //   el.focus();
    //   await sendKeys({ press: 'Escape' });
    //
    //   expect(el.value).to.equal('');
    // });

    // it('should focus the input when the clear button is clicked', () => {
    //   el.renderRoot.querySelector('button')?.click();
    //
    //   expect(document.activeElement).to.equal(el.querySelector('input'));
    // });

    // it('should emit a clear event when the clear button is clicked', () => {
    //   const onClear = spy();
    //
    //   el.addEventListener('sl-clear', onClear);
    //   el.renderRoot.querySelector('button')?.click();
    //
    //   expect(onClear).to.be.calledOnce;
    // });

    // it('should emit a clear event when the escape key is pressed', async () => {
    //   const onClear = spy();
    //
    //   el.addEventListener('sl-clear', onClear);
    //   el.focus();
    //   await sendKeys({ press: 'Escape' });
    //
    //   expect(onClear).to.be.calledOnce;
    // });

    // it('should emit a search event with the value when enter is pressed', async () => {
    //   const onSearch: (value: string) => void = spy();
    //
    //   el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
    //   el.focus();
    //   await sendKeys({ press: 'Enter' });
    //
    //   expect(onSearch).to.be.calledOnce;
    //   expect(onSearch).to.be.calledWith('Foo');
    // });
  });

  describe('with buttons', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-number-field value="10"></sl-search-field>`);
    });

    // TODO: end, edges, click on plus, click on minus, shold have plus and minus icon
  });

  describe('required', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      el = await fixture(html`<sl-number-field required></sl-text-area>`);
      input = el.querySelector('input')!;
    });

    it('should be invalid', () => {
      expect(el.valid).to.be.false;
    });

    it('should have an invalid input', () => {
      expect(input.matches(':invalid')).to.be.true;
      expect(input.validity.valid).to.be.false;
      expect(input.validity.valueMissing).to.be.true;
    });

    // it('should have a validation message', () => {
    //   expect(el.validationMessage).to.equal('Please fill in this field.');
    // });

    it('should have a show-validity attribute when reported', async () => {
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

    it('should be valid after typing a number', async () => {
      el.focus();
      await sendKeys({ type: '123 ' });
      await el.updateComplete;

      expect(el.valid).to.equal(true);
    });
  });

  describe('min and max', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      el = await fixture(html`<sl-number-field min="2" max="12" value="13"></sl-text-area>`);
      input = el.querySelector('input')!;
      el.valueAsNumber = 13;
      await el.updateComplete;

      el.reportValidity();
      await el.updateComplete;
    });

    it('should be invalid when value is greated than max', () => {
      // input.value = '13';
      //  await el.updateComplete;
      el.blur();

      // el.reportValidity();
      // await el.updateComplete;

      console.log(
        'el should be invalid',
        input,
        'value??',
        input.value,
        '--->',
        el.value,
        '<---',
        el.valid,
        input.validity.valid,
        input.validity.rangeOverflow,
        input.validity.customError,
        input.validity,
        input.validationMessage,
        el.validity
      );

      expect(el.valid).to.be.false;
    });

    it('should have an invalid input', () => {
      expect(input.matches(':invalid')).to.be.true;
      expect(input.validity.valid).to.be.false;
      expect(input.validity.customError).to.be.true;
    });

    it('should have a validation message', () => {
      console.log(
        'el.validationMessage',
        el.validationMessage,
        input.validationMessage,
        input.value,
        el.valueAsNumber,
        el.max
      );
      expect(input.validationMessage).to.equal('The value must be less than or equal to 12.');
    });

    it('should have a show-validity attribute when reported', async () => {
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

    // it('should be valid after typing proper number', async () => {
    //   el.focus();
    //   await sendKeys({ type: '' });
    //   await el.updateComplete;
    //
    //   await sendKeys({ type: '10 ' });
    //   el.blur();
    //   await el.updateComplete;
    //
    //   console.log('el should be valid with proper value',input, 'value??', input.value, '--->', el.value ,'<---', el.valid, input.validity.valid, input.validity.rangeOverflow, input.validity.customError, input.validity, input.validationMessage, el.validity);
    //
    //   expect(el.valid).to.equal(true);
    // });
  });
});

// TODO: test with unit parsing, with percentage
// min and max
// per different locale?
