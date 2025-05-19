import { BasicRepository } from "@commit-tech/system-shared";
import type { UserEntity, UserModel } from "../entities/user.entity";


export abstract class UserRepository extends BasicRepository<UserModel, UserEntity> {
 
}