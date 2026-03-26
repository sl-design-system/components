import '@sl-design-system/button/register.js';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { type Panel } from './panel.js';

describe('sl-panel', () => {
  let el: Panel;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-panel heading="Heading">Body content</sl-panel>`);
    });

    it('should not be collapsible', () => {
      expect(el.collapsible).not.to.be.true;
      expect(el).not.to.have.attribute('collapsible');
    });

    it('should not be collapsed', () => {
      expect(el.collapsed).not.to.be.true;
      expect(el).not.to.have.attribute('collapsed');
    });

    it('should not have has-actions attribute', () => {
      expect(el).not.to.have.attribute('has-actions');
    });

    it('should not render the wrapper as a button', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');

      expect(wrapper?.tagName).not.to.equal('BUTTON');
    });

    it('should not have a body with a role of "region"', () => {
      const body = el.renderRoot.querySelector('[part="body"]');

      expect(body).not.to.have.attribute('role', 'region');
    });

    it('should render the heading into the heading slot', () => {
      const heading = el.renderRoot.querySelector<HTMLSlotElement>('slot[name="heading"]');

      expect(heading).to.have.trimmed.text('Heading');
    });
  });

  describe('collapsible', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-panel collapsible heading="Heading">Body content</sl-panel>`);
    });

    it('should be collapsible', () => {
      expect(el.collapsible).to.be.true;
    });

    it('should not be collapsed', () => {
      expect(el.collapsed).not.to.be.true;
      expect(el).not.to.have.attribute('collapsed');
    });

    it('should render the toggle button', () => {
      const button = el.renderRoot.querySelector('sl-button');

      expect(button).to.exist;

      const toggleIcon = button!.querySelector('sl-icon');

      expect(toggleIcon?.name).to.equal('chevron-down');
    });

    it('should use ARIA to indicate expanded state', async () => {
      const button = el.renderRoot.querySelector('sl-button');

      expect(button).to.have.attribute('aria-controls', 'body');
      expect(button).to.have.attribute('aria-expanded', 'true');

      button?.click();
      await el.updateComplete;

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 300));

      expect(button).to.have.attribute('aria-expanded', 'false');
    });

    it('should have a body with a role of "region"', () => {
      const body = el.renderRoot.querySelector('[part="body"]');

      expect(body).to.have.attribute('role', 'region');
    });

    it('should emit an sl-toggle event when button is clicked', async () => {
      const button = el.renderRoot.querySelector('sl-button'),
        onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      button?.click();
      await el.updateComplete;

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;

      button?.click();
      await el.updateComplete;

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledTwice;
      expect(onToggle.lastCall.args[0]).to.be.false;
    });

    it('should emit an sl-toggle event when Enter is pressed while the button has focus', async () => {
      const button = el.renderRoot.querySelector('sl-button'),
        onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      button?.focus();
      await userEvent.keyboard('{Enter}');

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;

      await userEvent.keyboard('{Enter}');

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledTwice;
      expect(onToggle.lastCall.args[0]).to.be.false;
    });

    it('should emit an sl-toggle event when Space is pressed while the button has focus', async () => {
      const button = el.renderRoot.querySelector('sl-button'),
        onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      button?.focus();
      await userEvent.keyboard('{Space}');

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;

      await userEvent.keyboard('{Space}');

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledTwice;
      expect(onToggle.lastCall.args[0]).to.be.false;
    });

    it('should emit an sl-toggle event when toggle() is called', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      el.toggle();

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;

      el.toggle();

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledTwice;
      expect(onToggle.lastCall.args[0]).to.be.false;
    });

    it('should not emit intermediate sl-toggle events on rapid successive toggle calls', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      // Rapidly toggle true then false before the next animation frame
      el.toggle(true);
      el.toggle(false);

      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      // As the final state is false (same as initial), no event should be emitted
      expect(onToggle).not.to.have.been.called;
      expect(el.collapsed).not.to.be.true;

      onToggle.resetHistory();

      // Rapidly toggle true then true then true
      el.toggle(true);
      el.toggle(true);
      el.toggle(true);

      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;
      expect(el.collapsed).to.be.true;
    });
  });

  describe('slotted elements', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-panel>
          <sl-badge slot="prefix" emphasis="subtle" size="lg" variant="info">prefix badge</sl-badge>
          <div slot="heading">Custom heading</div>
          <sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">suffix badge</sl-badge>
          <sl-button slot="actions">Action</sl-button>
          <div>Content</div>
        </sl-panel>
      `);
    });

    it('should slot the heading into the heading slot', () => {
      const elements = el.renderRoot
        .querySelector<HTMLSlotElement>('slot[name="heading"]')
        ?.assignedElements({ flatten: true });

      expect(elements).to.have.lengthOf(1);
      expect(elements?.at(0)).to.match('div');
      expect(elements?.at(0)).to.have.text('Custom heading');
    });

    it('should slot the button into the actions slot', () => {
      const elements = el.renderRoot
        .querySelector<HTMLSlotElement>('slot[name="actions"]')
        ?.assignedElements({ flatten: true });

      expect(elements).to.have.lengthOf(1);
      expect(elements?.at(0)).to.match('sl-button');
      expect(elements?.at(0)).to.have.text('Action');
    });

    it('should have has-actions attribute', () => {
      expect(el).to.have.attribute('has-actions');
    });

    it('should slot the content into the default slot', () => {
      const elements = el.renderRoot
        .querySelector<HTMLSlotElement>('slot:not([name])')
        ?.assignedElements({ flatten: true });

      expect(elements).to.have.lengthOf(1);
      expect(elements?.at(0)).to.match('div');
      expect(elements?.at(0)).to.have.text('Content');
    });

    it('should slot the prefix into the prefix slot', () => {
      const elements = el.renderRoot
        .querySelector<HTMLSlotElement>('slot[name="prefix"]')
        ?.assignedElements({ flatten: true });

      expect(elements).to.have.lengthOf(1);
      expect(elements?.at(0)).to.match('sl-badge');
      expect(elements?.at(0)).to.have.text('prefix badge');
    });

    it('should slot the suffix into the suffix slot', () => {
      const elements = el.renderRoot
        .querySelector<HTMLSlotElement>('slot[name="suffix"]')
        ?.assignedElements({ flatten: true });

      expect(elements).to.have.lengthOf(1);
      expect(elements?.at(0)).to.match('sl-badge');
      expect(elements?.at(0)).to.have.text('suffix badge');
    });
  });

  describe('panel content without header', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-panel>Body content</sl-panel>`);

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));
    });

    it('should have no header attribute when there is nothing in the header', async () => {
      await el.updateComplete;
      expect(el).to.have.attribute('no-header');
    });

    it('should have the content without padding when no-padding is set', async () => {
      el.style.setProperty('--sl-panel-content-padding', '0px');
      await el.updateComplete;

      const content = el.renderRoot.querySelector('[part="content"]');

      expect(content).to.exist;
      expect(content).to.have.style('padding', '0px');
    });
  });

  describe('animations', () => {
    it('should manage no-transition attribute during lifecycle', async () => {
      const el = await fixture<Panel>(html`<sl-panel collapsible collapsed heading="Heading">Body content</sl-panel>`);

      // In connectedCallback, it should have been added
      // But fixture() might wait until first update
      await el.updateComplete;

      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(el.hasAttribute('no-transition'), 'no-transition should be removed after initialization').to.be.false;
    });

    it('should NOT remove no-transition if it was provided by the user', async () => {
      const el = await fixture<Panel>(
        html`<sl-panel collapsible collapsed no-transition heading="Heading">Body content</sl-panel>`
      );

      await el.updateComplete;
      await new Promise(resolve => requestAnimationFrame(resolve));
      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(el.hasAttribute('no-transition'), 'no-transition should STILL be present since the user provided it').to.be
        .true;
    });

    it('should disable transitions when no-transition attribute is present', async () => {
      const el = await fixture<Panel>(html`<sl-panel collapsible heading="Heading">Body content</sl-panel>`);

      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
      }

      expect(el.hasAttribute('no-transition'), 'no-transition should be removed initially').to.be.false;

      const body = el.renderRoot.querySelector('[part="body"]') as HTMLElement,
        initialProperty = getComputedStyle(body).transitionProperty,
        initialDuration = getComputedStyle(body).transitionDuration;

      el.setAttribute('no-transition', '');
      await el.updateComplete;

      const style = getComputedStyle(body),
        isNone =
          style.transitionProperty === 'none' ||
          (style.transitionProperty === 'all' && style.transitionDuration === '0s');

      expect(
        isNone,
        `Transition should be disabled when no-transition attribute is present, got: ${style.transitionProperty} ${style.transitionDuration}`
      ).to.be.true;

      el.removeAttribute('no-transition');
      await el.updateComplete;

      expect(getComputedStyle(body).transitionProperty).to.equal(initialProperty);
      expect(getComputedStyle(body).transitionDuration).to.equal(initialDuration);
    });

    it('should not animate on initial render when collapsed is true', async () => {
      const el = await fixture<Panel>(html`<sl-panel collapsible collapsed heading="Heading">Body content</sl-panel>`);

      const body = el.renderRoot.querySelector('[part="body"]') as HTMLElement;
      let transitionStarted = false;

      const onTransition = () => {
        transitionStarted = true;
      };

      body.addEventListener('transitionrun', onTransition);
      body.addEventListener('transitionstart', onTransition);

      // Allow styles and layout to settle and any potential initial transitions to start
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
      }

      body.removeEventListener('transitionrun', onTransition);
      body.removeEventListener('transitionstart', onTransition);

      expect(transitionStarted, 'Animation should NOT start on initial render when collapsed is true').to.be.false;
    });

    it('should animate normally when toggling after initialization', async () => {
      let transitionStarted = false;
      const el = await fixture<Panel>(html`<sl-panel collapsible heading="Heading">Body content</sl-panel>`);

      await el.updateComplete;

      const fallbackStyle = document.createElement('style');
      fallbackStyle.textContent = `
        [part="body"] {
          transition: grid-template-rows 300ms ease-in-out;
        }
      `;
      el.shadowRoot!.appendChild(fallbackStyle);

      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
      }

      const body = el.renderRoot.querySelector('[part="body"]') as HTMLElement;
      body.addEventListener('transitionrun', () => {
        transitionStarted = true;
      });

      el.collapsed = true;
      await el.updateComplete;

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(transitionStarted, 'Animation SHOULD start when toggling after initialization').to.be.true;
    });
  });
});
