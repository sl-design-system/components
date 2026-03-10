import fs from 'fs';

const files = process.env.CHANGED_MD.split(' ').filter(Boolean);

// If there are no changed files, we want to test the homepage
if (files.length === 0) {
  files = '/';
}
const urls = files.map(file => file.replace(/^website\/src\//, '').replace(/\.md$/, '/'));

fs.writeFileSync('changed-urls.json', JSON.stringify(urls, null, 2));
