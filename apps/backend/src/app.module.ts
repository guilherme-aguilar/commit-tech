import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/services/database/prisma/prisma.module';
import { EnvironmentConfigModule } from './infra/services/envConfig/environment-config.module';
import { ExceptionsModule } from './infra/services/exceptions/exceptions.module';
import { JwtLocalModule } from './infra/services/jwt/jwt.module';
import { LocalLoggerModule } from './infra/services/logger/logger.module';
import { BcryptService } from './infra/services/bcrypt/bcrypt.service';
import { BcryptModule } from './infra/services/bcrypt/bcrypt.module';
import { HttpModule } from './infra/http/http.module';



@Module({
  imports: [
    PrismaModule,
    LocalLoggerModule,
    ExceptionsModule,
    EnvironmentConfigModule,
    JwtLocalModule,
    BcryptModule,

    HttpModule
  ],
  controllers: [],
  providers: [],
})
export class AppV1Module {}
