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
            <sl-tag label="my label 1"></sl-tag>
            <sl-tag label="my label 2"></sl-tag>
            <sl-tag label="my label 3"></sl-tag>
            <sl-tag label="my label 4"></sl-tag>
            <sl-tag label="my label 5"></sl-tag>
            <sl-tag label="my label 6"></sl-tag>
            <sl-tag label="my label 7"></sl-tag>
            <sl-tag label="my label 8"></sl-tag>
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
      // expect(tooltipEl).to.have.trimmed.text('my label is very long');
    });

    it('should have a group with a tag, which contains a proper label', () => {
      const groupEl = tagList?.renderRoot.querySelector('.group');

      expect(groupEl).to.exist;

      const tag = tagList.renderRoot.querySelector('sl-tag') as Tag;

      expect(tag).to.exist;

      expect(tag.label).to.equal(6);
    });

    it('should not have a group when there is enough space', async () => {
      el.style.inlineSize = '2000px';
      await new Promise(resolve => setTimeout(resolve, 100));

      const groupEl = tagList.renderRoot.querySelector('.group');

      expect(groupEl).not.to.exist;
    });

    //
    // it('should not have aria-readonly when readonly is not set', async () => {
    //   el.setAttribute('readonly', '');
    //   await el.updateComplete;
    //
    //   expect(el).to.have.attribute('readonly');
    //   expect(el).to.have.attribute('aria-readonly', 'true');
    //
    //   el.removeAttribute('readonly');
    //   await el.updateComplete;
    //
    //   expect(el).not.to.have.attribute('readonly');
    //   expect(el).not.to.have.attribute('aria-readonly');
    // });
  });

  // describe('removable', () => {
  //   beforeEach(async () => {
  //     el = await fixture(html`<sl-tag label="my label" removable></sl-tag>`);
  //   });
  //
  //   it('should have remove button', async () => {
  //     const removeBtn = el.renderRoot.querySelector('.remove-button');
  //     expect(removeBtn).to.exist;
  //   });
  //
  //   it('should not be be removed when it is disabled and remove button is clicked', async () => {
  //     el.setAttribute('disabled', '');
  //     await el.updateComplete;
  //
  //     const removeBtn = el.renderRoot.querySelector('.remove-button') as HTMLButtonElement;
  //     expect(removeBtn).to.exist;
  //
  //     removeBtn?.click();
  //     await el.updateComplete;
  //
  //     expect(el).to.exist;
  //   });
  //
  //   it('should be removed on pressing Delete key', async () => {
  //     const removeSpy = spy(el, 'remove');
  //     const wrapper = el.renderRoot.querySelector('.wrapper') as HTMLDivElement;
  //
  //     expect(wrapper).to.exist;
  //
  //     wrapper.focus();
  //     await sendKeys({ press: 'Delete' });
  //
  //     expect(removeSpy).to.have.been.calledOnce;
  //   });
  //
  //   it('should be removed on pressing Backspace key', async () => {
  //     const removeSpy = spy(el, 'remove');
  //     const wrapper = el.renderRoot.querySelector('.wrapper') as HTMLDivElement;
  //
  //     expect(wrapper).to.exist;
  //
  //     wrapper.focus();
  //     await sendKeys({ press: 'Backspace' });
  //
  //     expect(removeSpy).to.have.been.calledOnce;
  //   });
  //
  //   it('should emit an sl-remove event when a remove button is clicked', async () => {
  //     const removeBtn = el.renderRoot.querySelector('.remove-button') as HTMLButtonElement;
  //
  //     expect(removeBtn).to.exist;
  //
  //     const onRemove = spy();
  //
  //     el.addEventListener('sl-remove', onRemove);
  //     removeBtn?.click();
  //     await el.updateComplete;
  //
  //     expect(onRemove).to.have.been.calledOnce;
  //   });
  //
  //   it('should have a proper attribute when the remove button is hovered', async () => {
  //     const removeBtn = el.renderRoot.querySelector('.remove-button') as HTMLButtonElement;
  //     expect(removeBtn).to.exist;
  //
  //     const { x, y } = {
  //       x: Math.floor(removeBtn.getBoundingClientRect().x + window.scrollX + removeBtn.getBoundingClientRect().width / 2),
  //       y: Math.floor(removeBtn.getBoundingClientRect().y + window.scrollY + removeBtn.getBoundingClientRect().height / 2)
  //     };
  //
  //     await sendMouse({ type: 'move', position: [x, y] });
  //
  //     expect(el).to.have.attribute('close-hover');
  //   });
  // });

  // describe('overflow', () => {
  //   let tag: Tag;
  //
  //   beforeEach(async () => {
  //     el = await fixture(html`
  //       <div style="inline-size: 50px;">
  //           <sl-tag label="my label is very long"></sl-tag>
  //       </div>
  //     `);
  //     tag = el.querySelector('sl-tag') as Tag;
  //
  //     // Give the resize observer time to do its thing
  //     await new Promise(resolve => setTimeout(resolve, 50));
  //   });
  //
  //   it('should set proper styling when the label is too long', async () => {
  //     const labelEl = tag.renderRoot.querySelector('.label') as HTMLDivElement;
  //
  //     expect(labelEl).to.exist;
  //     expect(labelEl.style.overflow).to.equal('hidden');
  //   });
  //
  //   it('should have a tooltip when the label is too long', () => {
  //     const labelEl = tag.renderRoot.querySelector('.label') as HTMLDivElement;
  //
  //     expect(labelEl).to.exist;
  //
  //     const tooltipEl = tag.renderRoot.querySelector('sl-tooltip') as Tooltip;
  //
  //     expect(tooltipEl).to.exist;
  //     expect(tooltipEl).to.have.trimmed.text('my label is very long');
  //   });
  // });
});
