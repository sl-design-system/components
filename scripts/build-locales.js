import fg from 'fast-glob';

const buildLocales = async () => {
  for (const path of await fg('./packages/*/locales/*.xlf')) {
    console.log(path);
  }
};

buildLocales();