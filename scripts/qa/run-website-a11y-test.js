import { spawnSync } from 'child_process';

const args = process.argv.slice(2);
let urls;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg === '--urls') {
    urls = args[i + 1];
    i++;
    continue;
  }

  if (arg.startsWith('--urls=')) {
    urls = arg.slice('--urls='.length);
  }
}

const result = spawnSync('yarn', ['website:a11y:test'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ...(urls ? { URLS: urls } : {})
  }
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
