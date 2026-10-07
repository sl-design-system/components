// `pngjs` ships no types, and the harness typecheck is strict. This is the minimal surface the
// census uses — decode a buffer, read its dimensions and raw RGBA bytes, allocate a blank image for
// the tests' synthetic fixtures — not the whole library.
declare module 'pngjs' {
  export class PNG {
    constructor(options?: { width: number; height: number });
    width: number;
    height: number;
    data: Buffer;
    static sync: {
      read(buffer: Buffer): PNG;
      write(png: PNG): Buffer;
    };
  }
}
