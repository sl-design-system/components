import { expect } from '@open-wc/testing';
import { html, LitElement, TemplateResult } from 'lit';
import { ValidationMixin } from './validation-mixin.js';

class ValidationTest extends ValidationMixin(LitElement) {
  override render(): TemplateResult {
    return html``;
  }
}

describe('ValidationMixin', () => {
  it('should asdkhfalkshdflkashdf', () => {
    expect(true).to.be.true;
  });
});
