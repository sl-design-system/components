import { page } from '@vitest/browser/context';
import { beforeEach } from 'vitest';
import { fixture, cleanup } from './helpers.js';

page.extend({ fixture, [Symbol.for('vitest:component-cleanup')]: cleanup });

beforeEach(() => cleanup());

export { fixture, cleanup };
