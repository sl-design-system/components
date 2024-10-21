import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { fake } from 'sinon';
import { type RovingTabindexConfig, RovingTabindexController } from './roving-tabindex.js';

class RovingTabindexFixture extends LitElement {
  controller?: RovingTabindexController<HTMLButtonElement>;

  @property({ attribute: false }) config?: RovingTabindexConfig<HTMLButtonElement>;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('config')) {
      this.controller = new RovingTabindexController(this, this.config);
    }
  }

  override render(): TemplateResult {
    return html`
      <button>Button 1</button>
      <button>Button 2</button>
      <button disabled>Button 3</button>
      <button>Button 4</button>
      <slot></slot>
    `;
  }
}

customElements.define('roving-tabindex', RovingTabindexFixture);

describe('RovingTabindexController', () => {
  let el: RovingTabindexFixture, config: RovingTabindexConfig<HTMLButtonElement>;

  describe('defaults', () => {
    beforeEach(async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button'))
      };

      el = await fixture(html`<roving-tabindex .config=${config}></roving-tabindex>`);

      // Since we're delaying the creation of the controller, we need to manually call manage
      el.controller!.manage();
    });

    it('should have a RovingTabindexController instance', () => {
      expect(el.controller).to.be.instanceOf(RovingTabindexController);
    });

    it('should have all elements in the controller', () => {
      const buttons = Array.from(el.renderRoot.querySelectorAll('button'));

      expect(el.controller!.elements).to.deep.equal(buttons);
    });

    it('should add the tabindex attribute to all elements', () => {
      expect(el.controller!.elements.every(e => e.hasAttribute('tabindex'))).to.be.true;
    });

    it('should have set a tabindex of 0 on the first element', () => {
      expect(el.controller!.elements.map(e => e.tabIndex)).to.deep.equal([0, -1, -1, -1]);
    });

    it('should focus the first element when focusing the host', async () => {
      await sendKeys({ press: 'Tab' });

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements[0]);
    });

    it('should set tabindex to 0 on the first element when leaving the host', () => {
      el.controller!.elements[1].focus();
      el.blur();

      expect(el.controller!.elements.map(e => e.tabIndex)).to.deep.equal([0, -1, -1, -1]);
    });

    describe('after focusing the first element', () => {
      beforeEach(() => {
        el.controller?.elements.at(0)?.focus();
      });

      it('should set the tabindex to -1 on the focused element', () => {
        expect(el.controller!.elements.map(e => e.tabIndex)).to.deep.equal([-1, -1, -1, -1]);
      });

      it('should focus the next element when pressing the ArrowRight key', async () => {
        await sendKeys({ press: 'ArrowRight' });

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
      });

      it('should focus the next element when pressing the ArrowDown key', async () => {
        await sendKeys({ press: 'ArrowDown' });

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
      });

      it('should focus the last element when pressing the ArrowLeft key', async () => {
        await sendKeys({ press: 'ArrowLeft' });

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
      });

      it('should focus the last element when pressing the ArrowUp key', async () => {
        await sendKeys({ press: 'ArrowUp' });

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
      });

      it('should focus the last element when pressing the End key', async () => {
        await sendKeys({ press: 'End' });

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
      });
    });

    describe('after focusing the last element', () => {
      beforeEach(() => {
        el.controller?.elements.at(-1)?.focus();
      });

      it('should set the tabindex to -1 on the focused element', () => {
        expect(el.controller!.elements.map(e => e.tabIndex)).to.deep.equal([-1, -1, -1, -1]);
      });

      it('should focus the first element when pressing the ArrowRight key', async () => {
        await sendKeys({ press: 'ArrowRight' });

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
      });

      it('should focus the first element when pressing the ArrowDown key', async () => {
        await sendKeys({ press: 'ArrowDown' });

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
      });

      it('should skip the disabled element when pressing the ArrowLeft key', async () => {
        await sendKeys({ press: 'ArrowLeft' });

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
      });

      it('should skip the disabled element when pressing the ArrowUp key', async () => {
        await sendKeys({ press: 'ArrowUp' });

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
      });

      it('should focus the first element when pressing the Home key', async () => {
        await sendKeys({ press: 'Home' });

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
      });
    });
  });

  describe('horizontal direction', () => {
    beforeEach(async () => {
      config = {
        direction: 'horizontal',
        elements: () => Array.from(el.renderRoot.querySelectorAll('button'))
      };

      el = await fixture(html`<roving-tabindex .config=${config}></roving-tabindex>`);

      // Since we're delaying the creation of the controller, we need to manually call manage
      el.controller!.manage();

      el.controller?.elements.at(0)?.focus();
    });

    it('should focus the next element when pressing the ArrowRight key', async () => {
      await sendKeys({ press: 'ArrowRight' });

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
    });

    it('should focus the next element when pressing the ArrowDown key', async () => {
      await sendKeys({ press: 'ArrowDown' });

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
    });

    it('should focus the last element when pressing the ArrowLeft key', async () => {
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
    });

    it('should focus the last element when pressing the ArrowUp key', async () => {
      await sendKeys({ press: 'ArrowUp' });

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
    });
  });

  describe('vertical direction', () => {
    beforeEach(async () => {
      config = {
        direction: 'vertical',
        elements: () => Array.from(el.renderRoot.querySelectorAll('button'))
      };

      el = await fixture(html`<roving-tabindex .config=${config}></roving-tabindex>`);

      // Since we're delaying the creation of the controller, we need to manually call manage
      el.controller!.manage();

      el.controller?.elements.at(0)?.focus();
    });

    it('should do nothing when pressing the ArrowRight key', async () => {
      await sendKeys({ press: 'ArrowRight' });

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
    });

    it('should focus the next element when pressing the ArrowDown key', async () => {
      await sendKeys({ press: 'ArrowDown' });

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
    });

    it('should do nothing when pressing the ArrowLeft key', async () => {
      await sendKeys({ press: 'ArrowLeft' });

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
    });

    it('should focus the last element when pressing the ArrowUp key', async () => {
      await sendKeys({ press: 'ArrowUp' });

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
    });
  });

  describe('focus in index', () => {
    it('should call focusInIndex with the elements array', async () => {
      const focusInIndex = fake.returns(1);

      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        focusInIndex
      };

      el = await fixture(html`<roving-tabindex .config=${config}></roving-tabindex>`);
      el.controller!.manage();

      expect(focusInIndex).to.have.been.called;
      expect(focusInIndex.lastCall.firstArg).to.deep.equal(el.controller!.elements);
    });

    it('should have set a tabindex of 0 on the second element', async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        focusInIndex: () => 1
      };

      el = await fixture(html`<roving-tabindex .config=${config}></roving-tabindex>`);
      el.controller!.manage();

      expect(el.controller!.elements.map(e => e.tabIndex)).to.deep.equal([-1, 0, -1, -1]);
    });
  });

  describe('is focusable element', () => {
    beforeEach(async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        isFocusableElement: el => el.textContent !== 'Button 1' && !el.disabled
      };

      el = await fixture(html`<roving-tabindex .config=${config}></roving-tabindex>`);
      el.controller!.manage();
    });

    it('should not focus the first element', () => {
      el.controller!.focus();

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements[1]);
    });
  });

  describe('mixed context elements', () => {
    beforeEach(async () => {
      config = {
        elements: () => [...Array.from(el.renderRoot.querySelectorAll('button')), el.querySelector('button')!]
      };

      el = await fixture(html`
        <roving-tabindex .config=${config}>
          <button>Button 5</button>
        </roving-tabindex>
      `);

      // Since we're delaying the creation of the controller, we need to manually call manage
      el.controller!.manage();
    });

    it('should add the tabindex attribute to all elements', () => {
      expect(el.controller!.elements.every(e => e.hasAttribute('tabindex'))).to.be.true;
    });

    it('should switch between light & shadow DOM elements', async () => {
      el.controller!.focus();
      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));

      await sendKeys({ press: 'ArrowLeft' });
      expect(document.activeElement).to.equal(el.controller!.elements.at(-1));

      await sendKeys({ press: 'ArrowLeft' });
      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(3));

      await sendKeys({ press: 'ArrowLeft' });
      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));

      await sendKeys({ press: 'ArrowLeft' });
      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));

      await sendKeys({ press: 'ArrowLeft' });
      expect(document.activeElement).to.equal(el.controller!.elements.at(-1));
    });
  });
});
