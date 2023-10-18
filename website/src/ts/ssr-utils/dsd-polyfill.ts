// declarative shadow dom  polyfill

import { hydrateShadowRoots } from '@webcomponents/template-shadowroot/template-shadowroot.js';

// eslint-disable-next-line no-prototype-builtins
if (!HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')) {
  hydrateShadowRoots(document.body);
}
document.body.removeAttribute('dsd-pending');
