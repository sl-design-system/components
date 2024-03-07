import type { TemplateResult } from 'lit';
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
console.log('loaded');
@customElement('my-counter')
export class MyCounter extends LitElement {
  @property() package?: string;

  override render(): TemplateResult {
    return html`
     <section>
  <h2 tabindex="-1">Installation</h2>

  With npm

  <div class="ds-code">
    <pre class="language-bash"><code class="language-bash">npm install @sl-design-system/${this.package}</code></pre>
  </div>
  
  With yarn

  <div class="ds-code">
    <pre class="language-bash"><code class="language-bash">yarn add @sl-design-system/${this.package}</code></pre>
  </div>

</section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-counter': MyCounter;
  }
}
