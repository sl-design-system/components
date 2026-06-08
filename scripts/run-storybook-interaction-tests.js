import { createReadStream, existsSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';

const STORYBOOK_DIR = resolve('storybook-static');
const PORT = 6006;

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const getSafePath = urlPath => {
  const normalizedPath = normalize(urlPath).replace(/^\/+/, '');
  const resolvedPath = join(STORYBOOK_DIR, normalizedPath);

  if (!resolvedPath.startsWith(STORYBOOK_DIR)) {
    return null;
  }

  return resolvedPath;
};

const resolveFilePath = urlPath => {
  const initialPath = urlPath === '/' ? '/index.html' : urlPath;
  const safePath = getSafePath(initialPath);

  if (safePath && existsSync(safePath)) {
    return safePath;
  }

  const fallbackPath = getSafePath('/index.html');
  if (fallbackPath && existsSync(fallbackPath)) {
    return fallbackPath;
  }

  return null;
};

const server = createServer((req, res) => {
  const requestUrl = new URL(req.url ?? '/', 'http://localhost');
  const filePath = resolveFilePath(requestUrl.pathname);

  if (!filePath) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');

    return;
  }

  const extension = extname(filePath);
  const contentType = MIME_TYPES[extension] ?? 'application/octet-stream';

  res.writeHead(200, { 'content-type': contentType });
  createReadStream(filePath).pipe(res);
});

const runPlaywright = () => {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('yarn', ['exec', 'playwright', 'test', '--project=storybook'], {
      stdio: 'inherit'
    });

    child.on('error', rejectPromise);
    child.on('close', code => {
      resolvePromise(code ?? 1);
    });
  });
};

if (!existsSync(STORYBOOK_DIR)) {
  console.error('Expected a built Storybook at ./storybook-static but it does not exist.');
  process.exit(1);
}

server.listen(PORT, async () => {
  console.log(`Serving built Storybook from ${STORYBOOK_DIR} at http://localhost:${PORT}`);

  try {
    const exitCode = await runPlaywright();

    server.close(() => {
      process.exit(exitCode);
    });
  } catch (error) {
    console.error(error);

    server.close(() => {
      process.exit(1);
    });
  }
});
