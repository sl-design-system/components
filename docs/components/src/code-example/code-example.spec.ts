import { fixture } from '@sl-design-system/vitest-browser-lit';
import { type LitElement, html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';

// Use dynamic import from dist to avoid CSS module resolution issues in browser tests
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { DocCodeExample: DocCodeExampleClass } = await import('@sl-design-system/doc-components/code-example/code-example');

try {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  customElements.define('doc-code-example', DocCodeExampleClass);
} catch {
  /* empty */
}

describe('doc-code-example', () => {
  let el: LitElement;

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
    expect(el).to.be.instanceOf(DocCodeExampleClass);
  });

  it('should render a preview area', () => {
    const preview = el.renderRoot.querySelector('.preview');

    expect(preview).to.exist;
  });

  it('should render slotted content in the preview', () => {
    const slot = el.renderRoot.querySelector<HTMLSlotElement>('.preview slot');

    expect(slot).to.exist;
    expect(slot?.assignedElements()).to.have.length.greaterThan(0);
  });

  it('should render a source area', () => {
    const source = el.renderRoot.querySelector('.source');

    expect(source).to.exist;
  });

  it('should render the source slot', () => {
    const slot = el.renderRoot.querySelector<HTMLSlotElement>('slot[name="source"]');

    expect(slot).to.exist;
    expect(slot?.assignedElements()).to.have.length.greaterThan(0);
  });
});
