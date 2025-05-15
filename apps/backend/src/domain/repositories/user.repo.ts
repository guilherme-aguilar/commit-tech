import type { UserEntity } from "../entities/user.entity";
import { BasicRepository } from "@commit-tech/system-shared";


export interface UserRepository extends BasicRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity>;
}