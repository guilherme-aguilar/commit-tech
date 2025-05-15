import { generateId } from "../../app/utils/generateId";
import { ArrayUpdater } from "../../app/utils/updaters/ArrayUpdater";
import { DateUpdater } from "../../app/utils/updaters/DateUpdater";
import { DefaultUpdater } from "../../app/utils/updaters/DefaultUpdater";
import { ObjectUpdater } from "../../app/utils/updaters/ObjectUpdater";
import type { Replace } from "../../helpers/replace";
import type { PropUpdater } from "../adapters/PropUpdater";


export interface BasicModel {
  createdAt?: Date;
  updatedAt?: Date | null; 
  disabledAt?: Date | null;
}
export class BasicEntity<T extends BasicModel> {
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

  public updateProperties(patch: Partial<Omit<T, keyof BasicModel>>): this {
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