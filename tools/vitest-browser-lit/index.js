import { page } from '@vitest/browser/context';
import { beforeEach } from 'vitest';
import { fixture, cleanup, oneEvent } from './helpers.js';

page.extend({ fixture, [Symbol.for('vitest:component-cleanup')]: cleanup });

beforeEach(() => cleanup());

export { fixture, cleanup, oneEvent };
