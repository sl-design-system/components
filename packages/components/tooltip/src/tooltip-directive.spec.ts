import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { type PopoverPosition } from '@sl-design-system/shared';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy, stub } from 'sinon';
import { describe, expect, it } from 'vitest';
import { tooltip } from './tooltip-directive.js';
import { Tooltip } from './tooltip.js';

describe('tooltip()', () => {
  it('should create a lazy tooltip on the host element', async () => {
    const lazySpy = spy(Tooltip, 'lazy');

    const el = await fixture(html`<div ${tooltip('content')}>Host</div>`);

    expect(Tooltip.lazy).to.have.been.calledOnce;
    expect(Tooltip.lazy).to.have.been.calledWith(el);

    lazySpy.restore();
  });

  it('should log a warning if the custom element is not defined on the document', async () => {
    const consoleWarnStub = stub(console, 'warn');

    const el: HTMLElement = await fixture(html`<div ${tooltip('content')} tabindex="0">Host</div>`);

    // Trigger the lazy tooltip creation
    el.focus();

    expect(console.warn).to.have.been.calledOnce;
    expect(console.warn).to.have.been.calledWith(
      'The sl-tooltip custom element is not defined in the document. Please make sure to register the sl-tooltip custom element in your application.'
    );

    consoleWarnStub.restore();
  });

  it('should log a warning if the custom element is not defined on the target shadow root', async () => {
    class TooltipNotDefined extends LitElement {
      override render(): TemplateResult {
        return html`<div ${tooltip('content')} tabindex="0">Host</div>`;
      }
    }

    try {
      customElements.define('tooltip-not-defined', TooltipNotDefined);
    } catch {
      // empty
    }

    const consoleWarnStub = stub(console, 'warn');

    const el: LitElement = await fixture(html`<tooltip-not-defined></tooltip-not-defined>`),
      hostEl = el.renderRoot.querySelector('div');

    // Trigger the lazy tooltip creation
    hostEl?.focus();

    expect(console.warn).to.have.been.calledOnce;
    expect(console.warn).to.have.been.calledWith(
      'The sl-tooltip custom element is not defined in the TOOLTIP-NOT-DEFINED element. Please make sure to register the sl-tooltip custom element in your application.'
    );

    consoleWarnStub.restore();
  });

  it('should use the parent shadow root to create the tooltip custom element', async () => {
    class TooltipDefined extends ScopedElementsMixin(LitElement) {
      static get scopedElements(): ScopedElementsMap {
        return {
          'sl-button': Button,
          'sl-tooltip': Tooltip
        };
      }

      override render(): TemplateResult {
        return html`<sl-button ${tooltip('content')}>Button</sl-button>`;
      }
    }

    try {
      customElements.define('tooltip-defined', TooltipDefined);
    } catch {
      // empty
    }

    const el: LitElement = await fixture(html`<tooltip-defined></tooltip-defined>`),
      button = el.renderRoot.querySelector('sl-button');

    // Append the host element to the document body
    document.body.append(el);

    // Trigger the lazy tooltip creation
    button?.focus();

    const tt = button?.nextElementSibling;
    expect(tt).to.match('sl-tooltip');
    expect(tt).to.have.text('content');
    expect(tt?.shadowRoot).be.instanceof(ShadowRoot);

    // Cleanup
    el.remove();
  });

  it('should pass tooltip options via config to the tooltip', async () => {
    try {
      if (!customElements.get('sl-tooltip')) {
        customElements.define('sl-tooltip', Tooltip);
      }
    } catch {
      // empty
    }

    const lazySpy = spy(Tooltip, 'lazy');

    const el: HTMLElement = await fixture(
      html`<div ${tooltip('content', { ariaRelation: 'label' })} tabindex="0">Host</div>`
    );

    // Trigger the lazy tooltip creation
    el.focus();

    expect(lazySpy).to.have.been.calledOnce;
    expect(lazySpy.getCall(0).args[2]).to.deep.equal({ ariaRelation: 'label' });

    const tooltipEl = el.nextElementSibling as Tooltip | null;

    expect(tooltipEl).to.exist;
    expect(el).to.have.attribute('aria-labelledby', tooltipEl?.id);

    lazySpy.restore();
  });

  it('should apply tooltip properties (position, maxWidth) from config to the tooltip', async () => {
    try {
      if (!customElements.get('sl-tooltip')) {
        customElements.define('sl-tooltip', Tooltip);
      }
    } catch {
      // empty
    }

    const el: HTMLElement = await fixture(html`
      <sl-button ${tooltip('Tooltip example', { position: 'bottom' as PopoverPosition, maxWidth: 150 })} tabindex="0"
        >Button</sl-button
      >
    `);

    // Trigger the lazy tooltip creation
    el.focus();

    const tooltipEl = el.nextElementSibling as Tooltip | null;

    expect(tooltipEl).to.exist;
    expect(tooltipEl?.position).to.equal('bottom');
    expect(tooltipEl?.maxWidth).to.equal(150);
    expect(tooltipEl).to.have.text('Tooltip example');

    // Cleanup
    el.remove();
  });
});
