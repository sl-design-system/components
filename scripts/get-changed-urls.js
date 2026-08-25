import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

function normalizeUrl(url) {
  const trimmed = url.trim();

  if (!trimmed) {
    return '';
  }

  if (trimmed === '/') {
    return '/';
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  if (withLeadingSlash.endsWith('/') || withLeadingSlash.endsWith('.html')) {
    return withLeadingSlash;
  }

  return `${withLeadingSlash}/`;
}

// fallback branch
const base = process.env.BASE || 'origin/main';
const explicitUrls = (process.env.URLS || '').split(',').map(normalizeUrl).filter(Boolean);

if (explicitUrls.length > 0) {
  writeFileSync('changed-urls.json', JSON.stringify([...new Set(explicitUrls)], null, 2));
  process.exit(0);
}

let output;

try {
  output = execSync(`git diff --name-only ${base}...HEAD`, { encoding: 'utf-8' });
} catch {
  output = execSync(`git diff --name-only HEAD~1`, { encoding: 'utf-8' });
}

/**
 * Pages tested when a change is not tied to a page of its own. They are picked to cover the
 * templates a page is built from rather than their content: a component page with an example and a
 * code block, one without, and a plain content page whose code block has no language.
 */
const siteWideUrls = [
  '/categories/components/infotip/code/',
  '/categories/components/infotip/usage/',
  '/categories/getting-started/developers/'
];

const files = output.split('\n').filter(Boolean);
const mdFiles = files.filter(file => file.startsWith('website/src/') && file.endsWith('.md'));

const urls = mdFiles.map(file => {
  if (file === 'website/src/index.md') return '/';
  if (file === 'website/src/404.md') return '/404.html';
  return file.replace(/^website\/src\//, '').replace(/\.md$/, '/');
});

// The Eleventy config, the templates, the styles and the scripts decide how every page is
// rendered, so a change there belongs to no page in particular. Test the sample above, rather than
// falling back to the home page: that one is scanned in full, including the header and the nav
// that every page shares, so it reports violations that have nothing to do with the change.
const changesEveryPage = files.some(
  file =>
    (file.startsWith('website/') || file === 'scripts/get-changed-urls.js') && !file.endsWith('.md')
);

if (changesEveryPage || urls.length === 0) {
  urls.push(...siteWideUrls);
}

writeFileSync('changed-urls.json', JSON.stringify([...new Set(urls)], null, 2));
