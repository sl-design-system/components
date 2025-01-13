import { expect, fixture, html } from '@open-wc/testing';
import { TreeNode } from './tree-node.js';

// We need to define sl-tree-node ourselves, since it's not
// part of the public API of the tree.
customElements.define('sl-tree-node', TreeNode);

describe('sl-tree-node', () => {
  let el: TreeNode;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tree-node></sl-tree-node>`);
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
  });
});
