import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import chaiDatetime from 'chai-datetime';
import chaiDom from 'chai-dom';
import sinonChai from 'sinon-chai';
import { chai } from 'vitest';
import { commands } from 'vitest/browser';

chai.use(chaiDatetime);
chai.use(chaiDom);
chai.use(sinonChai);

// Set the body font
let style = document.createElement('style');
style.innerText = `body {
  font-family: var(--sl-text-fontFamily);
  font-size: var(--sl-base-fontSize);
  line-height: var(--sl-text-md-lineHeight);
  font-weight: var(--sl-fontWeight-regular);
}`;
document.head.appendChild(style);

// Load the SL light theme
style = document.createElement('style');
style.innerText = await commands.readFile('./packages/themes/sanoma-learning/theme.css');
document.head.appendChild(style);

// Set the user group to superuser for testing purposes
document.body.setAttribute('data-user-group', 'superuser');

// Load the fonts for the SL light theme using a link tag to preserve relative paths
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/packages/themes/sanoma-learning/fonts.css';
document.head.appendChild(link);
