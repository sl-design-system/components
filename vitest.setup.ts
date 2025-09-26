import { commands } from '@vitest/browser/context'
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import chaiDom from 'chai-dom';
import sinonChai from 'sinon-chai';
import { chai } from 'vitest';

chai.use(chaiDom);
chai.use(sinonChai);

// Load the SL light theme
const style = document.createElement('style');
style.innerText = await commands.readFile('./packages/themes/sanoma-learning/light.css');
document.head.appendChild(style);
