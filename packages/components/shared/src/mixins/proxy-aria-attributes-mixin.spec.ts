import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProxyAriaAttributesMixin } from './proxy-aria-attributes-mixin.js';

class TestElement extends ProxyAriaAttributesMixin(LitElement, [
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-details',
  'aria-disabled',
  'aria-label',
  'aria-labelledby',
  'aria-owns'
]) {
  override render() {
    return html`<button><slot></slot></button>`;
  }

  override firstUpdated(): void {
    this.setProxyTarget(this.renderRoot.querySelector('button')!);
  }
}

try {
  customElements.define('proxy-aria-test', TestElement);
} catch {
  // Element may already be defined in watch / repeated test runs
}

describe('ProxyAriaAttributesMixin', () => {
  let el: TestElement, button: HTMLButtonElement;

  beforeEach(async () => {
    el = await fixture(html`<proxy-aria-test>Click me</proxy-aria-test>`);
    button = el.renderRoot.querySelector('button')!;
  });

  it('should include the observed attributes in the static observedAttributes', () => {
    expect(TestElement.observedAttributes).to.include('aria-activedescendant');
    expect(TestElement.observedAttributes).to.include('aria-controls');
    expect(TestElement.observedAttributes).to.include('aria-describedby');
    expect(TestElement.observedAttributes).to.include('aria-details');
    expect(TestElement.observedAttributes).to.include('aria-disabled');
    expect(TestElement.observedAttributes).to.include('aria-label');
    expect(TestElement.observedAttributes).to.include('aria-labelledby');
    expect(TestElement.observedAttributes).to.include('aria-owns');
  });

  it('should forward a plain attribute to the target element', () => {
    el.setAttribute('aria-disabled', 'true');

    expect(button).to.have.attribute('aria-disabled', 'true');
  });

  it('should remove the attribute from the host after forwarding', () => {
    el.setAttribute('aria-disabled', 'true');

    expect(el).not.to.have.attribute('aria-disabled');
  });

  it('should forward multiple plain attributes independently', () => {
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
    class NoTargetElement extends ProxyAriaAttributesMixin(LitElement, ['aria-label']) {
      override render() {
        return html`<button><slot></slot></button>`;
      }
    }

    try {
      customElements.define('proxy-aria-no-target-test', NoTargetElement);
    } catch {
      // Already defined
    }

    const noTargetEl = await fixture<NoTargetElement>(
      html`<proxy-aria-no-target-test>Click</proxy-aria-no-target-test>`
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

  describe('aria-labelledby', () => {
    it('should set ariaLabelledByElements on the target', () => {
      const label = document.createElement('span');
      label.id = 'my-label';
      label.textContent = 'My label';
      el.parentElement!.prepend(label);

      el.setAttribute('aria-labelledby', 'my-label');

      expect(button.ariaLabelledByElements).to.deep.equal([label]);

      label.remove();
    });

    it('should remove the aria-labelledby attribute from the host', () => {
      const label = document.createElement('span');
      label.id = 'my-label';
      label.textContent = 'My label';
      el.parentElement!.prepend(label);

      el.setAttribute('aria-labelledby', 'my-label');

      expect(el).not.to.have.attribute('aria-labelledby');

      label.remove();
    });

    it('should resolve multiple space-separated IDs', () => {
      const label1 = document.createElement('span');
      label1.id = 'label-1';
      label1.textContent = 'First';

      const label2 = document.createElement('span');
      label2.id = 'label-2';
      label2.textContent = 'Second';

      el.parentElement!.prepend(label1, label2);

      el.setAttribute('aria-labelledby', 'label-1 label-2');

      expect(button.ariaLabelledByElements).to.deep.equal([label1, label2]);

      label1.remove();
      label2.remove();
    });

    it('should set an empty array when the referenced element does not exist', () => {
      el.setAttribute('aria-labelledby', 'nonexistent');

      expect(button.ariaLabelledByElements).to.deep.equal([]);
    });
  });

  describe('aria-describedby', () => {
    it('should set ariaDescribedByElements on the target', () => {
      const desc = document.createElement('span');
      desc.id = 'my-desc';
      desc.textContent = 'Description';
      el.parentElement!.prepend(desc);

      el.setAttribute('aria-describedby', 'my-desc');

      expect(button.ariaDescribedByElements).to.deep.equal([desc]);

      desc.remove();
    });

    it('should remove the aria-describedby attribute from the host', () => {
      const desc = document.createElement('span');
      desc.id = 'my-desc';
      desc.textContent = 'Description';
      el.parentElement!.prepend(desc);

      el.setAttribute('aria-describedby', 'my-desc');

      expect(el).not.to.have.attribute('aria-describedby');

      desc.remove();
    });
  });

  describe('aria-controls', () => {
    it('should set ariaControlsElements on the target', () => {
      const panel = document.createElement('div');
      panel.id = 'my-panel';
      el.parentElement!.prepend(panel);

      el.setAttribute('aria-controls', 'my-panel');

      expect(button.ariaControlsElements).to.deep.equal([panel]);

      panel.remove();
    });

    it('should remove the aria-controls attribute from the host', () => {
      const panel = document.createElement('div');
      panel.id = 'my-panel';
      el.parentElement!.prepend(panel);

      el.setAttribute('aria-controls', 'my-panel');

      expect(el).not.to.have.attribute('aria-controls');

      panel.remove();
    });
  });

  describe('aria-owns', () => {
    it('should set ariaOwnsElements on the target', () => {
      const owned = document.createElement('div');
      owned.id = 'my-owned';
      el.parentElement!.prepend(owned);

      el.setAttribute('aria-owns', 'my-owned');

      expect(button.ariaOwnsElements).to.deep.equal([owned]);

      owned.remove();
    });

    it('should remove the aria-owns attribute from the host', () => {
      const owned = document.createElement('div');
      owned.id = 'my-owned';
      el.parentElement!.prepend(owned);

      el.setAttribute('aria-owns', 'my-owned');

      expect(el).not.to.have.attribute('aria-owns');

      owned.remove();
    });
  });

  describe('aria-details', () => {
    it('should set ariaDetailsElements on the target', () => {
      const details = document.createElement('div');
      details.id = 'my-details';
      el.parentElement!.prepend(details);

      el.setAttribute('aria-details', 'my-details');

      expect(button.ariaDetailsElements).to.deep.equal([details]);

      details.remove();
    });

    it('should remove the aria-details attribute from the host', () => {
      const details = document.createElement('div');
      details.id = 'my-details';
      el.parentElement!.prepend(details);

      el.setAttribute('aria-details', 'my-details');

      expect(el).not.to.have.attribute('aria-details');

      details.remove();
    });
  });

  describe('aria-activedescendant', () => {
    it('should set ariaActiveDescendantElement on the target', () => {
      const option = document.createElement('div');
      option.id = 'my-option';
      el.parentElement!.prepend(option);

      el.setAttribute('aria-activedescendant', 'my-option');

      expect(button.ariaActiveDescendantElement).to.equal(option);

      option.remove();
    });

    it('should remove the aria-activedescendant attribute from the host', () => {
      const option = document.createElement('div');
      option.id = 'my-option';
      el.parentElement!.prepend(option);

      el.setAttribute('aria-activedescendant', 'my-option');

      expect(el).not.to.have.attribute('aria-activedescendant');

      option.remove();
    });
  });

  describe('nested mixin', () => {
    class InnerElement extends ProxyAriaAttributesMixin(LitElement, ['aria-labelledby']) {
      override render() {
        return html`<button><slot></slot></button>`;
      }

      override firstUpdated(): void {
        this.setProxyTarget(this.renderRoot.querySelector('button')!);
      }
    }

    class OuterElement extends ProxyAriaAttributesMixin(LitElement, ['aria-labelledby']) {
      override render() {
        return html`<proxy-aria-inner><slot></slot></proxy-aria-inner>`;
      }

      override firstUpdated(): void {
        this.setProxyTarget(this.renderRoot.querySelector('proxy-aria-inner')!);
      }
    }

    try {
      customElements.define('proxy-aria-inner', InnerElement);
      customElements.define('proxy-aria-outer', OuterElement);
    } catch {
      // Already defined
    }

    it('should set ariaLabelledByElements on the deepest target element', async () => {
      const label = document.createElement('span');
      label.id = 'nested-label';
      label.textContent = 'Nested label';
      document.body.prepend(label);

      const outer = await fixture<OuterElement>(html`<proxy-aria-outer>Click me</proxy-aria-outer>`);
      const inner = outer.renderRoot.querySelector('proxy-aria-inner') as InnerElement;
      const deepButton = inner.renderRoot.querySelector('button')!;

      outer.setAttribute('aria-labelledby', 'nested-label');

      expect(deepButton.ariaLabelledByElements).to.deep.equal([label]);

      label.remove();
    });
  });

  describe('no observedAttributes specified', () => {
    let defaultEl: InstanceType<typeof DefaultElement>, defaultButton: HTMLButtonElement;

    class DefaultElement extends ProxyAriaAttributesMixin(LitElement) {
      override render() {
        return html`<button><slot></slot></button>`;
      }

      override firstUpdated(): void {
        this.setProxyTarget(this.renderRoot.querySelector('button')!);
      }
    }

    try {
      customElements.define('proxy-aria-default-test', DefaultElement);
    } catch {
      // Already defined
    }

    beforeEach(async () => {
      defaultEl = await fixture(html`<proxy-aria-default-test>Click me</proxy-aria-default-test>`);
      defaultButton = defaultEl.renderRoot.querySelector('button')!;
    });

    it('should forward any aria-* attribute to the target', async () => {
      defaultEl.setAttribute('aria-disabled', 'true');

      // MutationObserver callbacks are async
      await new Promise(resolve => setTimeout(resolve));

      expect(defaultButton).to.have.attribute('aria-disabled', 'true');
      expect(defaultEl).not.to.have.attribute('aria-disabled');
    });

    it('should resolve aria-labelledby to ariaLabelledByElements', async () => {
      const label = document.createElement('span');
      label.id = 'default-label';
      label.textContent = 'Label';
      defaultEl.parentElement!.prepend(label);

      defaultEl.setAttribute('aria-labelledby', 'default-label');

      // MutationObserver callbacks are async
      await new Promise(resolve => setTimeout(resolve));

      expect(defaultButton.ariaLabelledByElements).to.deep.equal([label]);
      expect(defaultEl).not.to.have.attribute('aria-labelledby');

      label.remove();
    });

    it('should forward pre-existing aria-* attributes after the target is set', async () => {
      const el = document.createElement('proxy-aria-default-test') as InstanceType<typeof DefaultElement>;
      el.setAttribute('aria-label', 'Pre-existing');
      el.textContent = 'Click me';

      document.body.appendChild(el);
      await el.updateComplete;

      const btn = el.renderRoot.querySelector('button')!;

      expect(btn).to.have.attribute('aria-label', 'Pre-existing');
      expect(el).not.to.have.attribute('aria-label');

      el.remove();
    });
  });
});
