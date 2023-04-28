import { exec } from 'child_process';

const cwd = new URL('.', import.meta.url).pathname;

const transformTokens = async (name, mode, tokenSets) => {
  return new Promise((resolve, reject) => {
    const output = `../packages/themes/${name}/${mode}.json`;

    exec(`yarn run token-transformer ../packages/tokens/src ${output} ${tokenSets.join(',')} --resolveReferences=false`, { cwd }, error => {
      if (error) {
        console.log(error);
        reject(error);
      }
    
      resolve();
    });
  });
};

export const transformAllTokens = async (themes) => {
  await Promise.all(themes.map(({ name, mode, tokenSets }) => {
    return transformTokens(name, mode, tokenSets);
  }));
};
