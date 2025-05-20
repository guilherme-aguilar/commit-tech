import { Module } from '@nestjs/common';
import { HttpControllersModule } from './infra/http/http.module';
import { BcryptModule } from './infra/services/bcrypt/bcrypt.module';
import { PrismaModule } from './infra/services/database/prisma/prisma.module';
import { EnvironmentConfigModule } from './infra/services/envConfig/environment-config.module';
import { ExceptionsModule } from './infra/services/exceptions/exceptions.module';
import { JwtLocalModule } from './infra/services/jwt/jwt.module';
import { LocalLoggerModule } from './infra/services/logger/logger.module';



@Module({
  imports: [
    PrismaModule,
    LocalLoggerModule,
    ExceptionsModule,
    EnvironmentConfigModule,
    JwtLocalModule,
    BcryptModule,

    HttpControllersModule
  ],
  controllers: [],
  providers: [],
})
export class AppV1Module {}
