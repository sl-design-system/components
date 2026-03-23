import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';

const { NavGroup } = await import('@sl-design-system/doc-components/site-nav/site-nav');

try {
  customElements.define('doc-nav-group', NavGroup);
} catch {
  /* empty */
}

describe('doc-nav-group', () => {
  let el: InstanceType<typeof NavGroup>;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-nav-group></doc-nav-group>`);
    });

    it('should render', () => {
      expect(el).to.exist;
      expect(el).to.be.instanceOf(NavGroup);
    });

    it('should not have a heading property', () => {
      expect(el.heading).to.be.undefined;
    });

    it('should not be collapsible by default', () => {
      expect(el.collapsible).to.not.be.ok;
    });

    it('should not be collapsed by default', () => {
      expect(el.collapsed).to.not.be.ok;
    });

    it('should not render a heading element when none is set', () => {
      const h2 = el.renderRoot.querySelector('h2');

      expect(h2).to.not.exist;
    });

    it('should render a slot for child items', () => {
      const slot = el.renderRoot.querySelector('slot');

      expect(slot).to.exist;
    });
  });

  describe('with heading', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-nav-group heading="Getting Started"></doc-nav-group>`);
    });

    it('should have the heading property set', () => {
      expect(el.heading).to.equal('Getting Started');
    });

    it('should render an h2 element', () => {
      const h2 = el.renderRoot.querySelector('h2');

      expect(h2).to.exist;
    });

    it('should display the heading text', () => {
      const h2 = el.renderRoot.querySelector('h2');

      expect(h2?.textContent?.trim()).to.equal('Getting Started');
    });

    it('should still render a slot', () => {
      const slot = el.renderRoot.querySelector('slot');

      expect(slot).to.exist;
    });
  });

  describe('updating heading', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-nav-group heading="Initial"></doc-nav-group>`);
    });

    it('should update the heading when the property changes', async () => {
      el.heading = 'Updated';
      await el.updateComplete;

      const h2 = el.renderRoot.querySelector('h2');

      expect(h2?.textContent?.trim()).to.equal('Updated');
    });

    it('should remove the heading when set to undefined', async () => {
      el.heading = undefined;
      await el.updateComplete;

      const h2 = el.renderRoot.querySelector('h2');

      expect(h2).to.not.exist;
    });
  });

  describe('with slotted content', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <doc-nav-group heading="Section">
          <span class="test-child">Child content</span>
        </doc-nav-group>
      `);
    });

    it('should slot the child content', () => {
      const slot = el.renderRoot.querySelector('slot') as HTMLSlotElement,
        assigned = slot.assignedElements({ flatten: true });

      expect(assigned).to.have.length(1);
      expect(assigned[0]).to.have.class('test-child');
    });
  });

  describe('collapsible', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <doc-nav-group heading="Section" collapsible>
          <span class="test-child">Child content</span>
        </doc-nav-group>
      `);
    });

    it('should have the collapsible attribute', () => {
      expect(el).to.have.attribute('collapsible');
    });

    it('should render a chevron icon', () => {
      const chevron = el.renderRoot.querySelector('.chevron');

      expect(chevron).to.exist;
    });

    it('should not be collapsed by default', () => {
      expect(el.collapsed).to.not.be.ok;
    });

    it('should toggle collapsed when heading is clicked', async () => {
      const h2 = el.renderRoot.querySelector('h2')!;

      h2.click();
      await el.updateComplete;

      expect(el.collapsed).to.be.true;
      expect(el).to.have.attribute('collapsed');

      h2.click();
      await el.updateComplete;

      expect(el.collapsed).to.be.false;
      expect(el).to.not.have.attribute('collapsed');
    });

    it('should not render a chevron when not collapsible', async () => {
      el.collapsible = false;
      await el.updateComplete;

      const chevron = el.renderRoot.querySelector('.chevron');

      expect(chevron).to.not.exist;
    });
  });

  describe('collapsed', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <doc-nav-group heading="Section" collapsible collapsed>
          <span class="test-child">Child content</span>
        </doc-nav-group>
      `);
    });

    it('should have the collapsed attribute', () => {
      expect(el).to.have.attribute('collapsed');
    });

    it('should expand when heading is clicked', async () => {
      const h2 = el.renderRoot.querySelector('h2')!;

      h2.click();
      await el.updateComplete;

      expect(el.collapsed).to.be.false;
      expect(el).to.not.have.attribute('collapsed');
    });
  });
});
