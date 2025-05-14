import type { IWhereFilter } from "./filters/general"


export abstract class RBasic<T> {

  abstract insert(data: T): Promise<void>

  abstract update(data: T): Promise<void>

  abstract searchOne(
    where: IWhereFilter<T>,
    includes?: any
  ): Promise<T>

  abstract searchMany(
    filter?: {
      where?: IWhereFilter<T>
    },
    includes?: any
  ): Promise<T[]>

  abstract count(
    filter?: {
      where?: IWhereFilter<T>
    }
  ): Promise<number>

  abstract delete(
    id: string
  ): Promise<void>
}
