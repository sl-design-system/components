import { type Form } from '@sl-design-system/form';
import '@sl-design-system/form/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { TextSelection } from 'prosemirror-state';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_FEATURES, resolveFeatures } from './features.js';
import './register.js';
import { type RichTextEditor } from './rich-text-editor.js';

const toolbarLabels = (el: RichTextEditor): string[] =>
  Array.from(el.renderRoot.querySelectorAll('[data-toolbar-item]')).map(
    item =>
      item.getAttribute('aria-label') ??
      item.shadowRoot?.querySelector('button')?.getAttribute('aria-label') ??
      ''
  );

const content = (el: RichTextEditor): HTMLElement =>
  el.querySelector<HTMLElement>('.sl-rich-text-editor-content')!;

describe('resolveFeatures', () => {
  it('should use the default set when nothing is given', () => {
    expect([...resolveFeatures()]).to.deep.equal([...DEFAULT_FEATURES]);
    expect([...resolveFeatures('')]).to.deep.equal([...DEFAULT_FEATURES]);
  });

  it('should add and remove features left to right', () => {
    const features = resolveFeatures('default checklist -strike');

    expect(features.has('checklist')).to.be.true;
    expect(features.has('strike')).to.be.false;
    expect(features.has('bold')).to.be.true;
  });

  it('should only have the named features without default', () => {
    expect([...resolveFeatures('bold italic link')]).to.deep.equal(['bold', 'italic', 'link']);
  });

  it('should skip unknown features with a warning', () => {
    const warn = spy(console, 'warn');

    try {
      expect([...resolveFeatures('bold sparkles')]).to.deep.equal(['bold']);
      expect(warn).to.have.been.calledOnce;
    } finally {
      warn.restore();
    }
  });

  it('should never include opt-in features in default', () => {
    expect(DEFAULT_FEATURES).not.to.include('code');
    expect(DEFAULT_FEATURES).not.to.include('checklist');
    expect(DEFAULT_FEATURES).not.to.include('character-count');
  });
});

