import type { PropUpdater } from "../../interfaces/PropUpdater";

export class ArrayUpdater implements PropUpdater {
  canHandle(v: unknown): boolean {
    return Array.isArray(v);
  }
  update(t: any, k: string, v: unknown): void {
    t[k] = [...(v as any[])];
  }
}
