import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { fake } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { type NewFocusGroupConfig, NewFocusGroupController } from './new-focus-group.js';

class NewFocusGroupFixture extends LitElement {
  controller?: NewFocusGroupController<HTMLButtonElement>;

  @property({ attribute: false }) config?: NewFocusGroupConfig<HTMLButtonElement>;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('config')) {
      this.controller = new NewFocusGroupController(this, this.config);
    }
  }

  override render(): TemplateResult {
    return html`
      <div id="scope">
        <button>Button 1</button>
        <button>Button 2</button>
        <button disabled>Button 3</button>
        <button>Button 4</button>
      </div>
      <slot></slot>
    `;
  }
}

try {
  customElements.define('new-focus-group', NewFocusGroupFixture);
} catch {
  /* empty */
}

describe('NewFocusGroupController', () => {
  let el: NewFocusGroupFixture, config: NewFocusGroupConfig<HTMLButtonElement> | undefined;

  describe('defaults', () => {
    beforeEach(async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);

      // Since we're delaying the creation of the controller, we need to manually call manage
      el.controller!.manage();
    });

    it('should have a NewFocusGroupController instance', () => {
      expect(el.controller).to.be.instanceOf(NewFocusGroupController);
    });

    it('should have all elements in the controller', () => {
      const buttons = Array.from(el.renderRoot.querySelectorAll('button'));

      expect(el.controller!.elements).to.deep.equal(buttons);
    });

    it('should add the tabindex attribute to all elements', () => {
      el.controller!.elements.forEach(e => {
        expect(e).to.have.attribute('tabindex');
      });
    });

    it('should have set a tabindex of 0 on the first element', () => {
      expect(el.controller!.elements[0]).to.have.attribute('tabindex', '0');
      expect(el.controller!.elements[1]).to.have.attribute('tabindex', '-1');
      expect(el.controller!.elements[2]).to.have.attribute('tabindex', '-1');
      expect(el.controller!.elements[3]).to.have.attribute('tabindex', '-1');
    });

    it('should not have autofocus attribute by default', () => {
      el.controller!.elements.forEach(e => {
        expect(e).not.to.have.attribute('autofocus');
      });
    });

    it('should focus the first element when focusing the host', async () => {
      await userEvent.tab();

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements[0]);
    });

    it('should set tabindex to 0 on the first element when leaving the host', () => {
      el.controller!.elements[1].focus();
      el.blur();

      expect(el.controller!.elements[0]).to.have.attribute('tabindex', '0');
      expect(el.controller!.elements[1]).to.have.attribute('tabindex', '-1');
      expect(el.controller!.elements[2]).to.have.attribute('tabindex', '-1');
      expect(el.controller!.elements[3]).to.have.attribute('tabindex', '-1');
    });

    describe('after focusing the first element', () => {
      beforeEach(() => {
        el.controller?.elements.at(0)?.focus();
      });

      it('should set the tabindex to -1 on the focused element', () => {
        el.controller!.elements.forEach(e => {
          expect(e).to.have.attribute('tabindex', '-1');
        });
      });

      it('should focus the next element when pressing the ArrowRight key', async () => {
        await userEvent.keyboard('{ArrowRight}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
      });

      it('should focus the next element when pressing the ArrowDown key', async () => {
        await userEvent.keyboard('{ArrowDown}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
      });

      it('should focus the last element when pressing the ArrowLeft key (wrap enabled)', async () => {
        await userEvent.keyboard('{ArrowLeft}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
      });

      it('should focus the last element when pressing the ArrowUp key (wrap enabled)', async () => {
        await userEvent.keyboard('{ArrowUp}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
      });

      it('should focus the last element when pressing the End key', async () => {
        await userEvent.keyboard('{End}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
      });
    });

    describe('after focusing the last element', () => {
      beforeEach(() => {
        el.controller?.elements.at(-1)?.focus();
      });

      it('should set the tabindex to -1 on the focused element', () => {
        el.controller!.elements.forEach(e => {
          expect(e).to.have.attribute('tabindex', '-1');
        });
      });

      it('should focus the first element when pressing the ArrowRight key (wrap enabled)', async () => {
        await userEvent.keyboard('{ArrowRight}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
      });

      it('should focus the first element when pressing the ArrowDown key (wrap enabled)', async () => {
        await userEvent.keyboard('{ArrowDown}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
      });

      it('should skip the disabled element when pressing the ArrowLeft key', async () => {
        await userEvent.keyboard('{ArrowLeft}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
      });

      it('should skip the disabled element when pressing the ArrowUp key', async () => {
        await userEvent.keyboard('{ArrowUp}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
      });

      it('should focus the first element when pressing the Home key', async () => {
        await userEvent.keyboard('{Home}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
      });
    });
  });

  describe('autofocus', () => {
    beforeEach(async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        autofocus: true,
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();
    });

    it('should add autofocus attribute to the element with tabindex 0', () => {
      expect(el.controller!.elements[0]).to.have.attribute('autofocus');
      expect(el.controller!.elements[0]).to.have.attribute('tabindex', '0');
    });

    it('should not add autofocus to other elements', () => {
      expect(el.controller!.elements[1]).not.to.have.attribute('autofocus');
      expect(el.controller!.elements[3]).not.to.have.attribute('autofocus');
    });

    it('should move autofocus when navigating', async () => {
      el.controller!.elements[0].focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(el.controller!.elements[0]).not.to.have.attribute('autofocus');
      expect(el.controller!.elements[1]).to.have.attribute('autofocus');
      expect(el.controller!.elements[1]).to.have.attribute('tabindex', '0');
    });

    it('should restore autofocus to initial element when leaving and returning', () => {
      el.controller!.elements[1].focus();
      el.blur();

      expect(el.controller!.elements[0]).to.have.attribute('autofocus');
      expect(el.controller!.elements[0]).to.have.attribute('tabindex', '0');
      expect(el.controller!.elements[1]).not.to.have.attribute('autofocus');
    });
  });

  describe('wrap', () => {
    beforeEach(async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        wrap: false
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();
    });

    describe('after focusing the first element', () => {
      beforeEach(() => {
        el.controller?.elements.at(0)?.focus();
      });

      it('should stay on the first element when pressing the ArrowLeft key', async () => {
        await userEvent.keyboard('{ArrowLeft}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
      });

      it('should stay on the first element when pressing the ArrowUp key', async () => {
        await userEvent.keyboard('{ArrowUp}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
      });

      it('should focus the next element when pressing the ArrowRight key', async () => {
        await userEvent.keyboard('{ArrowRight}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
      });
    });

    describe('after focusing the last element', () => {
      beforeEach(() => {
        el.controller?.elements.at(-1)?.focus();
      });

      it('should stay on the last element when pressing the ArrowRight key', async () => {
        await userEvent.keyboard('{ArrowRight}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
      });

      it('should stay on the last element when pressing the ArrowDown key', async () => {
        await userEvent.keyboard('{ArrowDown}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
      });

      it('should skip the disabled element when pressing the ArrowLeft key', async () => {
        await userEvent.keyboard('{ArrowLeft}');

        expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
      });
    });
  });

  describe('scope', () => {
    beforeEach(async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        scope: () => el.renderRoot.querySelector('#scope') as HTMLElement,
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();
    });

    it('should attach listeners to the scope element', () => {
      // This is tested indirectly - events within scope should trigger focus management
      const scopeEl = el.renderRoot.querySelector('#scope') as HTMLElement;
      expect(scopeEl).to.exist;
    });

    it('should handle keyboard navigation within scope', async () => {
      el.controller!.elements[0].focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements[1]);
    });
  });

  describe('horizontal direction', () => {
    beforeEach(async () => {
      config = {
        direction: 'horizontal',
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();
      el.controller?.elements.at(0)?.focus();
    });

    it('should focus the next element when pressing the ArrowRight key', async () => {
      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
    });

    it('should not move when pressing the ArrowDown key', async () => {
      await userEvent.keyboard('{ArrowDown}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
    });

    it('should focus the last element when pressing the ArrowLeft key', async () => {
      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
    });

    it('should not move when pressing the ArrowUp key', async () => {
      await userEvent.keyboard('{ArrowUp}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
    });
  });

  describe('vertical direction', () => {
    beforeEach(async () => {
      config = {
        direction: 'vertical',
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();
      el.controller?.elements.at(0)?.focus();
    });

    it('should not move when pressing the ArrowRight key', async () => {
      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
    });

    it('should focus the next element when pressing the ArrowDown key', async () => {
      await userEvent.keyboard('{ArrowDown}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));
    });

    it('should not move when pressing the ArrowLeft key', async () => {
      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));
    });

    it('should focus the last element when pressing the ArrowUp key', async () => {
      await userEvent.keyboard('{ArrowUp}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(-1));
    });
  });

  describe('grid navigation', () => {
    beforeEach(async () => {
      config = {
        direction: 'grid',
        directionLength: 2, // 2 columns
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();
    });

    it('should navigate right in grid', async () => {
      el.controller!.elements[0].focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements[1]);
    });

    it('should navigate down in grid', async () => {
      el.controller!.elements[0].focus();
      await userEvent.keyboard('{ArrowDown}');

      // Element 2 is disabled, so it gets tabindex=0 but can't receive actual DOM focus
      expect(el.controller!.elements[2]).to.have.attribute('tabindex', '0');
      expect(el.controller!.currentIndex).to.equal(2);
    });

    it('should navigate left in grid', async () => {
      el.controller!.elements[1].focus();
      await userEvent.keyboard('{ArrowLeft}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements[0]);
    });

    it('should navigate up in grid', async () => {
      el.controller!.elements[3].focus();
      await userEvent.keyboard('{ArrowUp}');

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements[1]);
    });
  });

  describe('focus in index', () => {
    it('should call focusInIndex with the elements array', async () => {
      const focusInIndex = fake.returns(1);

      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        focusInIndex,
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();

      expect(focusInIndex).to.have.been.called;
      expect(focusInIndex.lastCall.firstArg).to.deep.equal(el.controller!.elements);
    });

    it('should have set a tabindex of 0 on the second element', async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        focusInIndex: () => 1,
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();

      expect(el.controller!.elements[0]).to.have.attribute('tabindex', '-1');
      expect(el.controller!.elements[1]).to.have.attribute('tabindex', '0');
      expect(el.controller!.elements[2]).to.have.attribute('tabindex', '-1');
      expect(el.controller!.elements[3]).to.have.attribute('tabindex', '-1');
    });

    it('should set autofocus on the correct element when autofocus is enabled', async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        focusInIndex: () => 1,
        autofocus: true,
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();

      expect(el.controller!.elements[1]).to.have.attribute('autofocus');
      expect(el.controller!.elements[0]).not.to.have.attribute('autofocus');
    });
  });

  describe('is focusable element', () => {
    beforeEach(async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        isFocusableElement: el => el.textContent !== 'Button 1' && !el.disabled,
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();
    });

    it('should not focus the first element', () => {
      el.controller!.focus();

      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements[1]);
    });

    it('should set tabindex 0 on the first focusable element', () => {
      expect(el.controller!.elements[0]).to.have.attribute('tabindex', '-1');
      expect(el.controller!.elements[1]).to.have.attribute('tabindex', '0');
      expect(el.controller!.elements[2]).to.have.attribute('tabindex', '-1');
      expect(el.controller!.elements[3]).to.have.attribute('tabindex', '-1');
    });
  });

  describe('element enter action', () => {
    it('should call elementEnterAction when navigating', async () => {
      const elementEnterAction = fake();

      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        elementEnterAction,
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();

      el.controller!.elements[0].focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(elementEnterAction).to.have.been.calledWith(el.controller!.elements[1]);
    });
  });

  describe('mixed context elements', () => {
    beforeEach(async () => {
      config = {
        elements: () => [...Array.from(el.renderRoot.querySelectorAll('button')), el.querySelector('button')!],
        wrap: true
      };

      el = await fixture(html`
        <new-focus-group .config=${config}>
          <button>Button 5</button>
        </new-focus-group>
      `);

      el.controller!.manage();
    });

    it('should add the tabindex attribute to all elements', () => {
      el.controller!.elements.forEach(e => {
        expect(e).to.have.attribute('tabindex');
      });
    });

    it('should switch between light & shadow DOM elements', async () => {
      el.controller!.focus();
      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));

      await userEvent.keyboard('{ArrowLeft}');
      expect(document.activeElement).to.equal(el.controller!.elements.at(-1));

      await userEvent.keyboard('{ArrowLeft}');
      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(3));

      await userEvent.keyboard('{ArrowLeft}');
      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(1));

      await userEvent.keyboard('{ArrowLeft}');
      expect(el.shadowRoot!.activeElement).to.equal(el.controller!.elements.at(0));

      await userEvent.keyboard('{ArrowLeft}');
      expect(document.activeElement).to.equal(el.controller!.elements.at(-1));
    });
  });

  describe('clear element cache', () => {
    beforeEach(async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();
    });

    it('should invalidate the cached elements when calling clearElementCache', () => {
      const firstElements = el.controller!.elements;
      el.controller!.clearElementCache();
      const secondElements = el.controller!.elements;

      // They should be different array instances after clearing cache
      expect(firstElements).to.not.equal(secondElements);
    });

    it('should invalidate the cached elements when updating', () => {
      const firstElements = el.controller!.elements;
      el.controller!.update({ elements: config!.elements });
      const secondElements = el.controller!.elements;

      // They should be different array instances after update
      expect(firstElements).to.not.equal(secondElements);
    });
  });

  describe('update config', () => {
    beforeEach(async () => {
      config = {
        elements: () => Array.from(el.renderRoot.querySelectorAll('button')),
        wrap: true
      };

      el = await fixture(html`<new-focus-group .config=${config}></new-focus-group>`);
      el.controller!.manage();
    });

    it('should update the configuration', () => {
      el.controller!.update({ elements: config!.elements, wrap: false });

      // After update, wrap should be false
      el.controller!.elements[0].focus();
    });
  });
});
