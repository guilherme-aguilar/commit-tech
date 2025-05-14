import type { Replace } from "./helpers/replace";
import type { PropUpdater } from "./interfaces/PropUpdater";
import { ArrayUpdater } from "./utils/updaters/ArrayUpdater";
import { DateUpdater } from "./utils/updaters/DateUpdater";
import { DefaultUpdater } from "./utils/updaters/DefaultUpdater";
import { ObjectUpdater } from "./utils/updaters/ObjectUpdater";
import { deepMerge } from "./utils/deepMerge";
import { generateId } from "./utils/generateId";

export interface MBasic {
  createdAt?: Date;
  updatedAt?: Date | null; 
  disabledAt?: Date | null;
}
export class EBasic<T extends MBasic> {
  protected readonly _id: string;
  protected props: T;
  private updaters: PropUpdater[];

  constructor(
    props: Replace<T, { createdAt?: Date }> ,
    id?: string,
    updaters?: PropUpdater[]
  ) {
    this._id = id ?? generateId();
    this.updaters = updaters ?? [
      new DateUpdater(),
      new ArrayUpdater(),
      new ObjectUpdater(),
      new DefaultUpdater(),
    ];
    this.props = this.initializeProps(props);
  }

  private initializeProps(props: Replace<T, { createdAt?: Date }>): T {
    return {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      disabledAt: props.disabledAt ?? null,
      updatedAt: props.updatedAt ?? null,
    } as T;
  }

  public updateProperties(patch: Partial<Omit<T, keyof MBasic>>): this {
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      for (const up of this.updaters) {
        if (up.canHandle(value, this.props, key)) {
          up.update(this.props, key, value);
          break;
        }
      }
    });
    this.props.updatedAt = new Date();
    return this;
  }

  public toJSON() {
    return { id: this._id, ...this.props};
  }

  public enable() {
    this.props.disabledAt = null;
  }

  public disable() {
    this.props.disabledAt = new Date();
  }
}