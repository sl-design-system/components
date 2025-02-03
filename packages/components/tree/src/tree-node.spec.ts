import { expect, fixture, html } from '@open-wc/testing';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { sendKeys } from '@web/test-runner-commands';
import { spy } from 'sinon';
import { TreeNode } from './tree-node.js';

// We need to define sl-tree-node ourselves, since it's not
// part of the public API of the tree.
customElements.define('sl-tree-node', TreeNode);

describe('sl-tree-node', () => {
  let el: TreeNode;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tree-node>
          <span>Lorem</span>
        </sl-tree-node>
      `);
    });

    it('should have a treeitem role', () => {
      expect(el).to.have.attribute('role', 'treeitem');
    });

    it('should not be checked', () => {
      expect(el).not.to.have.attribute('aria-checked');
      expect(el.checked).to.not.be.true;
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).to.not.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
    });

    it('should not be expandable', () => {
      expect(el.expandable).to.not.be.true;
    });

    it('should not be expanded', () => {
      expect(el).not.to.have.attribute('aria-expanded');
      expect(el.expanded).to.not.be.true;
    });

    it('should not hide the indentation guides', () => {
      expect(el).not.to.have.attribute('hide-guides');
      expect(el.hideGuides).to.not.be.true;
    });

    it('should hide the indentation guides when set', async () => {
      el.hideGuides = true;
      await el.updateComplete;

      expect(el).to.have.attribute('hide-guides');
    });

    it('should not be indeterminate', () => {
      expect(el.indeterminate).to.not.be.true;
    });

    it('should not be the last node in the level', () => {
      expect(el.lastNodeInLevel).to.not.be.true;
    });

    it('should be at the root level', () => {
      expect(el.level).to.equal(0);
    });

    it('should not be selected', () => {
      expect(el).not.to.have.attribute('aria-selected');
      expect(el.selected).to.not.be.true;
    });

    it('should not support selection', () => {
      expect(el.selects).to.be.undefined;
    });

    it('should have a tabindex of 0', () => {
      expect(el.tabIndex).to.equal(0);
    });

    it('should not have a type', () => {
      expect(el.type).to.be.undefined;
    });

    it('should render a spinner when type "placeholder"', async () => {
      el.type = 'placeholder';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-spinner')).to.exist;
    });

    it('should render a skeleton when type "skeleton"', async () => {
      el.type = 'skeleton';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-skeleton')).to.exist;
    });
  });

  describe('expandable', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tree-node expandable>
          <span>Lorem</span>
        </sl-tree-node>
      `);
    });

    it('should be expandable', () => {
      expect(el.expandable).to.be.true;
    });

    it('should not be expanded', () => {
      expect(el).to.have.attribute('aria-expanded', 'false');
      expect(el.expanded).not.to.be.true;
    });

    it('should render an expander', () => {
      const expander = el.renderRoot.querySelector('.expander');

      expect(expander).to.exist;
      expect(expander).to.contain('sl-icon[name="chevron-right"]');
    });

    it('should toggle the expanded state when clicking the element', async () => {
      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-expanded', 'true');

      el.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-expanded', 'false');
    });

    it('should not toggle the expanded state when clicking the text', async () => {
      el.querySelector('span')?.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-expanded', 'false');
    });

    it('should toggle the expanded state when using the keyboard', async () => {
      el.focus();

      await sendKeys({ press: 'ArrowRight' });
      expect(el).to.have.attribute('aria-expanded', 'true');

      await sendKeys({ press: 'ArrowLeft' });
      expect(el).to.have.attribute('aria-expanded', 'false');
    });

    it('should toggle the expanded state by using the toggle() method', async () => {
      el.toggle();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-expanded', 'true');

      el.toggle();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-expanded', 'false');
    });

    it('should force toggle the expanded state by using the toggle(true) method', async () => {
      el.toggle();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-expanded', 'true');

      el.toggle(true);
      await el.updateComplete;

      expect(el).to.have.attribute('aria-expanded', 'true');
    });

    it('should emit a toggle event when the expanded state changes', () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', (event: CustomEvent) => {
        onToggle(event.detail);
      });

      el.click();

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.firstArg).to.be.true;

      el.toggle();

      expect(onToggle).to.have.been.calledTwice;
      expect(onToggle.lastCall.firstArg).to.be.false;
    });
  });

  describe('single select', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tree-node .node=${{ hello: true }} selects="single">
          <span>Lorem</span>
        </sl-tree-node>
      `);
    });

    it('should have an aria-selected attribute', () => {
      expect(el).to.have.attribute('aria-selected', 'false');
    });

    it('should not render a checkbox', () => {
      const checkbox = el.renderRoot.querySelector('sl-checkbox');

      expect(checkbox).to.not.exist;
    });

    it('should set the selected state when clicking the text', async () => {
      el.querySelector('span')?.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-selected', 'true');
    });

    it('should set the selected state by using the keyboard', async () => {
      el.focus();

      await sendKeys({ press: 'Enter' });

      expect(el).to.have.attribute('aria-selected', 'true');
    });

    it('should emit a select event when the text is clicked', () => {
      const onSelect = spy();

      el.addEventListener('sl-select', (event: CustomEvent) => {
        onSelect(event.detail);
      });
      el.querySelector('span')?.click();

      expect(onSelect).to.have.been.calledOnce;
      expect(onSelect.lastCall.firstArg).to.deep.equal({ hello: true });
    });
  });

  describe('multiple select', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tree-node selects="multiple">
          <span>Lorem</span>
        </sl-tree-node>
      `);
    });

    it('should have an aria-checked attribute', () => {
      expect(el).to.have.attribute('aria-checked', 'false');
    });

    it('should render a checkbox', () => {
      const checkbox = el.renderRoot.querySelector('sl-checkbox');

      expect(checkbox).to.exist;
    });

    it('should toggle the checkbox when clicking the text', async () => {
      el.querySelector('span')?.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-checked', 'true');
      expect(el.renderRoot.querySelector('sl-checkbox')).to.have.property('checked', true);

      el.querySelector('span')?.click();
      await el.updateComplete;

      expect(el).to.have.attribute('aria-checked', 'false');
      expect(el.renderRoot.querySelector('sl-checkbox')).to.have.property('checked', false);
    });

    it('should emit a change event when the checkbox is toggled', () => {
      const onChange = spy();

      el.addEventListener('sl-change', (event: SlChangeEvent) => {
        onChange(event.detail);
      });

      el.querySelector('span')?.click();

      expect(onChange).to.have.been.calledOnce;
      expect(onChange.lastCall.firstArg).to.be.true;

      el.querySelector('span')?.click();

      expect(onChange).to.have.been.calledTwice;
      expect(onChange.lastCall.firstArg).to.not.be.true;
    });
  });
});
