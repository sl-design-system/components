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


    const gitpackages = await octokit.request('GET /orgs/sl-design-system/packages', {
      org: 'sl-design-system',
      package_type: 'npm',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const versions = await gitpackages.data.map(async p => {
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
    gitpackages.data.forEach(p => {
      releases = {
        ...releases,
        [p.name]:latestVersions.find(version => version.package_html_url === p.html_url).name
      }
    });
  await asset.save(releases, "json");

  console.log('releases', releases);

  return releases;
};
