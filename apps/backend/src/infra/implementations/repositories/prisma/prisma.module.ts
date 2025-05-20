import { Module } from "@nestjs/common";
import { PrismaUserRepository } from "./userRepository";
import { PrismaModule } from "src/infra/services/database/prisma/prisma.module";

const repositories = [
  PrismaUserRepository
]

@Module({
  imports: [],
  providers: repositories,
  exports: repositories
})
export class PrismaRepositoriesModule {}