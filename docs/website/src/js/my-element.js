import {LitElement, html, css} from 'lit';

export class MyElement extends LitElement {
    static properties = {
        greeting: {},
        element: {},
    };

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

    constructor() {
        super();
        this.greeting = 'I am internally created';
        this.element = 'Web Component';
    }

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
customElements.define('my-element', MyElement);
