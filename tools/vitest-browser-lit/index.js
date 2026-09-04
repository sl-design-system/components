import { beforeEach } from 'vitest';
import { page } from 'vitest/browser';
import { cleanup, fixture, oneEvent } from './helpers.js';

page.extend({ fixture, [Symbol.for('vitest:component-cleanup')]: cleanup });

beforeEach(() => cleanup());

export { fixture, cleanup, oneEvent };
