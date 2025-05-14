import type { PropUpdater } from "../../interfaces/PropUpdater";
import { deepMerge } from "../deepMerge";
import { isPlainObject } from "../isPlainObject";

export class ObjectUpdater implements PropUpdater {
  canHandle(v: unknown, t?: any, k?: string): boolean {
    return k != null && isPlainObject(v) && isPlainObject(t?.[k]);
  }
  update(t: any, k: string, v: unknown): void {
    t[k] = deepMerge(t[k], v as object);
  }
}
