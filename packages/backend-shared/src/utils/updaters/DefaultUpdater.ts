import type { PropUpdater } from "../../interfaces/PropUpdater";

export class DefaultUpdater implements PropUpdater {
  canHandle(): boolean {
    return true;
  }
  update(t: any, k: string, v: unknown): void {
    t[k] = v;
  }
}