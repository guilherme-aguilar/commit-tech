import type { BasicRepository, IWhereFilter } from "@commit-tech/system-shared";
import { ExceptionsService } from "src/infra/services/exceptions/exceptions.service";
import { LoggerService } from "src/infra/services/logger/logger.service";
import type { BasicMapper } from "../../mappers/basic";
import { PrismaService } from "src/infra/services/database/prisma/prisma.service";


export class PrismaBasicRepository<TModel, TEntity, TDatabase> extends PrismaService implements BasicRepository<TModel, TEntity>  {
  protected readonly logger = new LoggerService();
  
  constructor(
    private readonly prismaModel: any,
    private readonly mapper: BasicMapper<TEntity, TDatabase>,
    private readonly exception: ExceptionsService,
  ) {
    super();
  }


  async insert(data: TEntity): Promise<void> {
    try {
      const dbData = this.mapper.toDatabase(data, "create");
      this.logger.verbose("Database", `Inserting record with data: ${JSON.stringify(dbData)}`);
      await this[`${this.prismaModel}`].create({ data: dbData });
    } catch (error) {
      const errorMessage = (error.message || 'Failed to insert record').replace(/\n/g, ' ');
      this.logger.error("Database", errorMessage, error.stack);
      throw this.exception.InternalServerErrorException(errorMessage);
    }
  }

  async update(data: TEntity): Promise<void> {
    try {
      const dbData = this.mapper.toDatabase(data, "update");
      this.logger.verbose("Database", `Updating record with data: ${JSON.stringify(dbData)}`);
      await this[`${this.prismaModel}`].update({
        where: { id: (dbData as any).id },
        data: dbData,
      });
    } catch (error) {
      const errorMessage = (error.message || 'Failed to update record').replace(/\n/g, ' ');
      this.logger.error("Database", errorMessage, error.stack);
      throw this.exception.InternalServerErrorException(errorMessage);
    }
  }

  async searchOne(where: IWhereFilter<TModel>, includes?: any): Promise<TEntity> {
    try {
      const prismaWhere = await this.buildingWhereFilter(where);
      const dbData = await this[`${this.prismaModel}`].findFirst({
        where: prismaWhere,
        include: includes,
      });
      if (!dbData) {
        const errorMessage = `Record:${this.prismaModel} not found`;
        this.logger.warn("Database", errorMessage);
        throw this.exception.NotFoundException(errorMessage);
      }
      this.logger.verbose("Database", `Found record: ${JSON.stringify(dbData)}`);
      return this.mapper.toEntity(dbData);
    } catch (error) {
      const errorMessage = (error.message || 'Failed to search record').replace(/\n/g, ' ');
      this.logger.error("Database", errorMessage, error.stack);
      throw this.exception.InternalServerErrorException(errorMessage);
    }
  }
  async searchMany(filter?: { where?: IWhereFilter<TModel> | undefined }, includes?: any): Promise<TEntity[]> {
    try {
      const prismaWhere = filter?.where ? this.buildingWhereFilter(filter.where) : undefined;
      this.logger.verbose("Database", `Searching records with where: ${JSON.stringify(prismaWhere)}`);
      const dbData = await this[`${this.prismaModel}`].findMany({
        where: prismaWhere,
        include: includes,
      });
      this.logger.verbose("Database", `Found ${dbData.length} records`);
      return dbData.map((item: TDatabase) => this.mapper.toEntity(item));
    } catch (error) {
      const errorMessage = (error.message || 'Failed to search records').replace(/\n/g, ' ');
      this.logger.error("Database", errorMessage, error.stack);
      throw this.exception.InternalServerErrorException(errorMessage);
    }
  }

  async count(filter?: { where?: IWhereFilter<TModel> | undefined }): Promise<number> {
    try {
      const prismaWhere = filter?.where ? this.buildingWhereFilter(filter.where) : undefined;
      this.logger.verbose("Database", `Counting records with where: ${JSON.stringify(prismaWhere)}`);
      const count = await this[`${this.prismaModel}`].count({
        where: prismaWhere,
      });
      this.logger.verbose("Database", `Found ${count} records`);
      return count;
    } catch (error) {
      const errorMessage = (error.message || 'Failed to count records').replace(/\n/g, ' ');
      this.logger.error("Database", errorMessage, error.stack);
      throw this.exception.InternalServerErrorException(errorMessage);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.logger.verbose("Database", `Deleting record with id: ${id}`);
      await this[`${this.prismaModel}`].delete({
        where: { id },
      });
    } catch (error) {
      const errorMessage = (error.message || 'Failed to delete record').replace(/\n/g, ' ');
      this.logger.error("Database", errorMessage, error.stack);
      throw this.exception.InternalServerErrorException(errorMessage);
    }
  }

  async insertMany(data: TEntity[]): Promise<void> {
    try {
      const dbData = data.map((item) => this.mapper.toDatabase(item, "create"));
      this.logger.verbose("Database", `Inserting ${dbData.length} records`);
      await this[`${this.prismaModel}`].createMany({
        data: dbData,
      });
    } catch (error) {
      const errorMessage = (error.message || 'Failed to insert multiple records').replace(/\n/g, ' ');
      this.logger.error("Database", errorMessage, error.stack);
      throw this.exception.InternalServerErrorException(errorMessage);
    }
  }
}