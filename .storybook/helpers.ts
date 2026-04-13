import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { type Indexer, type IndexerOptions } from 'storybook/internal/types';

// Caches to avoid redundant filesystem lookups during indexing.
const packageJsonCache = new Map<string, Promise<string | null>>(),
  statusCache = new Map<string, Promise<string | null>>();

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
    } catch (err) {
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
 * Returns the `"status"` field from the nearest `package.json` relative to
 * `storiesFileName`, or `null` if the field is absent or the file cannot be read.
 */
export async function getComponentStatus(storiesFileName: string): Promise<string | null> {
  const packageJsonPath = await findNearestPackageJson(storiesFileName);
  if (!packageJsonPath) {
    return null;
  }

  try {
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));

    return packageJson.status || null;
  } catch (err) {
    console.error(`Error reading package.json at ${packageJsonPath}:`, err);
    return null;
  }
}

/**
 * Wraps each Storybook indexer so that the component's `"status"` value is
 * appended to every story's tags list. This makes the status available to
 * `storybook-addon-tag-badges` without having to declare it manually in every
 * stories file.
 */
export async function injectComponentStatusTags(existingIndexers: Indexer[] = []): Promise<Indexer[]> {
  return existingIndexers.map(indexer => {
    return ({
      test: indexer.test,
      async createIndex(fileName: string, options: IndexerOptions) {
        const status = await getComponentStatus(fileName),
          existingOutput = await indexer.createIndex(fileName, options);

        return existingOutput.map(entry => {
          if (!status) {
            return entry;
          }

          const tags = entry.tags ?? [];

          // Avoid adding a duplicate tag if it is somehow already present.
          return {
            ...entry,
            tags: tags.includes(status) ? tags : [...tags, status]
          };
        });
      }
    });
  });
}
