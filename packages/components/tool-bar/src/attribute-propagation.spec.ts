import { faBell, faGear, faPen } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type ToolBar } from './tool-bar.js';

Icon.register(faBell, faGear, faPen);

describe('fill', () => {
  let el: ToolBar;

  beforeEach(async () => {
    el = await fixture(html`
      <sl-tool-bar style="inline-size: 400px">
        <sl-button>
          <sl-icon name="far-gear"></sl-icon>
          Button 1
        </sl-button>
        <sl-menu-button>
          <div slot="button">Menu</div>
          <sl-menu-item>Item 1</sl-menu-item>
        </sl-menu-button>
        <sl-button>
          <sl-icon name="far-pen"></sl-icon>
          Button 2
        </sl-button>
      </sl-tool-bar>
    `);

    await new Promise(resolve => setTimeout(resolve, 50));
  });

  it('should not have a fill by default', () => {
    expect(el.fill).to.be.undefined;
  });

  it('should have a fill when set', async () => {
    el.fill = 'ghost';
    await el.updateComplete;

    expect(el.fill).to.equal('ghost');
  });

  it('should update child button fill attributes when fill is set to ghost', async () => {
    el.fill = 'ghost';
    await el.updateComplete;

    const buttons = el.querySelectorAll('sl-button');
    expect(buttons[0]).to.have.attribute('fill', 'ghost');
    expect(buttons[1]).to.have.attribute('fill', 'ghost');
  });

  it('should update child button fill attributes when fill is set to outline', async () => {
    el.fill = 'outline';
    await el.updateComplete;

    const buttons = el.querySelectorAll('sl-button');
    expect(buttons[0]).to.have.attribute('fill', 'outline');
    expect(buttons[1]).to.have.attribute('fill', 'outline');
  });

  it('should update child menu button fill attributes when fill is set', async () => {
    el.fill = 'ghost';
    await el.updateComplete;

    const menuButton = el.querySelector('sl-menu-button');
    expect(menuButton).to.have.attribute('fill', 'ghost');
  });

  it('should handle dynamic changes to the fill property', async () => {
    el.fill = 'ghost';
    await el.updateComplete;

    const buttons = el.querySelectorAll('sl-button');
    expect(buttons[0]).to.have.attribute('fill', 'ghost');

    el.fill = 'outline';
    await el.updateComplete;

    expect(buttons[0]).to.have.attribute('fill', 'outline');
    expect(buttons[1]).to.have.attribute('fill', 'outline');
  });

  it('should apply fill to the overflow menu button when items overflow', async () => {
    el.fill = 'ghost';
    el.style.inlineSize = '48px';
    await el.updateComplete;

    await new Promise(resolve => setTimeout(resolve, 100));

    const overflowMenuButton = el.shadowRoot?.querySelector('sl-menu-button');
    expect(overflowMenuButton).to.exist;
    expect(overflowMenuButton).to.have.attribute('fill', 'ghost');
  });

  it('should update overflow menu button fill when fill changes dynamically', async () => {
    el.style.inlineSize = '48px';
    await el.updateComplete;

    await new Promise(resolve => setTimeout(resolve, 100));

    el.fill = 'outline';
    await el.updateComplete;

    const overflowMenuButton = el.shadowRoot?.querySelector('sl-menu-button');
    expect(overflowMenuButton).to.exist;
    expect(overflowMenuButton).to.have.attribute('fill', 'outline');
  });

  it('should update nested buttons inside child elements', async () => {
    const wrapper = document.createElement('div');
    const nestedButton = document.createElement('sl-button');
    nestedButton.textContent = 'Nested Button';
    wrapper.appendChild(nestedButton);
    el.appendChild(wrapper);
    await el.updateComplete;

    el.fill = 'ghost';
    await el.updateComplete;

    expect(nestedButton).to.have.attribute('fill', 'ghost');
  });

  it('should not override an explicit child fill attribute', async () => {
    const button = document.createElement('sl-button');
    button.setAttribute('fill', 'solid');
    button.textContent = 'Explicit fill';
    el.appendChild(button);
    await el.updateComplete;

    el.fill = 'ghost';
    await el.updateComplete;

    expect(button).to.have.attribute('fill', 'solid');
  });

  it('should not override an explicit child menu-button fill attribute', async () => {
    const menuButton = el.querySelector('sl-menu-button');

    expect(menuButton).to.exist;

    menuButton!.setAttribute('fill', 'outline');

    el.fill = 'ghost';
    await el.updateComplete;

    expect(menuButton!).to.have.attribute('fill', 'outline');
  });
});

