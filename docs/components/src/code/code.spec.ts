import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Code } from './code.js';

try {
  customElements.define('doc-code', Code);
} catch {
  /* empty */
}

describe('doc-code', () => {
  let el: Code;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-code>:state(foo)</doc-code>`);
    });

    it('should render', () => {
      expect(el).to.exist;
      expect(el).to.be.instanceOf(Code);
    });

    it('should render a code element', () => {
      expect(el.renderRoot.querySelector('code')).to.exist;
    });

    it('should render a default slot', () => {
      const slot = el.renderRoot.querySelector<HTMLSlotElement>('slot:not([name])');

      expect(slot).to.exist;
    });

    it('should render a copy button', () => {
      expect(el.renderRoot.querySelector('doc-copy-button')).to.exist;
    });

    it('should set the copy button content from the slotted text', () => {
      const copyButton = el.renderRoot.querySelector<HTMLElement & { content?: string }>('doc-copy-button');

      expect(copyButton?.content).to.equal(':state(foo)');
    });

    it('should copy the source to the clipboard on click', async () => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      const copyButtonHost = el.renderRoot.querySelector('doc-copy-button')! as Element & { renderRoot: ShadowRoot };
      copyButtonHost.renderRoot.querySelector<HTMLElement>('sl-button')!.click();
      await el.updateComplete;

      expect(writeText).toHaveBeenCalledWith(':state(foo)');

      writeText.mockRestore();
    });
  });
});
