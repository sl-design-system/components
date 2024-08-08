import { expect, fixture } from '@open-wc/testing';
import { type Tooltip } from '@sl-design-system/tooltip';
import { html } from 'lit';
import '../register.js';
import { type TagList } from './tag-list.js';
import { type Tag } from './tag.js';

describe('sl-tag', () => {
  let el: TagList;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tag-list>
          <sl-tag label="my label 1"></sl-tag>
          <sl-tag label="my label 2"></sl-tag>
          <sl-tag label="my label 3"></sl-tag>
        </sl-tag-list>
      `);
    });

    it('should have medium size by default', () => {
      expect(el.size).to.equal('md');
      expect(el).to.have.attribute('size', 'md');
    });

    it('should have subtle emphasis by default', () => {
      expect(el.emphasis).to.equal('subtle');
      expect(el).to.have.attribute('emphasis', 'subtle');
    });

    it('should not be stacked by default', () => {
      expect(el).not.to.have.attribute('stacked');
    });
  });

  describe('stacked', () => {
    let tagList: TagList;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="inline-size: 200px;">
          <sl-tag-list stacked>
            <sl-tag label="my label 1" removable></sl-tag>
            <sl-tag label="my label 2" removable></sl-tag>
            <sl-tag label="my label 3" removable></sl-tag>
            <sl-tag label="my label 4" removable></sl-tag>
            <sl-tag label="my label 5" removable></sl-tag>
            <sl-tag label="my label 6" removable></sl-tag>
            <sl-tag label="my label 7" removable></sl-tag>
            <sl-tag label="my label 8" removable></sl-tag>
          </sl-tag-list>
        </div>
      `);

      tagList = el.querySelector('sl-tag-list') as TagList;

      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have a group', () => {
      const groupEl = tagList.renderRoot.querySelector('.group');

      expect(groupEl).to.exist;
    });

    it('should have a tooltip connected to a group', () => {
      const groupEl = tagList.renderRoot.querySelector('.group');

      expect(groupEl).to.exist;

      const tooltipEl = tagList.renderRoot.querySelector('sl-tooltip') as Tooltip;

      expect(tooltipEl).to.exist;
      expect(tooltipEl).to.have.trimmed.text(
        'List of hidden elements: my label 1, my label 2, my label 3, my label 4, my label 5, my label 6, my label 7'
      );
    });

    it('should have a group with a tag, which contains a proper label', () => {
      const groupEl = tagList?.renderRoot.querySelector('.group');

      expect(groupEl).to.exist;

      const tag = tagList.renderRoot.querySelector('sl-tag') as Tag;

      expect(tag).to.exist;
      expect(tag.label).to.equal(7);
    });

    it('should not have a group when there is enough space', async () => {
      el.style.inlineSize = '2000px';
      await new Promise(resolve => setTimeout(resolve, 100));

      const groupEl = tagList.renderRoot.querySelector('.group');

      expect(groupEl).not.to.exist;
    });

    it('should update a label in a tag with amount of hidden tags, when a tag is removed', async () => {
      const groupEl = tagList?.renderRoot.querySelector('.group');

      expect(groupEl).to.exist;

      const tag = tagList.renderRoot.querySelector('sl-tag') as Tag;

      expect(tag).to.exist;
      expect(tag.label).to.equal(7);

      const tags = el.querySelectorAll('sl-tag');

      expect(tags).to.exist;

      const tagButtonToRemove = tags[6]?.renderRoot.querySelector('.remove-button') as HTMLButtonElement;

      expect(tagButtonToRemove).to.exist;

      tagButtonToRemove?.click();
      document.querySelectorAll('sl-tag')[6]?.remove();

      // wait for the removal to be completed
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(tag.label).to.equal(5);
    });
  });
});
