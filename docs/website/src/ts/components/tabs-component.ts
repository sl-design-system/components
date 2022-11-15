import { LitElement, html, css } from 'lit';

export class Tabs extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      padding: 10px;
      background: var(--menu-second-color);
      border-radius: 3px;
    }

    .planet {
      color: var(--n-color-accent, blue);
    }
  `;

  greeting = 'I am internally created';

  element = 'Web Component';

  render() {
    return html`
      <span @click=${this.togglePlanet}
        >${this.greeting}
        <span class="planet">${this.element}</span>
      </span>
    `;
  }

  togglePlanet() {
    this.element = this.element === 'Web Component' ? 'Plain Component' : 'Web Component';
  }
}

customElements.define('ds-tabs', Tabs);
