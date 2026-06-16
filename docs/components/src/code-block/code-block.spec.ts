import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Code } from './code-block.js';

try {
  customElements.define('doc-code-block', Code);
} catch {
  /* empty */
}

describe('doc-code-block', () => {
  let el: Code;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <doc-code-block>
          <pre><code>const foo = 'bar';</code></pre>
        </doc-code-block>
      `);
    });

    it('should render', () => {
      expect(el).to.exist;
      expect(el).to.be.instanceOf(Code);
    });

    it('should render a default slot', () => {
      const slot = el.renderRoot.querySelector<HTMLSlotElement>('slot:not([name])');

      expect(slot).to.exist;
      expect(slot?.assignedElements()).to.have.length.greaterThan(0);
    });

    it('should render a copy button', () => {
      expect(el.renderRoot.querySelector('doc-copy-button')).to.exist;
    });

    it('should set the copy button content from the slotted pre element', () => {
      const copyButton = el.renderRoot.querySelector<HTMLElement & { content?: string }>('doc-copy-button');

      expect(copyButton?.content).to.equal("const foo = 'bar';");
    });

    it('should copy the source to the clipboard on click', async () => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      const copyButtonHost = el.renderRoot.querySelector('doc-copy-button')! as Element & { renderRoot: ShadowRoot };
      copyButtonHost.renderRoot.querySelector<HTMLElement>('sl-button')!.click();
      await el.updateComplete;

      expect(writeText).toHaveBeenCalledWith("const foo = 'bar';");

      writeText.mockRestore();
    });
  });

  describe('without pre element', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-code-block><span>some text</span></doc-code-block>`);
    });

    it('should render a copy button with no content', () => {
      const copyButton = el.renderRoot.querySelector<HTMLElement & { content?: string }>('doc-copy-button');

      expect(copyButton?.content).to.equal('');
    });
  });
});
