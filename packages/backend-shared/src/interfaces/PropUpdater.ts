export interface PropUpdater {
  canHandle(value: unknown, target?: any, key?: string): boolean;
  update(target: any, key: string, value: unknown): void;
}