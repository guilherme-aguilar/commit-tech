import type { IWhereFilter } from "../../app/filters/general"


export abstract class BasicRepository<TModel, TEntity> {

  abstract insert(data: TEntity): Promise<void>

  abstract update(data: TEntity): Promise<void>

  abstract searchOne(
    where: IWhereFilter<TModel>,
    includes?: any
  ): Promise<TEntity>

  abstract searchMany(
    filter?: {
      where?: IWhereFilter<TModel>
    },
    includes?: any
  ): Promise<TEntity[]>

  abstract count(
    filter?: {
      where?: IWhereFilter<TModel>
    }
  ): Promise<number>

  abstract delete(
    id: string
  ): Promise<void>

  abstract insertMany(data: TEntity[]): Promise<void>
}