describe('inverted', () => {
  let el: ToolBar;

  beforeEach(async () => {
    el = await fixture(html`
      <sl-tool-bar style="inline-size: 400px">
        <sl-button>
          <sl-icon name="far-gear"></sl-icon>
          Button 1
        </sl-button>
        <sl-menu-button>
          <div slot="button">Menu</div>
          <sl-menu-item>Item 1</sl-menu-item>
        </sl-menu-button>
        <sl-button>
          <sl-icon name="far-pen"></sl-icon>
          Button 2
        </sl-button>
      </sl-tool-bar>
    `);

    await new Promise(resolve => setTimeout(resolve, 50));
  });

  it('should not be inverted by default', () => {
    expect(el.inverted).not.to.be.true;
  });

  it('should set variant attribute on child buttons when inverted is true', async () => {
    el.inverted = true;
    await el.updateComplete;

    const buttons = el.querySelectorAll('sl-button');
    expect(buttons[0]).to.have.attribute('variant', 'inverted');
    expect(buttons[1]).to.have.attribute('variant', 'inverted');
  });

  it('should set variant attribute on child menu buttons when inverted is true', async () => {
    el.inverted = true;
    await el.updateComplete;

    const menuButton = el.querySelector('sl-menu-button');
    expect(menuButton).to.have.attribute('variant', 'inverted');
  });

  it('should handle dynamic changes to inverted property', async () => {
    const buttons = el.querySelectorAll('sl-button');

    el.inverted = true;
    await el.updateComplete;
    expect(buttons[0]).to.have.attribute('variant', 'inverted');
  });

  it('should update nested buttons inside child elements when inverted changes', async () => {
    const wrapper = document.createElement('div');
    const nestedButton = document.createElement('sl-button');
    nestedButton.textContent = 'Nested Button';
    wrapper.appendChild(nestedButton);
    el.appendChild(wrapper);
    await el.updateComplete;

    el.inverted = true;
    await el.updateComplete;

    expect(nestedButton).to.have.attribute('variant', 'inverted');
  });

  it('should apply inverted variant to overflow menu button when items overflow', async () => {
    el.inverted = true;
    el.style.inlineSize = '48px';
    await el.updateComplete;

    await new Promise(resolve => setTimeout(resolve, 100));

    const overflowMenuButton = el.shadowRoot?.querySelector('sl-menu-button');
    expect(overflowMenuButton).to.exist;
    expect(overflowMenuButton).to.have.attribute('variant', 'inverted');
  });

  it('should not override an explicit child variant attribute when inverted is true', async () => {
    const button = document.createElement('sl-button');
    button.setAttribute('variant', 'primary');
    button.textContent = 'Explicit variant';
    el.appendChild(button);
    await el.updateComplete;

    el.inverted = true;
    await el.updateComplete;

    expect(button).to.have.attribute('variant', 'primary');
  });

  it('should not override an explicit child menu-button variant when inverted is true', async () => {
    const menuButton = el.querySelector('sl-menu-button');

    expect(menuButton).to.exist;

    menuButton!.setAttribute('variant', 'primary');

    el.inverted = true;
    await el.updateComplete;

    expect(menuButton!).to.have.attribute('variant', 'primary');
  });

  it('should not override an explicit child divider inverted attribute', async () => {
    const explicitDivider = document.createElement('sl-tool-bar-divider');
    explicitDivider.setAttribute('inverted', '');
    el.appendChild(explicitDivider);
    await el.updateComplete;

    el.inverted = false;
    await el.updateComplete;

    expect(explicitDivider).to.have.attribute('inverted');
  });
});

