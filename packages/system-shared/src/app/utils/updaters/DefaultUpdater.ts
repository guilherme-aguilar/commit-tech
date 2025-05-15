import type { PropUpdater } from "../../../domain/adapters/PropUpdater";

export class DefaultUpdater implements PropUpdater   {
  canHandle(): boolean {
    return true;
  }
  update(t: any, k: string, v: unknown): void {
    t[k] = v;
  }
}