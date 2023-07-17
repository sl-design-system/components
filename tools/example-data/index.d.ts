export type Person = {
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  status: string;
};

export interface People {
  hierarchyLevelSize: number;
  people: Person[];
}

export interface Options {
  count?: number;
  managerId?: string;
  startIndex?: number;
}

export declare function getPeople(options?: Options): Promise<People>;
