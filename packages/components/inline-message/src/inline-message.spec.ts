import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { InlineMessage } from './inline-message.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach, { suppressErrorLogging: true });

describe('sl-inline-message', () => {
  let el: InlineMessage;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-inline-message>Inline message</sl-inline-message>`);
    });

    it('should have an automatic size of md', () => {
      expect(el).to.have.attribute('size', 'md');
      expect(el.size).to.equal('md');
    });

    it('should not have an explicit variant, but default to info', () => {
      expect(el).not.to.have.attribute('variant');
      expect(el.variant).to.be.undefined;
      expect(el.renderRoot.querySelector('sl-button')).to.have.attribute('variant', 'info');
    });

    it('should have success variant when set', async () => {
      el.variant = 'success';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'success');
      expect(el.renderRoot.querySelector('sl-button')).to.have.attribute('variant', 'success');
    });

    it('should have warning variant when set', async () => {
      el.variant = 'warning';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'warning');
      expect(el.renderRoot.querySelector('sl-button')).to.have.attribute('variant', 'warning');
    });

    it('should have danger variant when set', async () => {
      el.variant = 'danger';
      await el.updateComplete;

      expect(el).to.have.attribute('variant', 'danger');
      expect(el.renderRoot.querySelector('sl-button')).to.have.attribute('variant', 'danger');
    });

    it('should be dismissible', () => {
      expect(el).not.to.have.attribute('indismissible');
      expect(el.indismissible).not.to.be.true;
    });

    it('should be indismissible when set', async () => {
      el.indismissible = true;
      await el.updateComplete;

      expect(el).to.have.attribute('indismissible');
    });

    it('should have a close button', () => {
      const button = el.renderRoot.querySelector('sl-button');

      expect(button).to.exist;
      expect(button).to.contain('sl-icon[name="xmark"]');
    });

    it('should not have a close button when indismissible', async () => {
      el.indismissible = true;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('sl-button')).not.to.exist;
    });

    it('should remove itself when the close button is clicked', () => {
      const removeSpy = spy(el, 'remove');

      el.renderRoot.querySelector('sl-button')?.click();

      expect(removeSpy).to.have.been.calledOnce;
    });

    it('should emit an sl-dismiss event after clicking the close button', () => {
      const onDismiss = spy();

      el.addEventListener('sl-dismiss', onDismiss);
      el.renderRoot.querySelector('sl-button')?.click();

      expect(onDismiss).to.have.been.calledOnce;
    });
  });

  describe('auto size', () => {
    it('should have a size of md by default', async () => {
      el = await fixture(html`<sl-inline-message style="width: 200px">Inline message</sl-inline-message>`);

      expect(el).to.have.attribute('size', 'md');
      expect(el.size).to.equal('md');
    });

    it('should automatically change the size to lg when the text is too long', async () => {
      el = await fixture(html`
        <sl-inline-message style="width: 100px">
          In ad occaecat id magna magna eiusmod cupidatat nulla. Minim minim commodo dolore quis deserunt nisi do
          commodo ut minim aliqua et. Aliquip cupidatat laborum proident proident cupidatat consequat eiusmod qui
          deserunt. Duis fugiat fugiat irure anim incididunt. Aute est nisi quis et sint eiusmod commodo veniam ut et
          nulla eiusmod velit irure. Aute cillum amet dolore consectetur aliqua nulla ullamco ut in adipisicing. Culpa
          excepteur ullamco aliquip elit veniam minim.
        </sl-inline-message>
      `);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.have.attribute('size', 'lg');
      expect(el.size).to.equal('lg');
    });

    it('should automatically change the size to lg when a title is present', async () => {
      el = await fixture(html`
        <sl-inline-message>
          <span slot="title">Title</span>
          Inline message
        </sl-inline-message>
      `);

      expect(el).to.have.attribute('size', 'lg');
      expect(el.size).to.equal('lg');
    });
  });

  describe('no title', () => {
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
  });
});
