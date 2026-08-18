import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { ElementInternalsMixin } from './element-internals.js';

class InternalsElement extends ElementInternalsMixin(LitElement) {
  override render() {
    return html`<slot></slot>`;
  }
}

try {
  customElements.define('element-internals-mixin-test', InternalsElement);
} catch {
  // Element may already be defined in watch / repeated test runs
}

class SubclassedElement extends InternalsElement {}

try {
  customElements.define('element-internals-mixin-subclass-test', SubclassedElement);
} catch {
  // Already defined
}

describe('ElementInternalsMixin', () => {
  let el: InternalsElement;

  beforeEach(async () => {
    el = await fixture(html`<element-internals-mixin-test></element-internals-mixin-test>`);
  });

  it('should attach the element internals', () => {
    expect(el.elementInternals).to.be.instanceOf(ElementInternals);
  });

  it('should attach separate internals per instance', async () => {
    const other = await fixture<InternalsElement>(
      html`<element-internals-mixin-test></element-internals-mixin-test>`
    );

    expect(other.elementInternals).to.not.equal(el.elementInternals);
  });

  it('should expose the internals to a subclass', async () => {
    const sub = await fixture<SubclassedElement>(
      html`<element-internals-mixin-subclass-test></element-internals-mixin-subclass-test>`
    );

    expect(sub.elementInternals).to.be.instanceOf(ElementInternals);
  });

  it('should apply custom states set through the internals', () => {
    el.elementInternals.states.add('custom');

    expect(el).to.match(':state(custom)');

    el.elementInternals.states.delete('custom');

    expect(el).not.to.match(':state(custom)');
  });

  it('should throw when the element attaches the internals a second time', () => {
    expect(() => el.attachInternals()).to.throw();
  });
});
