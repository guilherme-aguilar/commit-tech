import type { UserEntity, UserModel } from "src/domain/entities/user.entity";
import type { UserRepository } from "src/domain/repositories/user.repo";
import { ExceptionsService } from "src/infra/services/exceptions/exceptions.service";
import { LoggerService } from "src/infra/services/logger/logger.service";
import { UserMapper } from "../../mappers/userMapper";
import { PrismaBasicRepository } from "./basic";

export class PrismaUserRepository extends PrismaBasicRepository<UserModel, UserEntity, any > implements UserRepository {
  
  constructor() {
    super(
      "user",
      new UserMapper(),
      new ExceptionsService(),
    );
  }}
