import type { PropUpdater } from "../../interfaces/PropUpdater";

export class DateUpdater implements PropUpdater {
  canHandle(v: unknown): boolean {
    return v instanceof Date;
  }
  update(t: any, k: string, v: unknown): void {
    t[k] = new Date(v as Date);
  }
}
