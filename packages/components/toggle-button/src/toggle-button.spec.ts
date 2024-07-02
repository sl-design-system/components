import { expect, fixture } from '@open-wc/testing';
import { a11ySnapshot } from '@web/test-runner-commands';
import { html } from 'lit';
import '../register.js';
import { type ToggleButton } from './toggle-button.js';

describe('sl-toggle-button', () => {
  let el: ToggleButton;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<sl-toggle-button>
          <sl-icon name="far-gear"></sl-icon>
          <sl-icon name="fas-gear" slot="pressed"></sl-icon>
        </sl-toggle-button>`
      );
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have a button role', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-confusing-void-expression
      const { role } = (await a11ySnapshot({ selector: 'sl-toggle-button' })) as any;

      expect(role).to.equal('button');
    });

    it('should have a tabindex', () => {
      expect(el).to.have.attribute('tabindex', '0');
    });

    it('should allow for a custom tabindex', async () => {
      el.tabIndex = 10;
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '10');
    });

    it('should remember the tabindex when being enabled', async () => {
      el.tabIndex = 10;
      await el.updateComplete;

      el.setAttribute('disabled', '');
      await el.updateComplete;

      el.removeAttribute('disabled');
      await el.updateComplete;

      expect(el).to.have.attribute('tabindex', '10');
    });

    it('should be size medium', () => {
      expect(el).to.have.attribute('size', 'md');
    });

    it('should be small size when set', async () => {
      el.size = 'sm';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'sm');
    });

    it('should be large size when set', async () => {
      el.size = 'lg';
      await el.updateComplete;

      expect(el).to.have.attribute('size', 'lg');
    });

    it('should have a default fill', () => {
      expect(el).to.have.attribute('fill', 'ghost');
    });
  });
});
