import fs from 'fs';

const files = process.env.CHANGED_MD.length !== 0 ? process.env.CHANGED_MD.split(' ').filter(Boolean) : ['/'];

const urls = files.map(file => file.replace(/^website\/src\//, '').replace(/\.md$/, '/'));

fs.writeFileSync('changed-urls.json', JSON.stringify(urls, null, 2));
