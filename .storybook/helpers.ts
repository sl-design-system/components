import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { type Indexer, type IndexerOptions } from 'storybook/internal/types';

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

export async function injectComponentStatusTags(existingIndexers: Indexer[] = []): Promise<Indexer[]> {
  return existingIndexers.map(indexer => {
    return ({
      test: indexer.test,
      async createIndex(fileName: string, options: IndexerOptions) {
        const status = await getComponentStatus(fileName),
          existingOutput = await indexer.createIndex(fileName, options);

        return existingOutput.map(entry => {
          const { tags = [] } = entry;

          if (status) {
            tags.push(status);
          }

          return entry;
        });
      }
    });
  });
}
