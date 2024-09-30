let peopleImages;

const datasetCache = {};

async function getDataset(fileName, count) {
  if (!datasetCache[fileName]) {
    datasetCache[fileName] = (await import(`./data/${fileName.split('.')[0]}.json`)).default;
  }

  return datasetCache[fileName].slice(0, count).map(item => {
    // Create deep clones to avoid sharing the same item instances between examples
    return { ...item };
  });
}

export async function getCountries(count = Infinity) {
  return await getDataset('countries.json', count);
}

export async function getPeople(options) {
  if (!peopleImages) {
    peopleImages = (await import('./data/people-images.json')).default;
  }

  const allPeople = await getDataset('people.json');

  let people = [...allPeople];

  if (options?.managerId !== undefined) {
    people = people.filter(person => person.managerId == options?.managerId);
  }

  const hierarchyLevelSize = people.length;
  const startIndex = options?.startIndex || 0;
  const count = options?.count ? startIndex + options.count : undefined;

  people = people.slice(startIndex, count);
  people = people.map((person, index) => {
    return {
      ...person,
      pictureUrl: peopleImages[index % peopleImages.length],
      manager: allPeople.some(p => p.managerId === person.id)
    };
  });

  return {
    people,
    hierarchyLevelSize
  };
}
