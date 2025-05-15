export function deepMerge(target: object, source: object): object {
  const out: any = { ...target };
  for (const key of Object.keys(source)) {
    const src = (source as any)[key];
    const tgt = (target as any)[key];
    out[key] =
      typeof src === 'object' && src !== null &&
      typeof tgt === 'object' && tgt !== null
        ? deepMerge(tgt, src)
        : src;
  }
  return out;
}
