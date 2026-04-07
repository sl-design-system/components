import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { TextSelection } from 'prosemirror-state';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { EditorToolbar } from './editor-toolbar.js';
import { Editor } from './editor.js';

describe('sl-editor-toolbar', () => {
  let editor: Editor;
  let toolbar: EditorToolbar;

  const getButtonByIconName = (iconName: string): HTMLElement | null => {
    return toolbar.renderRoot.querySelector<HTMLElement>(`sl-icon[name="${iconName}"]`)?.closest('sl-button') ?? null;
  };

  const getNativeButtonByIconName = (iconName: string): HTMLButtonElement | null => {
    return getButtonByIconName(iconName)?.shadowRoot?.querySelector('button') ?? null;
  };

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
      const button = getButtonByIconName('editor-bold');
      expect(button).to.exist;
    });

    it('should render an Italic button', () => {
      const button = getButtonByIconName('editor-italic');
      expect(button).to.exist;
    });

    it('should render an Underline button', () => {
      const button = getButtonByIconName('editor-underline');
      expect(button).to.exist;
    });

    it('should render a Strikethrough button', () => {
      const button = getButtonByIconName('editor-strikethrough');
      expect(button).to.exist;
    });

    it('should render an Inline code button', () => {
      const button = getButtonByIconName('far-code');
      expect(button).to.exist;
    });

    it('should render a Blockquote button', () => {
      const button = getButtonByIconName('far-quote-left');
      expect(button).to.exist;
    });

    it('should render heading buttons H1–H3', () => {
      expect(getButtonByIconName('far-h1')).to.exist;
      expect(getButtonByIconName('far-h2')).to.exist;
      expect(getButtonByIconName('far-h3')).to.exist;
    });

    it('should render list buttons', () => {
      expect(getButtonByIconName('far-list')).to.exist;
      expect(getButtonByIconName('far-list-ol')).to.exist;
    });

    it('should render Undo and Redo buttons', () => {
      expect(getButtonByIconName('far-arrow-rotate-left')).to.exist;
      expect(getButtonByIconName('far-arrow-rotate-right')).to.exist;
    });

    it('should not be disabled by default', () => {
      expect(toolbar).not.to.have.attribute('disabled');
    });

    it('should have Undo disabled when there is no history', () => {
      const undo = getNativeButtonByIconName('far-arrow-rotate-left');
      expect(undo).to.have.attribute('aria-disabled', 'true');
    });

    it('should have Redo disabled when there is nothing to redo', () => {
      const redo = getNativeButtonByIconName('far-arrow-rotate-right');
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

    it('should keep Undo disabled with initial content and no history', () => {
      const undo = getButtonByIconName('far-arrow-rotate-left');
      const nativeUndo = getNativeButtonByIconName('far-arrow-rotate-left');
      expect(undo).to.exist;
      expect(nativeUndo).to.have.attribute('aria-disabled', 'true');
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

      const boldButton = getButtonByIconName('editor-bold');
      expect(boldButton).to.have.attribute('fill', 'outline');
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
      const boldButton = getButtonByIconName('editor-bold')!;
      boldButton.click();
      await toolbar.updateComplete;

      expect(getButtonByIconName('editor-bold')).to.have.attribute('fill', 'outline');
    });

    it('should apply italic when Italic button is clicked', async () => {
      const italicButton = getButtonByIconName('editor-italic')!;
      italicButton.click();
      await toolbar.updateComplete;

      expect(getButtonByIconName('editor-italic')).to.have.attribute('fill', 'outline');
    });

    it('should toggle heading when H1 button is clicked', async () => {
      const h1Button = getButtonByIconName('far-h1')!;
      h1Button.click();
      await toolbar.updateComplete;

      expect(getButtonByIconName('far-h1')).to.have.attribute('fill', 'outline');
    });

    it('should deactivate heading when clicked again', async () => {
      const h1Button = getButtonByIconName('far-h1')!;
      h1Button.click();
      await toolbar.updateComplete;
      h1Button.click();
      await toolbar.updateComplete;

      expect(getButtonByIconName('far-h1')).not.to.have.attribute('fill');
    });

    it('should keep paragraph block when Blockquote action is not applicable', async () => {
      const view = editor.view!;
      view.dispatch(view.state.tr.setSelection(TextSelection.near(view.state.doc.resolve(2))));
      await toolbar.updateComplete;

      const bqButton = getButtonByIconName('far-quote-left')!;
      bqButton.click();
      await toolbar.updateComplete;

      expect(editor.view?.state.doc.firstChild?.type.name).to.equal('paragraph');
    });
  });
});
