import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { ObserveAttributesMixin } from './observe-attributes-mixin.js';

class TestElement extends ObserveAttributesMixin(LitElement, ['aria-disabled', 'aria-label']) {
  override render() {
    return html`<button><slot></slot></button>`;
  }

  override firstUpdated(): void {
    this.setAttributesTarget(this.renderRoot.querySelector('button')!);
  }
}

try {
  customElements.define('observe-attributes-test', TestElement);
} catch {
  // Element may already be defined in watch / repeated test runs
}

describe('ObserveAttributesMixin', () => {
  let el: TestElement, button: HTMLButtonElement;

  beforeEach(async () => {
    el = await fixture(html`<observe-attributes-test>Click me</observe-attributes-test>`);
    button = el.renderRoot.querySelector('button')!;
  });

  it('should include the observed attributes in the static observedAttributes', () => {
    expect(TestElement.observedAttributes).to.include('aria-disabled');
    expect(TestElement.observedAttributes).to.include('aria-label');
  });

  it('should forward an observed attribute to the target element', () => {
    el.setAttribute('aria-disabled', 'true');

    expect(button).to.have.attribute('aria-disabled', 'true');
  });

  it('should remove the attribute from the host after forwarding', () => {
    el.setAttribute('aria-disabled', 'true');

    expect(el).not.to.have.attribute('aria-disabled');
  });

  it('should forward multiple observed attributes independently', () => {
    el.setAttribute('aria-disabled', 'true');
    el.setAttribute('aria-label', 'Test label');

    expect(button).to.have.attribute('aria-disabled', 'true');
    expect(button).to.have.attribute('aria-label', 'Test label');
  });

  it('should not forward attributes that are not in the observed list', () => {
    el.setAttribute('aria-hidden', 'true');

    expect(button).not.to.have.attribute('aria-hidden');
    expect(el).to.have.attribute('aria-hidden', 'true');
  });

  it('should not forward the attribute if no target element is set', async () => {
    class NoTargetElement extends ObserveAttributesMixin(LitElement, ['aria-label']) {
      override render() {
        return html`<button><slot></slot></button>`;
      }
    }

    try {
      customElements.define('observe-attributes-no-target-test', NoTargetElement);
    } catch {
      // Already defined
    }

    const noTargetEl = await fixture<NoTargetElement>(
      html`<observe-attributes-no-target-test>Click</observe-attributes-no-target-test>`
    );
    noTargetEl.setAttribute('aria-label', 'Test');

    expect(noTargetEl).to.have.attribute('aria-label', 'Test');
    expect(noTargetEl.renderRoot.querySelector('button')).not.to.have.attribute('aria-label');
  });

  it('should update the target element when the attribute value changes', () => {
    el.setAttribute('aria-label', 'First');

    expect(button).to.have.attribute('aria-label', 'First');

    el.setAttribute('aria-label', 'Second');

    expect(button).to.have.attribute('aria-label', 'Second');
  });
});
