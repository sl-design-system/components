import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';

const { SiteNav, NavGroup, NavItem } = await import('@sl-design-system/doc-components/site-nav/site-nav');

try {
  customElements.define('doc-site-nav', SiteNav);
  customElements.define('doc-nav-group', NavGroup);
  customElements.define('doc-nav-item', NavItem);
} catch {
  /* empty */
}

describe('doc-site-nav', () => {
  let el: InstanceType<typeof SiteNav>;

  beforeEach(async () => {
    el = await fixture(html`<doc-site-nav></doc-site-nav>`);
  });

  it('should render', () => {
    expect(el).to.exist;
    expect(el).to.be.instanceOf(SiteNav);
  });

  it('should render a nav element', () => {
    const nav = el.renderRoot.querySelector('nav');

    expect(nav).to.exist;
  });

  it('should have an aria-label on the nav', () => {
    const nav = el.renderRoot.querySelector('nav');

    expect(nav).to.have.attribute('aria-label', 'Site navigation');
  });

  it('should render a slot for children', () => {
    const slot = el.renderRoot.querySelector('slot');

    expect(slot).to.exist;
  });

  it('should slot nav-group children', async () => {
    el = await fixture(html`
      <doc-site-nav>
        <doc-nav-group heading="Section">
          <doc-nav-item heading="Page" href="/page/"></doc-nav-item>
        </doc-nav-group>
      </doc-site-nav>
    `);

    const slot = el.renderRoot.querySelector('slot') as HTMLSlotElement,
      assigned = slot.assignedElements({ flatten: true });

    expect(assigned).to.have.length(1);
    expect(assigned[0].localName).to.equal('doc-nav-group');
  });
});
