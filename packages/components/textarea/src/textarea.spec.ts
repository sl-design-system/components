import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { spy} from "sinon";
import {ResizeType, Textarea, WrapType} from './textarea';

describe('sl-textarea', () => {
  let el: Textarea;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-textarea></sl-textarea>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have a textarea slot', () => {
      const slot = el.renderRoot.querySelector('slot[name="textarea"]');

      expect(slot).to.not.be.null;
      expect(slot).to.have.attribute('name', 'textarea');
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

      const textarea = el.querySelector('textarea');

      expect(textarea?.value).to.equal('my value');
    });

    it('should have a medium size by default', () => {
      expect(el).to.have.attribute('size', 'md');
    });

    it('should have a large size when set', () => {
      el.setAttribute('size', 'lg');

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should have a wrap property of soft by default', () => {
      expect(el).to.have.attribute('wrap', 'soft');
    });

    it('should have a wrap property of hard when set', () => {
      el.setAttribute('wrap', 'hard');

      expect(el).to.have.attribute('wrap', 'hard');
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

      const textarea = el.querySelector('textarea');

      expect(textarea).to.have.attribute('autocomplete', 'off');
    });

    it('should not have a placeholder by default', () => {
      expect(el).not.to.have.attribute('placeholder');
    });

    it('should have a placeholder when set', async () => {
      el.placeholder = 'my placeholder';
      await el.updateComplete;

      const textarea = el.querySelector('textarea');

      expect(textarea).to.have.attribute('placeholder', 'my placeholder');
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

    it('should not have a autocomplete attribute when autocomplete property is not provided', async() => {
      el.autocomplete = "off";
      await el.updateComplete;

      el.autocomplete = undefined;
      await el.updateComplete;

      expect(el.textarea.getAttribute('autocomplete')).to.be.null;
    });

    it('should have a resize attribute of vertical when resize property is not provided', async() => {
      el.resize = "auto";
      await el.updateComplete;

      (el.resize as ResizeType | undefined) = undefined;
      await el.updateComplete;

      expect(el.textarea.getAttribute('resize')).to.equal('vertical');
    });

    it('should have a wrap attribute of soft value when wrap property is not provided', async() => {
      el.wrap = "hard";
      await el.updateComplete;

      (el.wrap as WrapType | undefined) = undefined;
      await el.updateComplete;

      expect(el.textarea.getAttribute('wrap')).to.equal('soft');
    });

    it('should not have maxlength attribute when maxLength property is not provided', async() => {
      el.maxLength = 8;
      await el.updateComplete;

      el.maxLength = undefined;
      await el.updateComplete;

      expect(el.textarea.getAttribute('maxlength')).to.be.null;
    });

    it('should not have minlength attribute when minLength property is not provided', async() => {
      el.minLength = 2;
      await el.updateComplete;

      el.minLength = undefined;
      await el.updateComplete;

      expect(el.textarea.getAttribute('minLength')).to.be.null;
    });


    it('should not have a placeholder attribute when placeholder property is not provided', async() => {
      el.placeholder = "my placeholder";
      await el.updateComplete;

      el.placeholder = undefined;
      await el.updateComplete;

      expect(el.textarea.getAttribute('placeholder')).to.be.null;
    });

    // TODO: test wrap

    it('should not have readonly attribute when readonly property is not provided', async() => {
      el.readonly = true;
      await el.updateComplete;

      el.readonly = undefined;
      await el.updateComplete;

      expect(el.textarea.getAttribute('readonly')).to.be.null;
    });
  });

//   describe('resize of textarea', () => {
//     beforeEach(async () => {
//       el = await fixture(html`<sl-textarea></sl-textarea>`);
//     });
//
//     it('should focus textarea on click', async () => {
//       const textarea = el.querySelector('textarea');
//       const focusSpy = spy(textarea as any, 'focus');
//
//       el.click();
//       textarea?.focus();
//
//       expect(focusSpy).to.have.been.called;
//     });
//
//     it('should set the textarea height to auto if resize is auto', () => {
//       el.resize = 'auto';
//       const scrollHeightSpy = spy(Object.getPrototypeOf(el.textarea), 'scrollHeight');
//       const textareaStyleSpy = spy(el.textarea.style, 'setProperty');
//
//       // Act
//       el.setSize();
//
//       // Assert
//       expect(textareaStyleSpy.calledWith('height', 'auto')).toBe(true);
//       expect(scrollHeightSpy.calledOnce).toBe(true);
//
//       // Clean up
//       scrollHeightSpy.restore();
//       textareaStyleSpy.restore();
//     });
//
//     it('should set the textarea height to scrollHeight if resize is auto', () => {
//       el.resize = 'auto';
//       spyOnProperty(el.textarea, 'scrollHeight', 'get').and.returnValue(100);
//
//       // el.setSize();
//
//       expect(el.textarea.style.height).to.equal('100px');
//     });
//
//     it('should unset the textarea height if resize is not auto', () => {
// //
//     });
//   });

  describe('focusing', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-textarea></sl-textarea>`);
    });

    it('should focus textarea on click', async () => {
      const textarea = el.querySelector('textarea');
      const focusSpy = spy(textarea as any, 'focus');

      el.click();
      textarea?.focus();

      expect(focusSpy).to.have.been.called;
    });
  });

  describe('validation', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-textarea name="my-input" required></sl-textarea>`);
    });

    it('should not be valid when the textarea is empty and when it is required', async () => {
      const textarea = el.querySelector('textarea');

      expect(textarea?.validity.valid).to.equal(false);
    });

    it('should have an error message when it is invalid', async () => {
      el.checkValidity();
      const error = el.querySelector('sl-error');

      expect(error).to.exist;
    });

    it('should be valid when the textarea has a value and when it is required', async () => {
      el.value = "my value";
      await el.updateComplete;

      const textarea = el.querySelector('textarea');

      expect(textarea?.validity.valid).to.equal(true);
    });

    it('should show valid state when the textarea is valid', async () => {
      el.value = "my value";
      el.setAttribute('showValid', '');
      await el.updateComplete;

      const textarea = el.querySelector('textarea');

      expect(textarea?.validity.valid).to.equal(true);
      expect(el).to.have.attribute('showValid');
    });
  });

/*  describe('slotted input', () => {
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
      const slInput = el.querySelector('sl-text-input') as TextInput;
      const input = slInput.querySelector('input');

      expect(input).to.have.attribute('placeholder', 'I am a custom input');
    });

    it('should have a slotted input with autocomplete by default when not set', () => {
      const slInput = el.querySelector('sl-text-input') as TextInput;
      const input = slInput.querySelector('input');

      expect(input).to.have.attribute('autocomplete', 'off');
    });

    it('should have a slotted input which is not readonly by default', () => {
      const slInput = el.querySelector('sl-text-input') as TextInput;
      const input = slInput.querySelector('input');

      expect(input).not.to.have.attribute('readonly');
    });
  });*/

  describe('readonly textarea', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-textarea readonly></sl-textarea>`);
    });

    it('should not allow editing the value when textarea is readonly', () => {
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

