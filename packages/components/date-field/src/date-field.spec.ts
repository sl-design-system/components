import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';

describe('sl-date-field', () => {
  it('should render properly', async () => {
    const el = await fixture(html`<sl-date-field></sl-date-field>`);
    expect(el).to.exist;
  });

  it('should accept a value', async () => {
    const el = await fixture(html`<sl-date-field value="2024-03-15"></sl-date-field>`);
    expect(el.getAttribute('value')).to.equal('2024-03-15');
  });

  it('should be accessible', async () => {
    const el = await fixture(html`<sl-date-field></sl-date-field>`);
    await expect(el).to.be.accessible();
  });
});