describe('sl-rich-text-editor', () => {
  let el: RichTextEditor;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-rich-text-editor></sl-rich-text-editor>`);
    });

    it('should render the editable in light DOM', () => {
      expect(content(el)).to.exist;
      expect(content(el)).to.have.attribute('slot', 'content');
      expect(content(el)).to.have.attribute('contenteditable', 'true');
    });

    it('should give the editable the textbox role', () => {
      expect(content(el)).to.have.attribute('role', 'textbox');
      expect(content(el)).to.have.attribute('aria-multiline', 'true');
    });

    it('should have a formatting toolbar', () => {
      const toolbar = el.renderRoot.querySelector('[role="toolbar"]');

      expect(toolbar).to.exist;
      expect(toolbar).to.have.attribute('aria-controls', content(el).id);
    });

    it('should have a text style select', () => {
      expect(el.renderRoot.querySelector('sl-select')).to.exist;
    });

    it('should have buttons for the default features', () => {
      expect(toolbarLabels(el)).to.include.members([
        'Bold',
        'Italic',
        'Underline',
        'Strikethrough',
        'Link',
        'Bulleted list',
        'Numbered list',
        'Quote',
        'Undo',
        'Redo'
      ]);
    });

    it('should not have buttons for opt-in features', () => {
      expect(toolbarLabels(el)).not.to.include.members(['Inline code']);
      expect(toolbarLabels(el)).not.to.include('Checklist');
    });

    it('should not have a footer', () => {
      expect(el.renderRoot.querySelector('[part="footer"]')).not.to.exist;
    });

    it('should not have a value', () => {
      expect(el.value).to.equal('');
    });

    it('should be empty', () => {
      expect(el.matches(':state(empty)')).to.be.true;
    });

    it('should be valid', () => {
      expect(el.valid).to.be.true;
    });

    it('should disable undo and redo without history', () => {
      const undo = el.renderRoot.querySelector('sl-button[aria-label="Undo"], sl-button');

      expect(undo).to.have.attribute('disabled');
    });
  });

  describe('value', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-rich-text-editor
          .value=${'<p>Plants turn <strong>light energy</strong> into food.</p>'}></sl-rich-text-editor>
      `);
    });

    it('should render the value', () => {
      expect(content(el).querySelector('strong')).to.have.trimmed.text('light energy');
    });

    it('should not be empty', () => {
      expect(el.matches(':state(empty)')).to.be.false;
    });

    it('should return the value as HTML', () => {
      expect(el.value).to.equal('<p>Plants turn <strong>light energy</strong> into food.</p>');
    });

    it('should update the content when the value changes', async () => {
      el.value = '<p>Something else</p>';
      await el.updateComplete;

      expect(content(el)).to.have.trimmed.text('Something else');
    });

    it('should mark the bold button pressed when the caret is in bold text', async () => {
      const view = el.view!;
      let pos = -1;

      view.state.doc.descendants((node, p) => {
        if (pos < 0 && node.isText && node.text === 'light energy') {
          pos = p + 2;
        }
      });
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos)));
      await el.updateComplete;

      const bold = el.renderRoot.querySelector<HTMLElement & { pressed?: boolean }>(
        'sl-toggle-button[id$="-bold"]'
      );

      expect(bold?.pressed).to.be.true;
    });

    it('should drop content a missing feature needs, but keep its text', async () => {
      el.features = 'italic';
      await el.updateComplete;

      expect(content(el).querySelector('strong')).not.to.exist;
      expect(el.value).to.equal('<p>Plants turn light energy into food.</p>');
    });
  });

  describe('features', () => {
    it('should only show the toolbar buttons for the given features', async () => {
      el = await fixture(html`<sl-rich-text-editor features="bold italic"></sl-rich-text-editor>`);

      expect(toolbarLabels(el)).to.deep.equal(['Bold', 'Italic']);
      expect(el.renderRoot.querySelector('sl-select')).not.to.exist;
    });

    it('should show a character count with the character-count feature', async () => {
      el = await fixture(html`
        <sl-rich-text-editor
          features="default character-count"
          maxlength="10"
          .value=${'<p>Hello</p>'}></sl-rich-text-editor>
      `);

      expect(el.renderRoot.querySelector('.count')).to.have.trimmed.text('5 / 10');
    });

    it('should be invalid when over the maximum length', async () => {
      el = await fixture(html`
        <sl-rich-text-editor
          features="default character-count"
          maxlength="3"
          .value=${'<p>Hello</p>'}></sl-rich-text-editor>
      `);

      expect(el.valid).to.be.false;
      expect(el.validity.tooLong).to.be.true;
    });

    it('should report whether it has a feature', async () => {
      el = await fixture(
        html`<sl-rich-text-editor features="default checklist"></sl-rich-text-editor>`
      );

      expect(el.hasFeature('checklist')).to.be.true;
      expect(el.hasFeature('code')).to.be.false;
    });
  });

  describe('checklist', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-rich-text-editor
          features="default checklist"
          .value=${'<ul data-type="task-list"><li data-task="a" data-checked="true"><p>Read chapter 4.2</p></li><li data-task="b" data-checked="false"><p>Answer questions 1–5</p></li></ul>'}></sl-rich-text-editor>
      `);
    });

    it('should render a real checkbox per item', () => {
      const boxes = content(el).querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

      expect(boxes).to.have.length(2);
      expect(boxes[0].checked).to.be.true;
      expect(boxes[1].checked).to.be.false;
    });

    it('should label each checkbox by its item text', () => {
      const box = content(el).querySelector('input[type="checkbox"]')!,
        label = el.querySelector(`#${box.getAttribute('aria-labelledby')}`);

      expect(label).to.have.trimmed.text('Read chapter 4.2');
    });

    it('should keep the checkbox out of the editable text', () => {
      const label = content(el).querySelector('.task-box');

      expect(label).to.have.attribute('contenteditable', 'false');
    });

    it('should toggle an item and keep its id', async () => {
      content(el).querySelectorAll<HTMLInputElement>('input[type="checkbox"]')[1].click();
      await el.updateComplete;

      expect(el.value).to.contain('<li data-checked="true" data-task="b">');
    });

    it('should make the toggle undoable', async () => {
      const box = content(el).querySelectorAll<HTMLInputElement>('input[type="checkbox"]')[1];

      box.click();
      await el.updateComplete;

      const undo = el.renderRoot.querySelector('sl-button')!;
      expect(undo).not.to.have.attribute('disabled');
    });

    it('should give items without an id a new one', async () => {
      el.value =
        '<ul data-type="task-list"><li data-task="" data-checked="false"><p>New</p></li></ul>';
      await el.updateComplete;

      expect(el.value).to.match(/data-task="[^"]+"/);
    });

    it('should have a checklist button', () => {
      expect(toolbarLabels(el)).to.include('Checklist');
    });

    it('should disable the checkboxes when read-only', async () => {
      el.readonly = true;
      await el.updateComplete;

      const boxes = content(el).querySelectorAll<HTMLInputElement>('input[type="checkbox"]');

      expect(Array.from(boxes).every(box => box.disabled)).to.be.true;
    });
  });

  describe('states', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-rich-text-editor .value=${'<p>Nice structure.</p>'}></sl-rich-text-editor>`
      );
    });

    it('should hide the toolbar when read-only', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('[role="toolbar"]')).not.to.exist;
      expect(content(el)).to.have.attribute('contenteditable', 'false');
      expect(content(el)).to.have.attribute('aria-readonly', 'true');
    });

    it('should disable the toolbar and editable when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      const items = Array.from(el.renderRoot.querySelectorAll('[data-toolbar-item]'));

      expect(items.every(item => item.hasAttribute('disabled'))).to.be.true;
      expect(content(el)).to.have.attribute('contenteditable', 'false');
      expect(content(el)).to.have.attribute('aria-disabled', 'true');
    });

    it('should be invalid when required and empty', async () => {
      el.required = true;
      el.value = '';
      await el.updateComplete;

      expect(el.valid).to.be.false;
      expect(el.validity.valueMissing).to.be.true;
      expect(content(el)).to.have.attribute('aria-required', 'true');
    });

    it('should mark the editable invalid after reporting validity', async () => {
      el.required = true;
      el.value = '';
      await el.updateComplete;

      el.reportValidity();
      await el.updateComplete;

      expect(el).to.have.attribute('show-validity', 'invalid');
      expect(content(el)).to.have.attribute('aria-invalid', 'true');
    });

    it('should show the placeholder when empty', async () => {
      el.placeholder = 'Write your feedback…';
      el.value = '';
      await el.updateComplete;

      expect(content(el).querySelector('.placeholder')).to.have.attribute(
        'data-placeholder',
        'Write your feedback…'
      );
      expect(el.value).to.equal('');
    });
  });

  describe('form', () => {
    let form: Form;

    beforeEach(async () => {
      form = await fixture(html`
        <sl-form>
          <sl-rich-text-editor name="description" .value=${'<p>Hello</p>'}></sl-rich-text-editor>
        </sl-form>
      `);
      el = form.querySelector('sl-rich-text-editor')!;

      // The form registers its controls in the next animation frame
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should register only the editor with the form, not its toolbar controls', () => {
      expect(form.controls).to.have.length(1);
      expect(form.controls[0]).to.equal(el);
    });

    it('should add its value to the form value', () => {
      expect(form.value).to.deep.equal({ description: '<p>Hello</p>' });
    });
  });
});
