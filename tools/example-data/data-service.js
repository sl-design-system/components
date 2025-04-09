let peopleImages;
let studentImages;

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

export async function getStudents(options) {
  if (!studentImages) {
    // Load student-specific images
    studentImages = (await import('./data/student-images.json')).default;
  }

  const allStudents = await getDataset('students.json'),
    schools = await getDataset('schools.json');

  let students = [...allStudents];

  const startIndex = options?.startIndex || 0;
  const count = options?.count ? startIndex + options.count : undefined;

  students = students.slice(startIndex, count);
  students = students.map(student => {
    const { avatarId, schoolId, ...studentWithoutExcludedProps } = student;

    return {
      ...studentWithoutExcludedProps,
      pictureUrl: studentImages[avatarId]?.image,
      school: schools.find(school => school.id === schoolId)
    };
  });

  return {
    students,
    total: allStudents.length
  };
}

export async function getPeople(options) {
  if (!peopleImages) {
    peopleImages = (await import('./data/people-images.json')).default;
  }

  const allPeople = await getDataset('people.json');

  let people = [...allPeople];

  const startIndex = options?.startIndex || 0;
  const count = options?.count ? startIndex + options.count : undefined;

  people = people.slice(startIndex, count);
  people = people.map((person, index) => {
    return {
      ...person,
      pictureUrl: peopleImages[index % peopleImages.length]
    };
  });

  return {
    people,
    total: allPeople.length
  };
}
