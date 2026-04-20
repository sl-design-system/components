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
      const docCode = el.renderRoot.querySelector('doc-code-block') as Element & { renderRoot: ShadowRoot };

      expect(docCode?.renderRoot.querySelector('doc-copy-button')).to.exist;
    });

    it('should set the copy button content from the source slot', async () => {
      const docCode = el.renderRoot.querySelector('doc-code-block') as Element & { renderRoot: ShadowRoot };
      const copyButton = docCode?.renderRoot.querySelector<HTMLElement & { content?: string }>('doc-copy-button');

      expect(copyButton?.content).to.equal('<button>Click me</button>');
    });

    it('should copy the source to the clipboard on click', async () => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      const docCode = el.renderRoot.querySelector('doc-code-block') as Element & { renderRoot: ShadowRoot };
      const copyButtonHost = docCode?.renderRoot.querySelector('doc-copy-button') as Element & { renderRoot: ShadowRoot };
      copyButtonHost?.renderRoot.querySelector<HTMLElement>('sl-button')!.click();
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

      expect(demo).to.have.style('justify-items', 'center');
    });
  });
});