describe('updateChildAttributes (integration)', () => {
  let el: ToolBar;

  beforeEach(async () => {
    el = await fixture(html`
      <sl-tool-bar style="inline-size: 400px">
        <sl-button>
          <sl-icon name="far-gear"></sl-icon>
          Button 1
        </sl-button>
        <sl-menu-button>
          <div slot="button">Menu</div>
          <sl-menu-item>Item 1</sl-menu-item>
        </sl-menu-button>
        <div id="wrapper">
          <sl-button>
            <sl-icon name="far-pen"></sl-icon>
            Nested Button
          </sl-button>
          <sl-menu-button>
            <div slot="button">Nested Menu</div>
            <sl-menu-item>Item 2</sl-menu-item>
          </sl-menu-button>
        </div>
      </sl-tool-bar>
    `);

    await new Promise(resolve => setTimeout(resolve, 50));
  });

  it('should set fill attribute on direct child buttons when fill is defined', async () => {
    el.fill = 'ghost';
    await el.updateComplete;

    const directButton = el.querySelector(':scope > sl-button');
    expect(directButton).to.have.attribute('fill', 'ghost');
  });

  it('should set fill attribute on direct child menu-buttons when fill is defined', async () => {
    el.fill = 'outline';
    await el.updateComplete;

    const directMenuButton = el.querySelector(':scope > sl-menu-button');
    expect(directMenuButton).to.have.attribute('fill', 'outline');
  });

  it('should set fill attribute on nested buttons when fill is defined', async () => {
    el.fill = 'ghost';
    await el.updateComplete;

    const nestedButton = el.querySelector('#wrapper sl-button');
    expect(nestedButton).to.have.attribute('fill', 'ghost');
  });

  it('should set fill attribute on nested menu-buttons when fill is defined', async () => {
    el.fill = 'outline';
    await el.updateComplete;

    const nestedMenuButton = el.querySelector('#wrapper sl-menu-button');
    expect(nestedMenuButton).to.have.attribute('fill', 'outline');
  });

  it('should set variant attribute on all buttons when inverted is true', async () => {
    el.inverted = true;
    await el.updateComplete;

    const allButtons = el.querySelectorAll('sl-button');
    allButtons.forEach(button => {
      expect(button).to.have.attribute('variant', 'inverted');
    });
  });

  it('should set variant attribute on all menu-buttons when inverted is true', async () => {
    el.inverted = true;
    await el.updateComplete;

    const allMenuButtons = el.querySelectorAll('sl-menu-button');
    allMenuButtons.forEach(menuButton => {
      expect(menuButton).to.have.attribute('variant', 'inverted');
    });
  });

  it('should handle both fill and inverted together', async () => {
    el.fill = 'ghost';
    el.inverted = true;
    await el.updateComplete;

    const button = el.querySelector('sl-button');
    expect(button).to.have.attribute('fill', 'ghost');
    expect(button).to.have.attribute('variant', 'inverted');
  });

  it('should handle dynamic changes to fill property', async () => {
    el.fill = 'ghost';
    await el.updateComplete;

    const button = el.querySelector('sl-button');
    expect(button).to.have.attribute('fill', 'ghost');

    el.fill = 'outline';
    await el.updateComplete;

    expect(button).to.have.attribute('fill', 'outline');
  });

  it('should handle dynamic changes to inverted property', async () => {
    el.inverted = true;
    await el.updateComplete;

    const button = el.querySelector('sl-button');
    expect(button).to.have.attribute('variant', 'inverted');
  });

  it('should update all buttons including deeply nested ones', async () => {
    const deepWrapper = document.createElement('div');
    const deeperWrapper = document.createElement('div');
    const deepButton = document.createElement('sl-button');
    deepButton.textContent = 'Deep Button';
    deeperWrapper.appendChild(deepButton);
    deepWrapper.appendChild(deeperWrapper);
    el.appendChild(deepWrapper);
    await el.updateComplete;

    el.fill = 'ghost';
    el.inverted = true;
    await el.updateComplete;

    expect(deepButton).to.have.attribute('fill', 'ghost');
    expect(deepButton).to.have.attribute('variant', 'inverted');
  });

  it('should handle simultaneous fill and inverted changes', async () => {
    el.fill = 'ghost';
    el.inverted = true;
    await el.updateComplete;
    const button = el.querySelector('sl-button');

    expect(button).to.have.attribute('fill', 'ghost');
    expect(button).to.have.attribute('variant', 'inverted');

    el.fill = 'outline';
    await el.updateComplete;

    await new Promise(resolve => setTimeout(resolve));

    const updatedButton = el.querySelector('sl-button');
    expect(updatedButton).to.have.attribute('fill', 'outline');
  });
});
