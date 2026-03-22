import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';

const { NavItem } = await import('@sl-design-system/doc-components/site-nav/site-nav');

try {
  customElements.define('doc-nav-item', NavItem);
} catch {
  /* empty */
}

describe('doc-nav-item', () => {
  let el: InstanceType<typeof NavItem>;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-nav-item></doc-nav-item>`);
    });

    it('should render', () => {
      expect(el).to.exist;
      expect(el).to.be.instanceOf(NavItem);
    });

    it('should not have a heading', () => {
      expect(el.heading).to.be.undefined;
    });

    it('should not have an href', () => {
      expect(el.href).to.be.undefined;
    });

    it('should not have an icon', () => {
      expect(el.icon).to.be.undefined;
    });

    it('should not be active', () => {
      expect(el.active).to.be.false;
    });

    it('should not be open', () => {
      expect(el.open).to.be.false;
    });

    it('should not be expandable', () => {
      expect(el.expandable).to.be.false;
    });

    it('should have level 0', () => {
      expect(el.level).to.equal(0);
    });
  });

  describe('leaf item', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-nav-item heading="Home" href="/"></doc-nav-item>`);
    });

    it('should render a link', () => {
      const link = el.renderRoot.querySelector('a.leaf');

      expect(link).to.exist;
    });

    it('should have the correct href', () => {
      const link = el.renderRoot.querySelector('a.leaf');

      expect(link).to.have.attribute('href', '/');
    });

    it('should display the heading text', () => {
      const link = el.renderRoot.querySelector('a.leaf');

      expect(link).to.have.trimmed.text('Home');
    });

    it('should not render a details element', () => {
      const details = el.renderRoot.querySelector('details');

      expect(details).to.not.exist;
    });

    it('should not render a chevron icon', () => {
      const chevron = el.renderRoot.querySelector('.chevron');

      expect(chevron).to.not.exist;
    });

    it('should not have aria-current when not active', () => {
      const link = el.renderRoot.querySelector('a.leaf');

      expect(link).to.not.have.attribute('aria-current');
    });
  });

  describe('active leaf item', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-nav-item heading="Home" href="/" active></doc-nav-item>`);
    });

    it('should have the active attribute reflected', () => {
      expect(el).to.have.attribute('active');
    });

    it('should set aria-current="page" on the link', () => {
      const link = el.renderRoot.querySelector('a.leaf');

      expect(link).to.have.attribute('aria-current', 'page');
    });

    it('should remove aria-current when active is set to false', async () => {
      el.active = false;
      await el.updateComplete;

      const link = el.renderRoot.querySelector('a.leaf');

      expect(link).to.not.have.attribute('aria-current');
    });
  });

  describe('item with icon', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-nav-item heading="Docs" href="/docs/" icon="far-book"></doc-nav-item>`);
    });

    it('should render an sl-icon element', () => {
      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
    });

    it('should set the icon name', () => {
      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'far-book');
    });

    it('should not render an icon when icon is not set', async () => {
      el.icon = undefined;
      await el.updateComplete;

      const icon = el.renderRoot.querySelector('a.leaf sl-icon');

      expect(icon).to.not.exist;
    });
  });

  describe('expandable item', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <doc-nav-item heading="Guides">
          <doc-nav-item heading="Intro" href="/intro/"></doc-nav-item>
          <doc-nav-item heading="Setup" href="/setup/"></doc-nav-item>
        </doc-nav-item>
      `);
    });

    it('should be expandable', () => {
      expect(el.expandable).to.be.true;
    });

    it('should render a details element', () => {
      const details = el.renderRoot.querySelector('details');

      expect(details).to.exist;
    });

    it('should render a summary', () => {
      const summary = el.renderRoot.querySelector('summary');

      expect(summary).to.exist;
    });

    it('should display the heading in the summary', () => {
      const summary = el.renderRoot.querySelector('summary');

      expect(summary).to.have.trimmed.text('Guides');
    });

    it('should render a chevron icon', () => {
      const chevron = el.renderRoot.querySelector('.chevron');

      expect(chevron).to.exist;
    });

    it('should have the chevron with name far-chevron-right', () => {
      const chevron = el.renderRoot.querySelector('.chevron');

      expect(chevron).to.have.attribute('name', 'far-chevron-right');
    });

    it('should be collapsed by default', () => {
      const details = el.renderRoot.querySelector('details');

      expect(details).to.not.have.attribute('open');
      expect(el.open).to.be.false;
    });

    it('should expand when open is set to true', async () => {
      el.open = true;
      await el.updateComplete;

      const details = el.renderRoot.querySelector('details');

      expect(details).to.have.attribute('open');
    });

    it('should collapse when open is set to false', async () => {
      el.open = true;
      await el.updateComplete;

      el.open = false;
      await el.updateComplete;

      const details = el.renderRoot.querySelector('details');

      expect(details).to.not.have.attribute('open');
    });

    it('should update the open property when details is toggled', async () => {
      const details = el.renderRoot.querySelector<HTMLDetailsElement>('details')!;

      details.open = true;
      details.dispatchEvent(new Event('toggle'));
      await el.updateComplete;

      expect(el.open).to.be.true;
    });

    it('should reflect the open attribute', async () => {
      el.open = true;
      await el.updateComplete;

      expect(el).to.have.attribute('open');
    });

    it('should render a slot for child items', () => {
      const slot = el.renderRoot.querySelector('slot');

      expect(slot).to.exist;
    });

    it('should render a span label when no href is set', () => {
      const span = el.renderRoot.querySelector('summary .label');

      expect(span).to.exist;
      expect(span).to.have.text('Guides');
    });

    it('should not render a link in the summary when no href is set', () => {
      const link = el.renderRoot.querySelector('summary a');

      expect(link).to.not.exist;
    });
  });

  describe('expandable item with href', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <doc-nav-item heading="Section" href="/section/">
          <doc-nav-item heading="Page" href="/section/page/"></doc-nav-item>
        </doc-nav-item>
      `);
    });

    it('should render a link inside the summary', () => {
      const link = el.renderRoot.querySelector('summary a');

      expect(link).to.exist;
    });

    it('should have the correct href on the summary link', () => {
      const link = el.renderRoot.querySelector('summary a');

      expect(link).to.have.attribute('href', '/section/');
    });

    it('should display the heading in the summary link', () => {
      const link = el.renderRoot.querySelector('summary a');

      expect(link).to.have.text('Section');
    });

    it('should not render a span label', () => {
      const span = el.renderRoot.querySelector('summary .label');

      expect(span).to.not.exist;
    });
  });

  describe('expandable item with icon', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <doc-nav-item heading="Contribute" icon="far-code-branch">
          <doc-nav-item heading="Code of Conduct" href="/coc/"></doc-nav-item>
        </doc-nav-item>
      `);
    });

    it('should render the icon in the summary', () => {
      const icon = el.renderRoot.querySelector('summary sl-icon:not(.chevron)');

      expect(icon).to.exist;
    });

    it('should set the correct icon name', () => {
      const icon = el.renderRoot.querySelector('summary sl-icon:not(.chevron)');

      expect(icon).to.have.attribute('name', 'far-code-branch');
    });

    it('should render both the item icon and the chevron', () => {
      const icons = el.renderRoot.querySelectorAll('summary sl-icon');

      expect(icons).to.have.length(2);
    });
  });

  describe('nesting levels', () => {
    let root: InstanceType<typeof NavItem>,
      child: InstanceType<typeof NavItem>,
      grandchild: InstanceType<typeof NavItem>;

    beforeEach(async () => {
      root = await fixture(html`
        <doc-nav-item heading="Root">
          <doc-nav-item heading="Child">
            <doc-nav-item heading="Grandchild" href="/gc/"></doc-nav-item>
          </doc-nav-item>
        </doc-nav-item>
      `);
      child = root.querySelector('doc-nav-item')!;
      grandchild = child.querySelector('doc-nav-item')!;
    });

    it('should have level 0 for the root item', () => {
      expect(root.level).to.equal(0);
    });

    it('should have level 1 for the child item', () => {
      expect(child.level).to.equal(1);
    });

    it('should have level 2 for the grandchild item', () => {
      expect(grandchild.level).to.equal(2);
    });

    it('should set --nav-level to 0 on the root', () => {
      expect(root.style.getPropertyValue('--nav-level')).to.equal('0');
    });

    it('should set --nav-level to 1 on the child', () => {
      expect(child.style.getPropertyValue('--nav-level')).to.equal('1');
    });

    it('should set --nav-level to 2 on the grandchild', () => {
      expect(grandchild.style.getPropertyValue('--nav-level')).to.equal('2');
    });
  });

  describe('initially open with children', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <doc-nav-item heading="Section" open>
          <doc-nav-item heading="Page" href="/page/"></doc-nav-item>
        </doc-nav-item>
      `);
    });

    it('should render with details open', () => {
      const details = el.renderRoot.querySelector('details');

      expect(details).to.have.attribute('open');
    });

    it('should have the open property set', () => {
      expect(el.open).to.be.true;
    });
  });
});
