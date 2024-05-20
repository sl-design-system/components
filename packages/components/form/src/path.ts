type Path<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends PathKeys<T[K]>
      ? Path<T[K], Rest>
      : never
    : never
  : P extends `${infer K}[${infer I}]`
    ? K extends keyof T
      ? T[K] extends Array<infer U>
        ? I extends `${number}`
          ? U
          : never
        : never
      : never
    : P extends keyof T
      ? T[P]
      : never;

type PathKeys<T> = T extends object
  ? { [K in keyof T]: K extends string ? `${K}.${PathKeys<T[K]>}` | K : never }[keyof T]
  : '';

export function getValueByPath<T, P extends string>(obj: T, path: P): Path<T, P> {
  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = obj;

  for (const key of keys) {
    const match = /\[(\d+)\]$/.exec(key);
    if (match) {
      const index = Number(match[1]);
      const arrayKey = key.slice(0, -match[0].length);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      result = result[arrayKey][index];
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      result = result[key];
    }
  }

  return result as Path<T, P>;
}

export function setValueByPath<T, P extends string>(obj: T, path: P, value: Path<T, P>): void {
  const keys = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const match = /\[(\d+)\]$/.exec(key);
    if (match) {
      const index = Number(match[1]);
      const arrayKey = key.slice(0, -match[0].length);
      if (i === keys.length - 1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        current[arrayKey][index] = value;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        current = current[arrayKey][index];
      }
    } else {
      if (i === keys.length - 1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        current[key] = value;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        current = current[key];
      }
    }
  }
}

// interface Test {
//   foo: {
//     bar: {
//       baz: number[];
//     };
//   };
// }

// // Correct usage
// let _test1: Path<Test, 'foo.bar.baz[0]'>; // type of test1 is number

// // Incorrect usage
// let _test2: Path<Test, 'foo.bar.baz[1].qux'>; // Error: 'qux' does not exist on type 'number'

// // Correct usage
// let _test3: Path<Test, 'foo.bar'>; // type of test3 is { baz: number[]; }

// // Incorrect usage
// let _test4: Path<Test, 'foo.qux'>; // Error: 'qux' does not exist on type '{ bar: { baz: number[]; }; }'

// // Usage
// const obj: Test = {
//   foo: {
//     bar: {
//       baz: [1, 2, 3]
//     }
//   }
// };

// console.log(getValueByPath(obj, 'foo.bar.baz[0]')); // 1
// setValueByPath(obj, 'foo.bar.baz[0]', 10);
// console.log(getValueByPath(obj, 'foo.bar.baz[0]')); // 10
