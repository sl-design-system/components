const { AssetCache } = require("@11ty/eleventy-fetch");
const { Octokit} = require("octokit");

module.exports = async function() {
  // Pass in your unique custom cache key
  let asset = new AssetCache("component-version-numbers");
  // check if the cache is fresh within the last day
  if(asset.isCacheValid("1d")) {
    // return cached data.
    return asset.getCachedValue(); // a promise
  }


    const octokit = new Octokit({
      auth: process.env.GITHUB_API_TOKEN
    })

    const pages = [1,2,3,4,5];

    const gitpackages = await pages.map(async page => octokit.request('GET /orgs/sl-design-system/packages', {
      org: 'sl-design-system',
      package_type: 'npm',
      page,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }));

    const gitpackagesData = await Promise.all(gitpackages);
    const packages = gitpackagesData.flatMap(page => page.data);

    const versions = await packages.map(async p => {
      return octokit.request(`GET /orgs/sl-design-system/packages/npm/${p.name}/versions`, {
        package_type: 'npm',
        package_name: p.name,
        org: 'sl-design-system',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    });
    const versionData = await Promise.all(versions);
    const latestVersions = versionData.map(d => d.data[0]);

    let releases = {};
    packages.forEach(p => {
      releases = {
        ...releases,
        [p.name]:latestVersions.find(version => version.package_html_url === p.html_url).name
      }
    });
  await asset.save(releases, "json");

  return releases;
};
