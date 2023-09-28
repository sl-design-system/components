const { AssetCache } = require("@11ty/eleventy-fetch");

module.exports = async function() {
  // Pass in your unique custom cache key
  // (normally this would be tied to your API URL)
  let asset = new AssetCache("component-version-numbers");

  // check if the cache is fresh within the last day
  if(asset.isCacheValid("1d")) {
    // return cached data.
    return asset.getCachedValue(); // a promise
  }

  /*

    const octokit = new Octokit({
      auth: 'YOUR-TOKEN'
    })

    //https://docs.github.com/rest/packages/packages#list-packages-for-an-organization

    await octokit.request('GET /orgs/sl-design-system/packages', {
      org: 'ORG',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

  */

  // this should come from the list of packages
  let packages = { button: 'v0.0.12' };

  await asset.save(packages, "json");

  return packages;
};
