import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { TextSelection } from 'prosemirror-state';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { EditorToolbar } from './editor-toolbar.js';
import { Editor } from './editor.js';

describe('sl-editor-toolbar', () => {
  let editor: Editor;
  let toolbar: EditorToolbar;

  describe('defaults', () => {
    beforeEach(async () => {
      editor = await fixture<Editor>(html`<sl-editor></sl-editor>`);
      toolbar = editor.renderRoot.querySelector('sl-editor-toolbar')!;

      // Wait for toolbar to update with view
      await toolbar.updateComplete;
    });

    it('should render a toolbar inside the editor', () => {
      expect(toolbar).to.exist;
    });

    it('should have an sl-tool-bar element', () => {
      const toolBar = toolbar.renderRoot.querySelector('sl-tool-bar');
      expect(toolBar).to.exist;
    });

    it('should render a Bold button', () => {
      const button = toolbar.renderRoot.querySelector('sl-button[aria-label="Bold"]');
      expect(button).to.exist;
    });

    it('should render an Italic button', () => {
      const button = toolbar.renderRoot.querySelector('sl-button[aria-label="Italic"]');
      expect(button).to.exist;
    });

    it('should render an Underline button', () => {
      const button = toolbar.renderRoot.querySelector('sl-button[aria-label="Underline"]');
      expect(button).to.exist;
    });

    it('should render a Strikethrough button', () => {
      const button = toolbar.renderRoot.querySelector('sl-button[aria-label="Strikethrough"]');
      expect(button).to.exist;
    });

    it('should render an Inline code button', () => {
      const button = toolbar.renderRoot.querySelector('sl-button[aria-label="Inline code"]');
      expect(button).to.exist;
    });

    it('should render a Blockquote button', () => {
      const button = toolbar.renderRoot.querySelector('sl-button[aria-label="Blockquote"]');
      expect(button).to.exist;
    });

    it('should render heading buttons H1–H3', () => {
      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Heading 1"]')).to.exist;
      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Heading 2"]')).to.exist;
      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Heading 3"]')).to.exist;
    });

    it('should render list buttons', () => {
      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Bullet list"]')).to.exist;
      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Ordered list"]')).to.exist;
    });

    it('should render Undo and Redo buttons', () => {
      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Undo"]')).to.exist;
      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Redo"]')).to.exist;
    });

    it('should not be disabled by default', () => {
      expect(toolbar).not.to.have.attribute('disabled');
    });

    it('should have Undo disabled when there is no history', () => {
      const undo = toolbar.renderRoot.querySelector('sl-button[aria-label="Undo"]');
      expect(undo).to.have.attribute('aria-disabled', 'true');
    });

    it('should have Redo disabled when there is nothing to redo', () => {
      const redo = toolbar.renderRoot.querySelector('sl-button[aria-label="Redo"]');
      expect(redo).to.have.attribute('aria-disabled', 'true');
    });

    it('should not show any format button as active (no selection)', () => {
      const activeButtons = toolbar.renderRoot.querySelectorAll('sl-button[aria-pressed="true"]');
      expect(activeButtons.length).to.equal(0);
    });
  });

  describe('with content', () => {
    beforeEach(async () => {
      editor = await fixture<Editor>(html`<sl-editor .value=${'<p><strong>bold text</strong></p>'}></sl-editor>`);
      toolbar = editor.renderRoot.querySelector('sl-editor-toolbar')!;
      await toolbar.updateComplete;
    });

    it('should enable Undo after typing', async () => {
      // Click into editor to focus, then type something
      const mount = editor.renderRoot.querySelector('.mount') as HTMLElement;
      await userEvent.click(mount);
      await userEvent.keyboard('x');
      await toolbar.updateComplete;

      const undo = toolbar.renderRoot.querySelector('sl-button[aria-label="Undo"]');
      expect(undo).not.to.have.attribute('aria-disabled');
    });
  });

  describe('active state', () => {
    beforeEach(async () => {
      editor = await fixture<Editor>(html`<sl-editor .value=${'<p><strong>bold</strong></p>'}></sl-editor>`);
      toolbar = editor.renderRoot.querySelector('sl-editor-toolbar')!;
      await toolbar.updateComplete;
    });

    it('should show Bold button as active when cursor is in bold text', async () => {
      const view = editor.view!;

      // Select the "bold" text by dispatching a selection transaction
      const tr = view.state.tr.setSelection(
        // Select all content inside the paragraph
        TextSelection.near(view.state.doc.resolve(2))
      );
      view.dispatch(tr);
      await toolbar.updateComplete;

      const boldButton = toolbar.renderRoot.querySelector('sl-button[aria-label="Bold"]');
      expect(boldButton).to.have.attribute('aria-pressed', 'true');
    });
  });

  describe('toolbar disabled', () => {
    beforeEach(async () => {
      editor = await fixture<Editor>(html`<sl-editor disabled></sl-editor>`);
      toolbar = editor.renderRoot.querySelector('sl-editor-toolbar')!;
      await toolbar.updateComplete;
    });

    it('should be disabled when the editor is disabled', () => {
      expect(toolbar).to.have.attribute('disabled');
    });

    it('should pass disabled to the sl-tool-bar', () => {
      const toolBar = toolbar.renderRoot.querySelector('sl-tool-bar');
      expect(toolBar).to.have.attribute('disabled');
    });
  });

  describe('toolbar hidden', () => {
    beforeEach(async () => {
      editor = await fixture<Editor>(html`<sl-editor .toolbar=${false}></sl-editor>`);
      await editor.updateComplete;
    });

    it('should not render the toolbar when toolbar=false', () => {
      const t = editor.renderRoot.querySelector('sl-editor-toolbar');
      expect(t).not.to.exist;
    });
  });

  describe('formatting actions', () => {
    beforeEach(async () => {
      editor = await fixture<Editor>(html`<sl-editor .value=${'<p>hello world</p>'}></sl-editor>`);
      toolbar = editor.renderRoot.querySelector('sl-editor-toolbar')!;
      await toolbar.updateComplete;

      // Select all text via ProseMirror
      const { state, dispatch } = editor.view!;
      const { AllSelection } = await import('prosemirror-state');
      dispatch(state.tr.setSelection(new AllSelection(state.doc)));
      await toolbar.updateComplete;
    });

    afterEach(() => {
      editor.remove();
    });

    it('should apply bold when Bold button is clicked', async () => {
      const boldButton = toolbar.renderRoot.querySelector<HTMLElement>('sl-button[aria-label="Bold"]')!;
      await userEvent.click(boldButton);
      await toolbar.updateComplete;

      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Bold"]')).to.have.attribute(
        'aria-pressed',
        'true'
      );
    });

    it('should apply italic when Italic button is clicked', async () => {
      const italicButton = toolbar.renderRoot.querySelector<HTMLElement>('sl-button[aria-label="Italic"]')!;
      await userEvent.click(italicButton);
      await toolbar.updateComplete;

      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Italic"]')).to.have.attribute(
        'aria-pressed',
        'true'
      );
    });

    it('should toggle heading when H1 button is clicked', async () => {
      const h1Button = toolbar.renderRoot.querySelector<HTMLElement>('sl-button[aria-label="Heading 1"]')!;
      await userEvent.click(h1Button);
      await toolbar.updateComplete;

      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Heading 1"]')).to.have.attribute(
        'aria-pressed',
        'true'
      );
    });

    it('should deactivate heading when clicked again', async () => {
      const h1Button = toolbar.renderRoot.querySelector<HTMLElement>('sl-button[aria-label="Heading 1"]')!;
      await userEvent.click(h1Button);
      await toolbar.updateComplete;
      await userEvent.click(h1Button);
      await toolbar.updateComplete;

      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Heading 1"]')).to.have.attribute(
        'aria-pressed',
        'false'
      );
    });

    it('should apply blockquote when Blockquote button is clicked', async () => {
      const bqButton = toolbar.renderRoot.querySelector<HTMLElement>('sl-button[aria-label="Blockquote"]')!;
      await userEvent.click(bqButton);
      await toolbar.updateComplete;

      expect(toolbar.renderRoot.querySelector('sl-button[aria-label="Blockquote"]')).to.have.attribute(
        'aria-pressed',
        'true'
      );
    });
  });
});
