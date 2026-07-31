import '@sl-design-system/icon/register.js';
import { MenuButton } from '@sl-design-system/menu';
import '@sl-design-system/menu/register.js';
import { ToggleButton } from '@sl-design-system/toggle-button';
import '@sl-design-system/toggle-button/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type Card } from './card.js';

describe('<sl-card>', () => {
  let el: Card;
  const image = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
    title = 'Title',
    subHeader = 'subHeader',
    bodyCopy = 'Lorem Ipsum';

  describe('with image', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-card>
          <img slot="media" src=${image} />
          <h2>${title}</h2>
          <h3 slot="header">${subHeader}</h3>
          <p slot="body">${bodyCopy}</p>
          <sl-menu-button slot="menu-button"
            ><sl-menu-item>
              <sl-icon name="far-pen"></sl-icon>
              Rename...
            </sl-menu-item>
            <sl-menu-item>
              <sl-icon name="far-trash"></sl-icon>
              Delete...
            </sl-menu-item></sl-menu-button
          >
          <sl-button aria-label="Actions" fill="ghost" slot="actions">
            <sl-icon name="ellipsis"></sl-icon>
          </sl-button>
        </sl-card>
      `);

      await el.updateComplete;
    });

    it('should render default slots', () => {
      expect(el).to.exist;
      const slots = el.shadowRoot!.querySelectorAll('slot');
      expect(slots.length).to.be.greaterThan(0);
    });

    it('should have the correct span values', () => {
      expect(el.style.getPropertyValue('--_vertical-elements')).to.equal('3');
      expect(el.style.getPropertyValue('--_horizontal-elements')).to.equal('2');
    });

    it('should apply sl-horizontal class based on orientation and width', async () => {
      el.style.setProperty('--sl-card-horizontal-breakpoint', '0');
      el.orientation = 'horizontal';
      await el.updateComplete;
      expect(el.classList.contains('sl-horizontal')).to.be.true;
    });

    it('should add sl-has-media class when media is present', () => {
      expect(el.classList.contains('sl-has-media')).to.be.true;
    });

    it('should add sl-has-actions class if actions slot has content', () => {
      expect(el.classList.contains('sl-has-actions')).to.be.true;
    });

    it('should add sl-has-menu-button and sets properties for MenuButton', () => {
      const menuButtonSlot = el.shadowRoot!.querySelector('slot[name="menu-button"]');
      const assignedMenuButton: MenuButton | null =
        menuButtonSlot &&
        ((menuButtonSlot as HTMLSlotElement)
          .assignedElements()
          .find(el => el.tagName.toLowerCase() === 'sl-menu-button') as MenuButton);
      expect(assignedMenuButton).to.exist;

      expect(el.classList.contains('sl-has-menu-button')).to.be.true;
      expect(assignedMenuButton?.fill).to.equal('ghost');
      expect(assignedMenuButton?.size).to.equal('md');
    });

    it('should set --_line-clamp CSS variable based on body slot content', async () => {
      const el = await fixture<Card>(html`
        <sl-card>
          <div slot="body" style="font-size: 20px; line-height: 20px; height: 40px;">Body text</div>
        </sl-card>
      `);
      await el.updateComplete;

      const slot = el.shadowRoot!.querySelector('slot[name="body"]') as HTMLElement;
      expect(slot.style.getPropertyValue('--_line-clamp')).to.not.equal('');
    });

    it('should not add sl-has-link class if title slot doesnt contain a link', () => {
      expect(el.classList.contains('sl-has-link')).to.be.false;
    });

    it('should remove sl-has-link class if title slot does not contain a link', async () => {
      const el = await fixture<Card>(html`
        <sl-card>
          <span slot="title">No link</span>
        </sl-card>
      `);
      await el.updateComplete;

      expect(el.classList.contains('sl-has-link')).to.be.false;
    });

    it('should not create a copy of the image', () => {
      const copiedImage = el.shadowRoot!.querySelector('figure>img');
      expect(copiedImage).not.to.exist;
    });

    it('should not set the sl-media-explicit-size class', () => {
      expect(el.classList.contains('sl-media-explicit-size')).to.be.true;
    });
  });

  describe('image-backdrop', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-card fit-image image-backdrop>
          <img slot="media" src=${image} />
          <h2>${title}</h2>
          <p slot="body">${bodyCopy}</p>
        </sl-card>
      `);
      await el.updateComplete;
    });

    it('should create a copy of the image', () => {
      const copiedImage = el.shadowRoot!.querySelector('figure>img');
      expect(copiedImage).to.exist;
      expect(copiedImage?.getAttribute('src')).to.equal(image);
      expect(copiedImage?.classList.contains('backdrop')).to.be.true;
    });

    it('should have the correct span values', () => {
      expect(el.style.getPropertyValue('--_vertical-elements')).to.equal('2');
      expect(el.style.getPropertyValue('--_horizontal-elements')).to.equal('2');
    });

    it('should remove the create a copy of the image', async () => {
      el.imageBackdrop = false;
      await el.updateComplete;

      const copiedImage = el.shadowRoot!.querySelector('figure>img');
      expect(copiedImage).not.to.exist;
    });
  });

  describe('without image and actions, with link and toggle button', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-card>
          <a href="#">${title}</a>
          <h3 slot="header">${subHeader}</h3>
          <p slot="body">${bodyCopy}</p>
          <sl-toggle-button slot="menu-button" aria-label="Favorite" shape="pill">
            <sl-icon name="far-heart" slot="default"></sl-icon>
            <sl-icon name="fas-heart" slot="pressed"></sl-icon>
          </sl-toggle-button>
        </sl-card>
      `);
      await el.updateComplete;
    });

    it('should remove sl-has-media if no media is present', () => {
      expect(el.classList.contains('sl-has-media')).to.be.false;
    });

    it('should have the correct span values', () => {
      expect(el.style.getPropertyValue('--_vertical-elements')).to.equal('2');
      expect(el.style.getPropertyValue('--_horizontal-elements')).to.equal('1');
    });

    it('should add sl-has-link class if title slot contains a link', () => {
      expect(el.classList.contains('sl-has-link')).to.be.true;
    });

    it('should remove sl-has-actions class if actions slot is empty', () => {
      expect(el.classList.contains('sl-has-actions')).to.be.false;
    });

    it('should add sl-has-menu-button when there is a toggle button', () => {
      const menuButtonSlot = el.shadowRoot!.querySelector('slot[name="menu-button"]');
      const assignedMenuButton: ToggleButton | null =
        menuButtonSlot &&
        ((menuButtonSlot as HTMLSlotElement)
          .assignedElements()
          .find(el => el.tagName.toLowerCase() === 'sl-toggle-button') as ToggleButton);
      expect(assignedMenuButton).to.exist;

      expect(el.classList.contains('sl-has-menu-button')).to.be.true;
      expect(assignedMenuButton?.size).to.equal('md');
    });

    it('should propagate click events on the card to the link', () => {
      const titleSlot = el.shadowRoot!.querySelector('slot.title');
      const link: HTMLAnchorElement | null =
        titleSlot &&
        ((titleSlot as HTMLSlotElement)
          .assignedElements()
          .find(el => el.tagName.toLowerCase() === 'a') as HTMLAnchorElement);
      expect(link).to.exist;

      let clicked = false;
      link?.addEventListener('click', () => {
        clicked = true;
      });

      el.click();
      expect(clicked).to.be.true;
    });

    it('should not propagate clicks from the menu button to the link', () => {
      const link = el.querySelector('a')!;
      const toggleButton = el.querySelector('sl-toggle-button')!;

      let linkClicks = 0;
      link.addEventListener('click', event => {
        event.preventDefault();
        linkClicks += 1;
      });

      toggleButton.click();

      expect(linkClicks).to.equal(0);
    });

    it('should only click the link once after the title slot changes', () => {
      const titleSlot = el.shadowRoot!.querySelector('slot.title')!;
      const link = el.querySelector('a')!;

      let linkClicks = 0;
      link.addEventListener('click', event => {
        event.preventDefault();
        linkClicks += 1;
      });

      titleSlot.dispatchEvent(new Event('slotchange'));
      titleSlot.dispatchEvent(new Event('slotchange'));
      el.click();

      expect(linkClicks).to.equal(1);
    });

    it('should only dispatch one link click after interacting with the toggle button', () => {
      const link = el.querySelector('a')!;
      const toggleButton = el.querySelector('sl-toggle-button')!;

      let linkClicks = 0;
      link.addEventListener('click', event => {
        event.preventDefault();
        linkClicks += 1;
      });

      toggleButton.click();
      link.click();

      expect(linkClicks).to.equal(1);
    });
  });

  describe('vertical orientation', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-card orientation="vertical">
          <img slot="media" src=${image} />
          <h2>${title}</h2>
          <p slot="body">${bodyCopy}</p>
        </sl-card>
      `);
      await el.updateComplete;
    });

    it('should have the correct span values', () => {
      expect(el.style.getPropertyValue('--_vertical-elements')).to.equal('3');
      expect(el.style.getPropertyValue('--_horizontal-elements')).to.equal('1');
    });

    it('should set the sl-media-explicit-size class when subgrid is enabled', async () => {
      expect(el.classList.contains('sl-media-explicit-size')).to.be.false;

      el.subgrid = true;
      await el.updateComplete;

      expect(el.classList.contains('sl-media-explicit-size')).to.be.true;
    });
  });

  describe('body slot behavior', () => {
    it('should add sl-has-article class when body slot has content', async () => {
      el = await fixture(html`
        <sl-card>
          <h2>${title}</h2>
          <p slot="body">${bodyCopy}</p>
          <sl-button slot="actions">Action</sl-button>
        </sl-card>
      `);
      await el.updateComplete;

      expect(el.classList.contains('sl-has-article')).to.be.true;
    });

    it('should remove sl-has-article class when body slot is empty', async () => {
      el = await fixture(html`
        <sl-card>
          <h2>${title}</h2>
          <sl-button slot="actions">Action</sl-button>
        </sl-card>
      `);
      await el.updateComplete;

      expect(el.classList.contains('sl-has-article')).to.be.false;
    });

    it('should toggle sl-has-article class when body slot content changes', async () => {
      const container = document.createElement('div');
      const bodyElement = document.createElement('p');
      bodyElement.setAttribute('slot', 'body');
      bodyElement.textContent = bodyCopy;

      container.innerHTML = `
        <sl-card>
          <h2>${title}</h2>
          <sl-button slot="actions">Action</sl-button>
        </sl-card>
      `;
      document.body.appendChild(container);
      el = container.querySelector('sl-card') as Card;
      await el.updateComplete;

      expect(el.classList.contains('sl-has-article')).to.be.false;

      // Add body content
      const bodySlot = el.shadowRoot!.querySelector('slot[name="body"]') as HTMLSlotElement;
      const waitForSlotChange = () =>
        new Promise<void>(resolve =>
          bodySlot.addEventListener('slotchange', () => resolve(), { once: true })
        );

      let slotChangePromise = waitForSlotChange();
      el.appendChild(bodyElement);
      await slotChangePromise;
      expect(el.classList.contains('sl-has-article')).to.be.true;

      // Remove body content
      slotChangePromise = waitForSlotChange();
      el.removeChild(bodyElement);
      await slotChangePromise;
      expect(el.classList.contains('sl-has-article')).to.be.false;

      document.body.removeChild(container);
    });
  });
});
