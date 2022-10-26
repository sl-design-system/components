export interface Person {
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  status: string;
}

export interface People {
  hierarchyLevelSize: number;
  people: Person[];
}

export declare function getPeople(): Promise<People>;
