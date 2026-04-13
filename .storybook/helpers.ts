import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { type Indexer, type IndexerOptions } from 'storybook/internal/types';

/**
 * Walks up the directory tree from `fileName` until it finds a `package.json`,
 * returning its absolute path, or `null` if none is found before the root.
 */
export async function findNearestPackageJson(fileName: string): Promise<string | null> {
  let currentDir = dirname(fileName);

  while (true) {
    const packageJsonPath = join(currentDir, 'package.json');

    try {
      await access(packageJsonPath);
      return packageJsonPath;
    } catch {
      // If the file doesn't exist, move up to the parent directory
      const parentDir = dirname(currentDir);
      if (parentDir === currentDir) {
        // Reached the root directory without finding a package.json
        return null;
      }
      currentDir = parentDir;
    }
  }
}

/**
 * Returns the `"status"` and `"version"` fields from the nearest `package.json`
 * relative to `storiesFileName`, or `null` for absent fields.
 */
export async function getComponentMetadata(
  storiesFileName: string
): Promise<{ status: string | null; version: string | null }> {
  const packageJsonPath = await findNearestPackageJson(storiesFileName);
  if (!packageJsonPath) {
    return { status: null, version: null };
  }

  try {
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));

    return {
      status: packageJson.status || null,
      version: packageJson.version || null
    };
  } catch (err) {
    console.error(`Error reading package.json at ${packageJsonPath}:`, err);
    return { status: null, version: null };
  }
}

/**
 * Wraps each Storybook indexer so that the component's `"status"` and `"version"`
 * values are appended to every story's tags list. This makes the metadata available
 * to `storybook-addon-tag-badges` without having to declare it manually in every
 * stories file.
 */
export async function injectComponentMetadata(existingIndexers: Indexer[] = []): Promise<Indexer[]> {
  return existingIndexers.map(indexer => {
    return ({
      test: indexer.test,
      async createIndex(fileName: string, options: IndexerOptions) {
        const { status, version } = await getComponentMetadata(fileName),
          existingOutput = await indexer.createIndex(fileName, options);

        return existingOutput.map(entry => {
          let tags = entry.tags ?? [];

          // Avoid adding duplicate tags if they are somehow already present.
          if (status && !tags.includes(status)) {
            tags = [...tags, status];
          }

          if (version) {
            const versionTag = `v:${version}`;
            if (!tags.includes(versionTag)) {
              tags = [...tags, versionTag];
            }
          }

          return { ...entry, tags };
        });
      }
    });
  });
}
