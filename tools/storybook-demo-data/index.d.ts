export interface Person {
  firstName: string;
  lastName: string;
  email: string;
  profession: string;
  status: string;
}

export declare function getPeople(): Promise<Person[]>;
