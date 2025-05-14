export const isPlainObject = (x: unknown): x is object =>
  typeof x === 'object' && x !== null && !Array.isArray(x);
