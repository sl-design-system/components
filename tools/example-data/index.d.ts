export type Person = {
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  status: string;
  membership: string;
  manager?: boolean;
};

export type School = {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
};

export type Group = {
  id: string;
  name: string;
  schoolId: string;
};

export type Student = {
  id: string;
  studentNumber: string;
  firstName: string;
  infix: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  pictureUrl: string;
  group?: Group;
  school: School;
};

export interface Students {
  students: Student[];
  total: number;
}

export interface People {
  people: Person[];
  total: number;
}

export interface Options {
  count?: number;
  startIndex?: number;
}

export declare function getPeople(options?: Options): Promise<People>;
export declare function getSchools(options?: Options): Promise<School[]>;
export declare function getStudents(options?: Options): Promise<Students>;
