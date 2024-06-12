import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Avatar } from './avatar.js';

describe('sl-avatar', () => {
  let el: Avatar;

  beforeEach(async () => {
    el = await fixture(html`<sl-avatar display-name="Emma Henderson - Van Deursen">Straight A student</sl-avatar>`);
  });

  it('should render the name', () => {
    const name = el.renderRoot.querySelector('[part="name"]')?.textContent?.trim();

    expect(name).to.equal('Emma Henderson - Van Deursen');
  });

  it('should render the subheading', () => {
    const subheading = el.renderRoot
      .querySelector<HTMLSlotElement>('slot:not([name]')
      ?.assignedNodes()
      .map(n => n.textContent)
      .join('')
      .trim();

    expect(subheading).to.equal('Straight A student');
  });

  it('should only render the avatar part if imageOnly is set', async () => {
    el.imageOnly = true;
    await el.updateComplete;

    const wrapper = el.renderRoot.querySelector<HTMLElement>('[part="wrapper"]'),
      name = el.renderRoot.querySelector('[part="name"]');

    expect(wrapper?.childElementCount).to.equal(1);
    expect(wrapper?.children[0]).to.match('[part="avatar"]');
    expect(name).not.to.exist;
  });

  it('should not render an image', () => {
    expect(el.renderRoot.querySelector('img')).not.to.exist;
  });

  it('should not render an image if pictureUrl is invalid', async () => {
    el.pictureUrl = 'https://sanomalearning.design/nonexistingavatar.jpg';
    await el.updateComplete;

    // Simulate the invalid picture url by dispatching an error event on the <img> tag
    el.renderRoot.querySelector('img')?.dispatchEvent(new Event('error'));
    await el.updateComplete;

    expect(el.renderRoot.querySelector('img')).not.to.exist;
  });

  it('should render an image if pictureUrl is set and valid', async () => {
    el.pictureUrl = 'https://randomuser.me/api/portraits/thumb/men/81.jpg';
    await el.updateComplete;

    const img = el.renderRoot.querySelector('img');

    expect(img).to.exist;
    expect(img).to.have.attribute('src', 'https://randomuser.me/api/portraits/thumb/men/81.jpg');
  });

  it('should set the alt attribute of the image to the display name', async () => {
    el.pictureUrl = 'https://randomuser.me/api/portraits/thumb/men/81.jpg';
    await el.updateComplete;

    const img = el.renderRoot.querySelector('img');

    expect(img).to.exist;
    expect(img).to.have.attribute('alt', 'Emma Henderson - Van Deursen');
  });

  it('should render the fallback content if pictureUrl is not set', async () => {
    const fallback = document.createElement('div');
    fallback.innerHTML = 'Fallback content';
    el.appendChild(fallback);

    await el.updateComplete;

    const slotted = el.renderRoot.querySelector<HTMLSlotElement>('slot:not([name]')?.assignedElements();

    expect(slotted).to.have.length(1);
    expect(slotted![0]).to.eql(fallback);
  });

  it('should render the implicit initials', () => {
    const initials = el.renderRoot.querySelector('[part="initials"]');

    expect(initials).to.have.text('ED');
  });

  it('should render the display initials when set', async () => {
    const initials = el.renderRoot.querySelector('[part="initials"]');

    el.displayInitials = 'JZ';
    await el.updateComplete;

    expect(initials).to.have.text('JZ');
  });

  it('should render the name but not the subheading on small', async () => {
    el.size = 'sm';
    await el.updateComplete;

    const name = el.renderRoot.querySelector('[part="name"]'),
      subheading = el.renderRoot.querySelector('slot:not([name])');

    expect(name).to.have.text('Emma Henderson - Van Deursen');
    expect(name).to.match('span');
    expect(getComputedStyle(subheading!).display).to.equal('none');
  });

  it('should wrap the contents in a div', () => {
    const wrapper = el.renderRoot.querySelector('[part="wrapper"]');

    expect(wrapper).to.match('div');
  });

  it('should wrap the contents in a link tag if href is set', async () => {
    el.href = 'https://www.example.com';
    await el.updateComplete;

    const wrapper = el.renderRoot.querySelector('[part="wrapper"]');

    expect(wrapper).to.have.attribute('href', 'https://www.example.com');
    expect(wrapper).to.match('a');
  });
});
