import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CopyButton } from './copy-button.js';

try {
  customElements.define('doc-copy-button', CopyButton);
} catch {
  /* empty */
}

describe('doc-copy-button', () => {
  let el: CopyButton;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-copy-button></doc-copy-button>`);
    });

    it('should render', () => {
      expect(el).to.exist;
      expect(el).to.be.instanceOf(CopyButton);
    });

    it('should have a copy icon', () => {
      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'far-copy');
    });

    it('should have ghost fill by default', () => {
      expect(el.fill).to.equal('ghost');
    });

    it('should have the button role', () => {
      expect(el).to.have.attribute('role', 'button');
    });

    it('should have cursor copy style', () => {
      expect(getComputedStyle(el).cursor).to.equal('copy');
    });

    it('should not have a target by default', () => {
      expect(el.target).to.be.undefined;
    });
  });

  describe('target', () => {
    beforeEach(async () => {
      // Create a target element in the document
      const target = document.createElement('div');
      target.id = 'copy-target';
      target.textContent = 'Text to copy';
      document.body.appendChild(target);

      el = await fixture(html`<doc-copy-button target="copy-target"></doc-copy-button>`);
    });

    afterEach(() => {
      document.getElementById('copy-target')?.remove();
    });

    it('should have the target property set', () => {
      expect(el.target).to.equal('copy-target');
    });

    it('should copy the target text to the clipboard on click', async () => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      el.click();
      await el.updateComplete;

      expect(writeText).toHaveBeenCalledWith('Text to copy');

      writeText.mockRestore();
    });

    it('should trim the target text before copying', async () => {
      const target = document.getElementById('copy-target')!;
      target.textContent = '  padded text  ';

      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      el.click();
      await el.updateComplete;

      expect(writeText).toHaveBeenCalledWith('padded text');

      writeText.mockRestore();
    });
  });

  describe('no target', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-copy-button></doc-copy-button>`);
    });

    it('should not attempt to copy when no target is set', async () => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      el.click();
      await el.updateComplete;

      expect(writeText).not.toHaveBeenCalled();

      writeText.mockRestore();
    });
  });

  describe('nonexistent target', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-copy-button target="nonexistent"></doc-copy-button>`);
    });

    it('should not attempt to copy when the target element does not exist', async () => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      el.click();
      await el.updateComplete;

      expect(writeText).not.toHaveBeenCalled();

      writeText.mockRestore();
    });
  });

  describe('fill override', () => {
    it('should allow overriding the fill', async () => {
      el = await fixture(html`<doc-copy-button fill="outline"></doc-copy-button>`);

      expect(el.fill).to.equal('outline');
    });
  });
});
