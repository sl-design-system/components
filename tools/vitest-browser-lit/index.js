import { render } from 'lit';

export async function fixture(template) {
  const wrapper = document.createElement('div');
  document.body.appendChild(wrapper);
  render(template, wrapper);

  const element = wrapper.firstElementChild;
  if (element.updateComplete) {
    await element.updateComplete;
  }

  return element;
}