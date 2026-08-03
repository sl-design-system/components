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

const files = output.split('\n').filter(Boolean);
const mdFiles = files.filter(file => file.startsWith('website/src/') && file.endsWith('.md'));

const urls = mdFiles.map(file => {
  if (file === 'website/src/index.md') return '/';
  if (file === 'website/src/404.md') return '/404.html';
  return file.replace(/^website\/src\//, '').replace(/\.md$/, '/');
});

if (urls.length === 0) {
  urls.push('/');
}

writeFileSync('changed-urls.json', JSON.stringify(urls, null, 2));
