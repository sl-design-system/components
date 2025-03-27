export type Person = {
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  status: string;
  membership: string;
  manager?: boolean;
};

export interface People {
  hierarchyLevelSize: number;
  people: Person[];
  total: number;
}

export interface Options {
  count?: number;
  managerId?: string;
  startIndex?: number;
}

export declare function getPeople(options?: Options): Promise<People>;
