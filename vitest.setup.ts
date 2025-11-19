import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import chaiDatetime from 'chai-datetime';
import chaiDom from 'chai-dom';
import sinonChai from 'sinon-chai';
import { chai, vi } from 'vitest';
import { commands } from 'vitest/browser'

chai.use(chaiDatetime);
chai.use(chaiDom);
chai.use(sinonChai);

// Set the body font
let style = document.createElement('style');
style.innerText = `body { font: var(--sl-text-new-body-md); }`;
document.head.appendChild(style);

// Load the SL light theme
style = document.createElement('style');
style.innerText = await commands.readFile('./packages/themes/sanoma-learning/light.css');
document.head.appendChild(style);
