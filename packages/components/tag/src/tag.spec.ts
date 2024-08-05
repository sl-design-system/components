import { expect, fixture } from '@open-wc/testing';
import { type Tooltip } from '@sl-design-system/tooltip';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type Tag } from './tag.js';

describe('sl-tag', () => {
  let el: Tag;

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

  it('should have proper aria when readonly is set', async () => {
    el.setAttribute('readonly', '');
    await el.updateComplete;

    // expect(el.emphasis).to.equal('subtle');
    expect(el).to.have.attribute('readonly');
    expect(el).to.have.attribute('aria-readonly', 'true');
  });

  it('should not have aria-readonly when readonly is not set', async () => {
    el.setAttribute('readonly', '');
    await el.updateComplete;

    // expect(el.emphasis).to.equal('subtle');
    expect(el).to.have.attribute('readonly');
    expect(el).to.have.attribute('aria-readonly', 'true');

    el.removeAttribute('readonly');
    await el.updateComplete;

    expect(el).not.to.have.attribute('readonly');
    expect(el).not.to.have.attribute('aria-readonly');
  });

  it('should have a tabindex of -1 when it is disabled', async () => {
    el.setAttribute('disabled', '');
    await el.updateComplete;

    expect(el).to.have.attribute('tabindex', '-1');
  });

  // it('should set proper styling when the label is too long', async () => {
  //   console.log('eeeel', el, el.renderRoot);
  // //  const labelEl = this.renderRoot.querySelector('.label') as HTMLDivElement | null;
  //   expect(el).not.to.exist;
  //   // console.log('labelEl', labelEl);
  //   //
  //   // el.style.width = '10px';
  //   // await el.updateComplete;
  //   //
  //   // await new Promise(resolve => setTimeout(resolve));
  //   //
  //   // // expect(labelEl).to.have.style('overflow', 'hidden');
  //   // await expect(labelEl?.style.overflow).to.equal('hidden');
  // });

  it('should be removable when set', async () => {
    el.setAttribute('removable', '');
    await el.updateComplete;

    const removeBtn = el.renderRoot.querySelector('.remove-button');

    expect(el).to.have.attribute('removable');
    expect(removeBtn).to.exist;
  });

  it('should not be be removed when it is removable, disabled and remove button is clicked', async () => {
    el.setAttribute('removable', '');
    await el.updateComplete;

    el.setAttribute('disabled', '');
    await el.updateComplete;

    const removeBtn = el.renderRoot.querySelector('.remove-button') as HTMLButtonElement;

    expect(el).to.have.attribute('removable');
    expect(removeBtn).to.exist;

    removeBtn?.click();
    await el.updateComplete;

    expect(el).to.exist;
  });

  it('should be removed when it is removable and remove button is clicked', async () => {
    el.setAttribute('removable', '');
    await el.updateComplete;

    const removeBtn = el.renderRoot.querySelector('.remove-button') as HTMLButtonElement;

    expect(el).to.have.attribute('removable');
    expect(removeBtn).to.exist;

    removeBtn?.click();
    await el.updateComplete;

    expect(el).not.to.exist;
  });

  it('should emit an sl-remove event when when it is removable and remove button is clicked', async () => {
    el.setAttribute('removable', '');
    await el.updateComplete;

    const removeBtn = el.renderRoot.querySelector('.remove-button') as HTMLButtonElement;

    expect(el).to.have.attribute('removable');
    expect(removeBtn).to.exist;

    const onRemove = spy();

    el.addEventListener('sl-remove', onRemove);
    removeBtn?.click();
    await el.updateComplete;

    // Wait for the event to be emitted
    await new Promise(resolve => setTimeout(resolve));

    expect(onRemove).to.have.been.calledOnce;
  });

  it('should be removed when it is removable and on pressing Delete key', async () => {
    el.setAttribute('removable', '');
    await el.updateComplete;

    el.focus();
    await sendKeys({ press: 'Delete' });

    // const removeBtn = el.renderRoot.querySelector('.remove-button') as HTMLButtonElement;
    //
    // expect(el).to.have.attribute('removable');
    // expect(removeBtn).to.exist;
    //
    // removeBtn?.click();
    await el.updateComplete;

    expect(el).not.to.exist;
  });

  it('should be removed when it is removable and on pressing Backspace key', async () => {
    el.setAttribute('removable', '');
    await el.updateComplete;

    el.focus();
    await sendKeys({ press: 'Backspace' });

    // const removeBtn = el.renderRoot.querySelector('.remove-button') as HTMLButtonElement;
    //
    // expect(el).to.have.attribute('removable');
    // expect(removeBtn).to.exist;
    //
    // removeBtn?.click();
    await el.updateComplete;

    expect(el).not.to.exist;
  });

  /*  describe('removable', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-inline-message>Inline message text</sl-inline-message>`);
    });

    it('should not display a title', () => {
      const title = el.renderRoot.querySelector('[part="title"]')!;

      expect(title).to.exist;
      expect(getComputedStyle(title).display).to.equal('none');
    });

    it('should have the no-title attribute set', () => {
      expect(el).to.have.attribute('no-title');
    });
  });*/

  describe('overflow', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tag style="inline-size: 80px" label="my label is very long"></sl-tag>`);
    });

    it('should set proper styling when the label is too long', () => {
      const labelEl = el.renderRoot.querySelector('.label') as HTMLDivElement;
      expect(labelEl).to.exist;
      expect(labelEl).to.have.style('overflow', 'hidden');
    });

    it('should have a tooltip when the label is too long', () => {
      const labelEl = el.renderRoot.querySelector('.label') as HTMLDivElement;
      expect(labelEl).to.exist;
      const tooltipEl = el.renderRoot.querySelector('sl-tooltip') as Tooltip;
      expect(tooltipEl).to.exist;
      expect(tooltipEl).to.have.trimmed.text('my label is very long');
    });
  });
});

// TODO: on keydown remove test
// TODO: mouseover test - close-hover attribute
