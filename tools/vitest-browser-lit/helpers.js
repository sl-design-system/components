import { render } from 'lit';

const containers = new Set();

export async function fixture(template, {
    baseElement = document.body,
  container = baseElement.appendChild(document.createElement('div')),
  ...options
} = {}) {
  containers.add(container);

  render(template, container, options);

  const element = container.firstElementChild;
  if (element.updateComplete) {
    await element.updateComplete;
  }

  return element;
}

export function cleanup() {
  for (const container of containers) {
    container.remove();
  }

  containers.clear();
}

export function oneEvent(eventTarget, eventName) {
  return new Promise(resolve => {
    function listener(ev) {
      resolve(ev);
      eventTarget.removeEventListener(eventName, listener);
    }

    eventTarget.addEventListener(eventName, listener);
  });
}
