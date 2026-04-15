import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeExample } from './code-example.js';

try {
  customElements.define('doc-code-example', CodeExample);
} catch {
  /* empty */
}

describe('doc-code-example', () => {
  let el: CodeExample;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <doc-code-example>
          <button type="button">Click me</button>
          <pre slot="source"><code>&lt;button&gt;Click me&lt;/button&gt;</code></pre>
        </doc-code-example>
      `);
    });

    it('should render', () => {
      expect(el).to.exist;
      expect(el).to.be.instanceOf(CodeExample);
    });

    it('should render a demo area', () => {
      expect(el.renderRoot.querySelector('.demo')).to.exist;
    });

    it('should render slotted content in the demo area', () => {
      const slot = el.renderRoot.querySelector<HTMLSlotElement>('.demo slot');

      expect(slot).to.exist;
      expect(slot?.assignedElements()).to.have.length.greaterThan(0);
    });

    it('should render a source area', () => {
      expect(el.renderRoot.querySelector('.source')).to.exist;
    });

    it('should render the source slot', () => {
      const slot = el.renderRoot.querySelector<HTMLSlotElement>('slot[name="source"]');

      expect(slot).to.exist;
      expect(slot?.assignedElements()).to.have.length.greaterThan(0);
    });

    it('should render a copy button', () => {
      expect(el.renderRoot.querySelector('doc-copy-button')).to.exist;
    });

    it('should render the copy button with no content when source is not set', () => {
      const copyButton = el.renderRoot.querySelector<HTMLElement & { content?: string }>('doc-copy-button');

      expect(copyButton?.content).to.be.undefined;
    });

    it('should copy the source to the clipboard on click', async () => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      el.renderRoot.querySelector<HTMLElement>('doc-copy-button')!.click();
      await el.updateComplete;

      expect(writeText).toHaveBeenCalledWith('<button>Click me</button>');

      writeText.mockRestore();
    });
  });

  describe('justify', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-code-example justify="center"></doc-code-example>`);
    });

    it('should reflect the justify state on the element', async () => {
      const demo = el.renderRoot.querySelector('.demo');

      expect(demo).to.have.style('justify-content', 'center');
    });
  });
});
