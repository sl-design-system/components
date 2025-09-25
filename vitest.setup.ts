import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import chaiDom from 'chai-dom';
import sinonChai from 'sinon-chai';
import { chai } from 'vitest';

chai.use(chaiDom);
chai.use(sinonChai);
