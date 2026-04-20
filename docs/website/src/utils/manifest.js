import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import manifest from '../../custom-elements.json' with { type: 'json' };

// Repo root is 4 levels up from this file (docs/website/src/utils/manifest.js)
const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));

/**
 * Walks up the directory tree from `fileName` until it finds a `package.json`,
 * returning its absolute path, or `null` if none is found before the root.
 */
const findNearestPackageJson = async fileName => {
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
};

const getComponentMetadata = async path => {
  const packageJsonPath = await findNearestPackageJson(join(repoRoot, path));
  if (!packageJsonPath) {
    console.warn(`No package.json found for component at path "${path}".`);
    return { status: null, version: null };
  }

  try {
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8')),
      repositoryUrl = packageJson.repository?.url,
      repositoryDirectory = packageJson.repository?.directory;

    return {
      packageName: packageJson.name || null,
      repositoryUrl,
      repositoryDirectory,
      status: packageJson.status || null,
      version: packageJson.version || null
    };
  } catch (err) {
    console.error(`Error reading package.json for path "${path}":`, err);

    return { status: null, version: null };
  }
};

const sortByName = (a, b) => (a.name || '').localeCompare(b.name || '');

const toTitle = name => {
  const words = name.replace(/([A-Z])/g, ' $1').trim().toLowerCase().split(' ');
  return words[0].charAt(0).toUpperCase() + words[0].slice(1) + (words.length > 1 ? ' ' + words.slice(1).join(' ') : '');
};

const escapeHtml = str => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const backtickToCode = str => {
  if (typeof str !== 'string') return str;
  return escapeHtml(str).replace(/`([^`]+)`/g, '<code>$1</code>');
};

const transformDescriptions = item => {
  if (!item || typeof item !== 'object') return item;
  if (Array.isArray(item)) return item.map(transformDescriptions);
  const result = { ...item };
  if ('description' in result) result.description = backtickToCode(result.description);
  for (const key of Object.keys(result)) {
    if (Array.isArray(result[key])) result[key] = result[key].map(transformDescriptions);
  }
  return result;
};

export async function getComponents() {
  const components = [];

  for (const module of manifest.modules || []) {
    const metadata = await getComponentMetadata(module.path),
      name = metadata.packageName.split('/').at(-1);

    for (const declaration of module.declarations || []) {
      if (declaration.customElement) {
        const cssParts = declaration.cssParts?.sort(sortByName);
        const cssProperties = declaration.cssProperties?.sort(sortByName);
        const cssStates = declaration.cssStates?.sort(sortByName);
        const events = declaration.events?.sort(sortByName);
        const members = declaration.members?.sort(sortByName);
        const slots = declaration.slots?.sort(sortByName);

        components.push({
          ...declaration,
          ...metadata,
          cssParts,
          cssProperties,
          cssStates,
          events,
          members,
          name,
          slots
        });
      }
    }
  }

  return components;
}

export function getCustomElements() {
  return (manifest.modules || [])
    .flatMap(module => (module.declarations || []).filter(declaration => declaration.customElement))
    .map(declaration => {
      const transformed = transformDescriptions(declaration);
      const fields = (transformed.members || []).filter(m => m.kind === 'field').sort(sortByName);
      const methods = (transformed.members || []).filter(m => m.kind === 'method').sort(sortByName);

      const coveredAttributes = new Set(fields.map(f => f.attribute).filter(Boolean));
      const standaloneAttributes = (transformed.attributes || [])
        .filter(a => !coveredAttributes.has(a.name))
        .sort(sortByName);
      const attributesAndProperties = [...fields, ...standaloneAttributes].sort(sortByName);

      return {
        ...transformed,
        title: toTitle(declaration.name),
        attributesAndProperties,
        methods
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}
