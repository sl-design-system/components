const { AssetCache } = require('@11ty/eleventy-fetch');
const { readdir } = require('fs').promises;
const { join } = require('path');

async function getComponentVersions() {
  const components = (await readdir(join(__dirname, '../categories/components')))
    .map(dir => dir.split('/').at(-1))
    .filter(dir => !dir.includes('.'));

  let versions = await Promise.all(
    components.map(async c => {
      const response = await fetch(`https://raw.githubusercontent.com/sl-design-system/components/main/packages/components/${c}/package.json`);

      if (response.ok) {
        const body = await response.json();

        return [c, body.version];
      }
    })
  );

  return Object.fromEntries(versions.filter(Boolean));
}

module.exports = async function () {
  const asset = new AssetCache('component-version-numbers');

  if (asset.isCacheValid('1h')) {
    // Cache for 1 hour
    return asset.getCachedValue();
  }

  const versions = await getComponentVersions();

  await asset.save(versions, 'json');

  return versions;
};
