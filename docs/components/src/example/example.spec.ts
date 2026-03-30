import { fixture } from '@sl-design-system/vitest-browser-lit';
import { type LitElement, html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Use dynamic import from dist to avoid CSS module resolution issues in browser tests
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { DocExample: DocExampleClass } = await import('@sl-design-system/doc-components/example/example');

try {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  customElements.define('doc-example', DocExampleClass);
} catch {
  /* empty */
}

describe('doc-example', () => {
  describe('all languages', () => {
    let el: LitElement & { selected?: string };

    beforeEach(async () => {
      el = await fixture(html`
        <doc-example>
          <template data-lang="html"><p>Hello</p></template>
          <template data-lang="css">p { color: red; }</template>
          <template data-lang="ts">const x: number = 1;</template>
        </doc-example>
      `);
    });

    it('should render', () => {
      expect(el).to.exist;
      expect(el).to.be.instanceOf(DocExampleClass);
    });

    it('should have html selected by default', () => {
      expect(el.selected).to.equal('html');
    });

    it('should render a preview area', () => {
      const preview = el.renderRoot.querySelector('.preview');

      expect(preview).to.exist;
    });

    it('should render HTML content in the preview', () => {
      const preview = el.renderRoot.querySelector('.preview div');

      expect(preview?.innerHTML).to.contain('<p>Hello</p>');
    });

    it('should have a tablist', () => {
      const tablist = el.renderRoot.querySelector('[role="tablist"]');

      expect(tablist).to.exist;
    });

    it('should have an aria-label on the tablist', () => {
      const tablist = el.renderRoot.querySelector('[role="tablist"]');

      expect(tablist).to.have.attribute('aria-label', 'Code language');
    });

    it('should have three tabs', () => {
      const tabs = el.renderRoot.querySelectorAll('.tabs > *');

      expect(tabs).to.have.length(3);
    });

    it('should label tabs HTML, CSS, TypeScript', () => {
      const tabs = el.renderRoot.querySelectorAll('.tabs > *');

      expect(tabs[0]).to.have.trimmed.text('HTML');
      expect(tabs[1]).to.have.trimmed.text('CSS');
      expect(tabs[2]).to.have.trimmed.text('TypeScript');
    });

    it('should mark the selected tab as aria-selected', () => {
      const tab = el.renderRoot.querySelector('#tab-html');

      expect(tab).to.have.attribute('aria-selected', 'true');
    });

    it('should mark non-selected tabs as not aria-selected', () => {
      const tab = el.renderRoot.querySelector('#tab-css');

      expect(tab).to.have.attribute('aria-selected', 'false');
    });

    it('should set tabindex 0 on the selected tab', () => {
      const tab = el.renderRoot.querySelector('#tab-html');

      expect(tab).to.have.attribute('tabindex', '0');
    });

    it('should set tabindex -1 on non-selected tabs', () => {
      const tab = el.renderRoot.querySelector('#tab-css');

      expect(tab).to.have.attribute('tabindex', '-1');
    });

    it('should have a code panel', () => {
      const panel = el.renderRoot.querySelector('[role="tabpanel"]');

      expect(panel).to.exist;
    });

    it('should link the panel to the selected tab', () => {
      const panel = el.renderRoot.querySelector('[role="tabpanel"]');

      expect(panel).to.have.attribute('aria-labelledby', 'tab-html');
    });

    it('should contain syntax highlighted code', () => {
      const code = el.renderRoot.querySelector('code');

      expect(code).to.exist;
      expect(code?.querySelector('.token')).to.exist;
    });

    it('should have a copy button', () => {
      const button = el.renderRoot.querySelector('.copy');

      expect(button).to.exist;
      expect(button).to.have.attribute('aria-label', 'Copy to clipboard');
    });

    describe('tab switching', () => {
      it('should switch to CSS tab on click', async () => {
        const tab = el.renderRoot.querySelector<HTMLElement>('#tab-css');
        tab?.click();
        await el.updateComplete;

        expect(el.selected).to.equal('css');

        const panel = el.renderRoot.querySelector('[role="tabpanel"]');

        expect(panel).to.have.attribute('id', 'panel-css');
      });

      it('should switch to TypeScript tab on click', async () => {
        const tab = el.renderRoot.querySelector<HTMLElement>('#tab-ts');
        tab?.click();
        await el.updateComplete;

        expect(el.selected).to.equal('ts');
      });
    });

    describe('keyboard navigation', () => {
      it('should move to the next tab on ArrowRight', async () => {
        const tablist = el.renderRoot.querySelector('[role="tablist"]')!;

        tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        await el.updateComplete;

        expect(el.selected).to.equal('css');
      });

      it('should wrap around on ArrowRight from the last tab', async () => {
        el.selected = 'ts';
        await el.updateComplete;

        const tablist = el.renderRoot.querySelector('[role="tablist"]')!;

        tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        await el.updateComplete;

        expect(el.selected).to.equal('html');
      });

      it('should move to the previous tab on ArrowLeft', async () => {
        el.selected = 'css';
        await el.updateComplete;

        const tablist = el.renderRoot.querySelector('[role="tablist"]')!;

        tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        await el.updateComplete;

        expect(el.selected).to.equal('html');
      });

      it('should wrap around on ArrowLeft from the first tab', async () => {
        const tablist = el.renderRoot.querySelector('[role="tablist"]')!;

        tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
        await el.updateComplete;

        expect(el.selected).to.equal('ts');
      });

      it('should go to the first tab on Home', async () => {
        el.selected = 'ts';
        await el.updateComplete;

        const tablist = el.renderRoot.querySelector('[role="tablist"]')!;

        tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
        await el.updateComplete;

        expect(el.selected).to.equal('html');
      });

      it('should go to the last tab on End', async () => {
        const tablist = el.renderRoot.querySelector('[role="tablist"]')!;

        tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
        await el.updateComplete;

        expect(el.selected).to.equal('ts');
      });
    });

    describe('copy', () => {
      it('should copy raw code to the clipboard', () => {
        const writeText = vi.fn().mockResolvedValue(undefined);

        vi.stubGlobal('navigator', { clipboard: { writeText } });

        const button = el.renderRoot.querySelector<HTMLElement>('.copy')!;
        button.click();

        expect(writeText).toHaveBeenCalledWith('<p>Hello</p>');

        vi.unstubAllGlobals();
      });
    });
  });

  describe('html only', () => {
    let el: LitElement & { selected?: string };

    beforeEach(async () => {
      el = await fixture(html`
        <doc-example>
          <template data-lang="html"><p>Hello</p></template>
        </doc-example>
      `);
    });

    it('should render a preview', () => {
      const preview = el.renderRoot.querySelector('.preview');

      expect(preview).to.exist;
    });

    it('should not render a tablist', () => {
      const tablist = el.renderRoot.querySelector('[role="tablist"]');

      expect(tablist).to.not.exist;
    });

    it('should render a code panel without aria-labelledby', () => {
      const panel = el.renderRoot.querySelector('[role="tabpanel"]');

      expect(panel).to.exist;
      expect(panel).to.not.have.attribute('aria-labelledby');
    });
  });

  describe('css only', () => {
    let el: LitElement & { selected?: string };

    beforeEach(async () => {
      el = await fixture(html`
        <doc-example>
          <template data-lang="css">p { color: red; }</template>
        </doc-example>
      `);
    });

    it('should not render a preview', () => {
      const preview = el.renderRoot.querySelector('.preview');

      expect(preview).to.not.exist;
    });

    it('should not render a tablist', () => {
      const tablist = el.renderRoot.querySelector('[role="tablist"]');

      expect(tablist).to.not.exist;
    });

    it('should render a code panel', () => {
      const panel = el.renderRoot.querySelector('[role="tabpanel"]');

      expect(panel).to.exist;
    });
  });

  describe('html and css', () => {
    let el: LitElement & { selected?: string };

    beforeEach(async () => {
      el = await fixture(html`
        <doc-example>
          <template data-lang="html"><p>Hello</p></template>
          <template data-lang="css">p { color: red; }</template>
        </doc-example>
      `);
    });

    it('should render a preview', () => {
      const preview = el.renderRoot.querySelector('.preview');

      expect(preview).to.exist;
    });

    it('should have two tabs', () => {
      const tabs = el.renderRoot.querySelectorAll('.tabs > *');

      expect(tabs).to.have.length(2);
    });

    it('should apply CSS to the preview via adoptedStyleSheets', () => {
      const sheets = el.shadowRoot!.adoptedStyleSheets;

      expect(sheets.length).to.be.greaterThan(1);
    });
  });

  describe('dedenting', () => {
    let el: LitElement & { selected?: string };

    beforeEach(async () => {
      el = await fixture(html`
        <doc-example>
          <template data-lang="ts"> const a = 1; const b = 2; </template>
        </doc-example>
      `);
    });

    it('should strip common leading whitespace', () => {
      const code = el.renderRoot.querySelector('code');

      expect(code?.textContent).to.contain('const a = 1;');
      expect(code?.textContent).to.not.match(/^\s{12}/);
    });
  });
});
