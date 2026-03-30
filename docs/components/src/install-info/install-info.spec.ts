import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Use dynamic import from dist to avoid CSS module resolution issues in browser tests
const { InstallInfo: InstallInfoClass } = await import('@sl-design-system/doc-components/install-info/install-info');

try {
  customElements.define('doc-install-info', InstallInfoClass);
} catch {
  /* empty */
}

describe('doc-install-info', () => {
  let el: InstanceType<typeof InstallInfoClass>;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-install-info package="button"></doc-install-info>`);
    });

    it('should render', () => {
      expect(el).to.exist;
      expect(el).to.be.instanceOf(InstallInfoClass);
    });

    it('should have a panel', () => {
      const panel = el.renderRoot.querySelector('.panel');

      expect(panel).to.exist;
    });

    it('should show the command', () => {
      const command = el.renderRoot.querySelector('.command');

      expect(command).to.have.trimmed.text('npm install');
    });

    it('should show the scope', () => {
      const scope = el.renderRoot.querySelector('.scope');

      expect(scope).to.have.trimmed.text('@sl-design-system/');
    });

    it('should show the package name', () => {
      const pkg = el.renderRoot.querySelector('.package');

      expect(pkg).to.have.trimmed.text('button');
    });
  });

  describe('syntax highlighting', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-install-info package="text-field"></doc-install-info>`);
    });

    it('should have a command span', () => {
      const command = el.renderRoot.querySelector('.command');

      expect(command).to.exist;
    });

    it('should have a scope span', () => {
      const scope = el.renderRoot.querySelector('.scope');

      expect(scope).to.exist;
    });

    it('should have a package span', () => {
      const pkg = el.renderRoot.querySelector('.package');

      expect(pkg).to.have.trimmed.text('text-field');
    });
  });

  describe('copy button', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-install-info package="button"></doc-install-info>`);
    });

    it('should have a copy button', () => {
      const copyBtn = el.renderRoot.querySelector('.copy');

      expect(copyBtn).to.exist;
    });

    it('should have an aria-label on the copy button', () => {
      const copyBtn = el.renderRoot.querySelector('.copy');

      expect(copyBtn).to.have.attribute('aria-label', 'Copy npm install @sl-design-system/button');
    });

    it('should copy the command to clipboard when clicked', async () => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      const copyBtn = el.renderRoot.querySelector<HTMLButtonElement>('.copy')!;
      copyBtn.click();

      await el.updateComplete;

      expect(writeText).toHaveBeenCalledWith('npm install @sl-design-system/button');

      writeText.mockRestore();
    });
  });
});
