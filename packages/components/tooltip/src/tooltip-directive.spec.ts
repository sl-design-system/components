import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { expect, fixture } from '@open-wc/testing';
import { LitElement, type TemplateResult, html } from 'lit';
import { spy, stub } from 'sinon';
import { tooltip } from './tooltip-directive.js';
import { Tooltip } from './tooltip.js';

describe('tooltip()', () => {
  it('should create a lazy tooltip on the host element', async () => {
    spy(Tooltip, 'lazy');

    const el = await fixture(html`<div ${tooltip('content')}>Host</div>`);

    expect(Tooltip.lazy).to.have.been.calledOnce;
    expect(Tooltip.lazy).to.have.been.calledWith(el);
  });

  it('should log a warning if the custom element is not defined', async () => {
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

  it('should use the parent shadow root to create the tooltip custom element', async () => {
    class TooltipContextExample extends ScopedElementsMixin(LitElement) {
      static get scopedElements(): ScopedElementsMap {
        return {
          'sl-tooltip': Tooltip
        };
      }

      override render(): TemplateResult {
        return html`<div ${tooltip('content')} tabindex="0">Host</div>`;
      }
    }

    try {
      customElements.define('tooltip-context-example', TooltipContextExample);
    } catch {
      // empty
    }

    const el: LitElement = await fixture(html`<tooltip-context-example></tooltip-context-example>`),
      hostEl = el.renderRoot.querySelector('div');

    // Append the host element to the document body
    document.body.append(el);

    // Trigger the lazy tooltip creation
    hostEl?.focus();

    const siblingEl = hostEl?.nextElementSibling;

    expect(siblingEl).to.match('sl-tooltip');
    expect(siblingEl).to.have.text('content');
    expect(siblingEl?.shadowRoot).be.instanceof(ShadowRoot);

    // Cleanup
    el.remove();
  });
});
