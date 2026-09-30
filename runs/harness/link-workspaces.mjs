/**
 * Links every local workspace into `node_modules/` as a symlink, which is what a complete `yarn
 * install` would have produced.
 *
 * This checkout only ever had `packages/components/*` linked, so any bare import of a workspace
 * that lives elsewhere — `@sl-design-system/locales`, the theme packages, the Vite CSS-sheet plugin
 * — fails to resolve. That breaks the repository Storybook and the render harness alike, and it is
 * a separate cause from the missing Font Awesome token (see `runs/BATCH-RUNBOOK.md`).
 *
 * Only local directories are linked; nothing is fetched, so no registry credentials are involved.
 * Idempotent: safe to run before every harness start, including after a `yarn install` removes the
 * links again.
 */
import { existsSync, lstatSync, mkdirSync, readFileSync, readlinkSync, symlinkSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..'),
  { workspaces } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')),
  linked = [];

for (const pattern of workspaces) {
  for await (const dir of glob(pattern, { cwd: root })) {
    const manifest = join(root, dir, 'package.json');
    if (!existsSync(manifest)) continue;

    const { name } = JSON.parse(readFileSync(manifest, 'utf8'));
    if (!name) continue;

    const target = join(root, 'node_modules', name);

    // An existing entry is either yarn's own link or a real install; leave both alone.
    if (
      existsSync(target) ||
      (lstatSync(target, { throwIfNoEntry: false }) && readlinkSync(target))
    )
      continue;

    mkdirSync(dirname(target), { recursive: true });
    symlinkSync(relative(dirname(target), join(root, dir)), target, 'dir');
    linked.push(name);
  }
}

console.log(
  linked.length
    ? `linked ${linked.length} workspace(s): ${linked.join(', ')}`
    : 'all workspaces already linked'
);
