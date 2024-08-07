import { expect, fixture } from '@open-wc/testing';
import { type Tooltip } from '@sl-design-system/tooltip';
import { sendKeys, sendMouse } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type Tag } from './tag.js';

describe('sl-tag', () => {
  let el: Tag;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tag label="my label"></sl-tag>`);
    });

    it('should have medium size by default', () => {
      expect(el.size).to.equal('md');
      expect(el).to.have.attribute('size', 'md');
    });

    it('should have subtle emphasis by default', () => {
      expect(el.emphasis).to.equal('subtle');
      expect(el).to.have.attribute('emphasis', 'subtle');
    });

    it('should not be removable by default', () => {
      const removeBtn = el.renderRoot.querySelector('.remove-button');

      expect(el).not.to.have.attribute('removable');
      expect(removeBtn).not.to.exist;
    });

    it('should have a tabindex of -1 when it is disabled', async () => {
      el.setAttribute('disabled', '');
      await el.updateComplete;

      const wrapper = el.renderRoot.querySelector('.wrapper') as HTMLDivElement;

      expect(wrapper).to.exist;
      expect(wrapper).to.have.attribute('tabindex', '-1');
    });
  });

  describe('readonly', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tag label="my label"></sl-tag>`);
    });

    it('should have proper aria when readonly is set', async () => {
      el.setAttribute('readonly', '');
      await el.updateComplete;

      expect(el).to.have.attribute('aria-readonly', 'true');
    });

    it('should not have aria-readonly when readonly is not set', async () => {
      el.setAttribute('readonly', '');
      await el.updateComplete;

      expect(el).to.have.attribute('readonly');
      expect(el).to.have.attribute('aria-readonly', 'true');

      el.removeAttribute('readonly');
      await el.updateComplete;

      expect(el).not.to.have.attribute('readonly');
      expect(el).not.to.have.attribute('aria-readonly');
    });
  });

  describe('removable', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tag label="my label" removable></sl-tag>`);
    });

    it('should have remove button', () => {
      const removeBtn = el.renderRoot.querySelector('.remove-button');
      expect(removeBtn).to.exist;
    });

    it('should not be be removed when it is disabled and remove button is clicked', async () => {
      el.setAttribute('disabled', '');
      await el.updateComplete;

      const removeBtn = el.renderRoot.querySelector('.remove-button') as HTMLButtonElement;
      expect(removeBtn).to.exist;

      removeBtn?.click();
      await el.updateComplete;

      expect(el).to.exist;
    });

    it('should be removed on pressing Delete key', async () => {
      const removeSpy = spy(el, 'remove');
      const wrapper = el.renderRoot.querySelector('.wrapper') as HTMLDivElement;

      expect(wrapper).to.exist;

      wrapper.focus();
      await sendKeys({ press: 'Delete' });

      expect(removeSpy).to.have.been.calledOnce;
    });

    it('should be removed on pressing Backspace key', async () => {
      const removeSpy = spy(el, 'remove');
      const wrapper = el.renderRoot.querySelector('.wrapper') as HTMLDivElement;

      expect(wrapper).to.exist;

      wrapper.focus();
      await sendKeys({ press: 'Backspace' });

      expect(removeSpy).to.have.been.calledOnce;
    });

    it('should emit an sl-remove event when a remove button is clicked', async () => {
      const removeBtn = el.renderRoot.querySelector('.remove-button') as HTMLButtonElement;

      expect(removeBtn).to.exist;

      const onRemove = spy();

      el.addEventListener('sl-remove', onRemove);
      removeBtn?.click();
      await el.updateComplete;

      expect(onRemove).to.have.been.calledOnce;
    });

    it('should have a proper attribute when the remove button is hovered', async () => {
      const removeBtn = el.renderRoot.querySelector('.remove-button') as HTMLButtonElement;
      expect(removeBtn).to.exist;

      const { x, y } = {
        x: Math.floor(
          removeBtn.getBoundingClientRect().x + window.scrollX + removeBtn.getBoundingClientRect().width / 2
        ),
        y: Math.floor(
          removeBtn.getBoundingClientRect().y + window.scrollY + removeBtn.getBoundingClientRect().height / 2
        )
      };

      await sendMouse({ type: 'move', position: [x, y] });

      expect(el).to.have.attribute('close-hover');

      await sendMouse({ type: 'move', position: [1, 1] });

      expect(el).not.to.have.attribute('close-hover');
    });
  });

  describe('overflow', () => {
    let tag: Tag;

    beforeEach(async () => {
      el = await fixture(html`
        <div style="inline-size: 50px;">
          <sl-tag label="my label is very long"></sl-tag>
        </div>
      `);
      tag = el.querySelector('sl-tag') as Tag;

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should set proper styling when the label is too long', () => {
      const labelEl = tag.renderRoot.querySelector('.label') as HTMLDivElement;

      expect(labelEl).to.exist;
      expect(labelEl.style.overflow).to.equal('hidden');
    });

    it('should have a tooltip when the label is too long', () => {
      const labelEl = tag.renderRoot.querySelector('.label') as HTMLDivElement;

      expect(labelEl).to.exist;

      const tooltipEl = tag.renderRoot.querySelector('sl-tooltip') as Tooltip;

      expect(tooltipEl).to.exist;
      expect(tooltipEl).to.have.trimmed.text('my label is very long');
    });
  });
});
