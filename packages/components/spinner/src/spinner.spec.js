import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
describe('sl-spinner', () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<sl-spinner></sl-spinner>`);
  });
  it('should not have a default size', () => {
    expect(el).not.to.have.attribute('size');
  });
  it('should not have a default variant', () => {
    expect(el).not.to.have.attribute('variant');
  });
});
//# sourceMappingURL=spinner.spec.js.map
