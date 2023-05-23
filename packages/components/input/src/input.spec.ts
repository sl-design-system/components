import type { Input } from './input.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { spy} from "sinon";

describe('sl-text-input', () => {
  let el: Input;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-input></sl-text-input>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have an input slot', () => {
      const slot = el.renderRoot.querySelector('slot[name="input"]');

      expect(slot).to.not.be.null;
      expect(slot).to.have.attribute('name', 'input');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
    });

    it('should be disabled if set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
    });

    it('should not have a value by default', () => {
      expect(el).not.to.have.attribute('value');
    });

    it('should have a value when set', async() => {
      el.value = "my value";
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input?.value).to.equal('my value');
    });

    it('should have a medium size by default', () => {
      expect(el).to.have.attribute('size', 'md');
    });

    it('should have a large size when set', () => {
      el.setAttribute('size', 'lg');

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should not be readonly by default', () => {
      expect(el).not.to.have.attribute('readonly');
    });

    it('should be readonly when set', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el).to.have.attribute('readonly');
    });

    it('should not have an autocomplete by default', () => {
      expect(el).not.to.have.attribute('autocomplete');
    });

    it('should not have an autocomplete when set', async() => {
      el.autocomplete = 'off';
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('autocomplete', 'off');
    });

    it('should not have a placeholder by default', () => {
      expect(el).not.to.have.attribute('placeholder');
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'my placeholder';
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('placeholder', 'my placeholder');
    });

    it('should have a text type by default', () => {
      const input = el.querySelector('input');

      expect(input).to.have.attribute('type', 'text');
    });

    it('should have a email type when set', async() => {
      el.type = "email";
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('type', 'email');
    });

    it('should have a number type when set', async() => {
      el.type = "number";
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('type', 'number');
    });

    it('should have a tel type when set', async() => {
      el.type = "tel";
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('type', 'tel');
    });

    it('should have a url type when set', async() => {
      el.type = "url";
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('type', 'url');
    });

    it('should not have a pattern by default', () => {
      expect(el).not.to.have.attribute('pattern');
    });

    it('should have a pattern when set', async () => {
      el.pattern = '.{3,5}';
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('pattern', '.{3,5}');
    });

    it('should not have a min by default', () => {
      expect(el).not.to.have.attribute('min');
    });

    it('should not have a minLength by default', () => {
      expect(el).not.to.have.attribute('minLength');
    });

    it('should not have a maxLength by default', () => {
      expect(el).not.to.have.attribute('maxLength');
    });

    it('should not be invalid by default', () => {
      expect(el).not.to.have.attribute('invalid');
    });

    it('should not be valid by default', () => {
      expect(el).not.to.have.attribute('valid');
    });

    it('should not have showValid by default', () => {
      expect(el).not.to.have.attribute('showValid');
    });

    it('should not have a max by default', () => {
      expect(el).not.to.have.attribute('max');
    });

    it('should not have a step by default', () => {
      expect(el).not.to.have.attribute('step');
    });

    it('should not have a autocomplete attribute when autocomplete property is not provided', async() => {
      el.autocomplete = "off";
      await el.updateComplete;

      el.autocomplete = undefined;
      await el.updateComplete;

      expect(el.input.getAttribute('autocomplete')).to.be.null;
    });

    it('should not have maxlength attribute when maxLength property is not provided', async() => {
      el.maxLength = 8;
      await el.updateComplete;

      el.maxLength = undefined;
      await el.updateComplete;

      expect(el.input.getAttribute('maxlength')).to.be.null;
    });

    it('should not have minlength attribute when minLength property is not provided', async() => {
      el.minLength = 2;
      await el.updateComplete;

      el.minLength = undefined;
      await el.updateComplete;

      expect(el.input.getAttribute('minLength')).to.be.null;
    });

    it('should not have min attribute when min property is not provided', async() => {
      el.min = 2;
      await el.updateComplete;

      el.min = undefined;
      await el.updateComplete;

      expect(el.input.getAttribute('min')).to.be.null;
    });

    it('should not have max attribute when max property is not provided', async() => {
      el.max = 20;
      await el.updateComplete;

      el.max = undefined;
      await el.updateComplete;

      expect(el.input.getAttribute('max')).to.be.null;
    });

    it('should not have step attribute when step property is not provided', async() => {
      el.step = 2;
      await el.updateComplete;

      el.step = undefined;
      await el.updateComplete;

      expect(el.input.getAttribute('step')).to.be.null;
    });

    it('should not have a pattern attribute when pattern property is not provided', async() => {
      el.pattern = '.{3,5}';
      await el.updateComplete;

      el.pattern = undefined;
      await el.updateComplete;

      expect(el.input.getAttribute('pattern')).to.be.null;
    });

    it('should not have a placeholder attribute when placeholder property is not provided', async() => {
      el.placeholder = "my placeholder";
      await el.updateComplete;

      el.placeholder = undefined;
      await el.updateComplete;

      expect(el.input.getAttribute('placeholder')).to.be.null;
    });

    it('should not have readonly attribute when readonly property is not provided', async() => {
      el.readonly = true;
      await el.updateComplete;

      el.readonly = undefined;
      await el.updateComplete;

      expect(el.input.getAttribute('readonly')).to.be.null;
    });
  });

  describe('text input', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-input type="text"></sl-text-input>`);
    });

    it('should have a minLength of 3 when set', async() => {
      el.minLength = 3;
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('minLength', '3');
    });

    it('should have a maxLength of 8 when set', async() => {
      el.maxLength = 8;
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('maxLength', '8');
    });
  });

  describe('number input', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-input type="number"></sl-text-input>`);
    });

    it('should have a min of 2 when set', async() => {
      el.min = 2;
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('min', '2');
    });

    it('should have a max of 8 when set', async() => {
      el.max = 8;
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('max', '8');
    });

    it('should have a step of 4 when set', async() => {
      el.step = 4;
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input).to.have.attribute('step', '4');
    });
  });

  describe('focusing', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-input></sl-text-input>`);
    });

    it('should focus input on click', async () => {
      const input = el.querySelector('input');
      const focusSpy = spy(input as any, 'focus');

      el.click();
      input?.focus();

      expect(focusSpy).to.have.been.called;
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-input name="my-input" required></sl-text-input>`);
    });

    it('should not be valid when the input is empty and when it is required', async () => {
      const input = el.querySelector('input');

      expect(input?.validity.valid).to.equal(false);
    });

    it('should have an error message when it is invalid', async () => {
      el.checkValidity();
      const error = el.querySelector('sl-error');

      expect(error).to.exist;
    });

    it('should be valid when the input has a value and when it is required', async () => {
      el.value = "my value";
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input?.validity.valid).to.equal(true);
    });

    it('should show valid state when the input is valid', async () => {
      el.value = "my value";
      el.setAttribute('showValid', '');
      await el.updateComplete;

      const input = el.querySelector('input');

      expect(input?.validity.valid).to.equal(true);
      expect(el).to.have.attribute('showValid');
    });
  });

  describe('slotted input', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <form>
          <sl-label for="custom">Custom input</sl-label>
          <sl-text-input id="custom">
            <input id="foo" slot="input" placeholder="I am a custom input" />
          </sl-text-input>
        </form>
      `);
    });

    it('should use the slotted input', () => {
      const slInput = el.querySelector('sl-text-input') as Input;
      const input = slInput.querySelector('input');

      expect(input).to.have.attribute('placeholder', 'I am a custom input');
    });

    it('should have a slotted input with autocomplete by default when not set', () => {
      const slInput = el.querySelector('sl-text-input') as Input;
      const input = slInput.querySelector('input');

      expect(input).to.have.attribute('autocomplete', 'off');
    });

    it('should have a slotted input which is not readonly by default', () => {
      const slInput = el.querySelector('sl-text-input') as Input;
      const input = slInput.querySelector('input');

      expect(input).not.to.have.attribute('readonly');
    });
  });

  describe('slotted prefix / suffix', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-text-input>
          <span slot="prefix">prefix example</span>
          <span slot="suffix">suffix example</span>
        </sl-text-input>
      `);
    });

    it('should use the slotted prefix', () => {
      const prefix = el.querySelector('[slot="prefix"]');

      expect(prefix).to.not.be.null;
      expect(prefix).to.have.trimmed.text('prefix example');
    });

    it('should use the slotted suffix', () => {
      const prefix = el.querySelector('[slot="suffix"]');

      expect(prefix).to.not.be.null;
      expect(prefix).to.have.trimmed.text('suffix example');
    });

  });

  describe('readonly input', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-text-input readonly></sl-text-input>`);
    });

    it('should not allow editing the value when input is readonly', () => {
      el.value = 'my value';

      el.dispatchEvent(new Event('input'));

      expect(el.value).to.equal('my value');
    });

    it('should not emit input event when value changes through user interaction', () => {
      el.value = 'initial value';

      const event = new Event('input');
      const inputEventSpy = spy(event,'preventDefault');

      el.dispatchEvent(event);

      expect(inputEventSpy).not.to.have.been.called;
      el.removeEventListener('input', inputEventSpy);
    });
  });
});

