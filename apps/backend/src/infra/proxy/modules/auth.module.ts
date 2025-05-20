import { Module } from "@nestjs/common";
import { GetAuthenticationPayloadUseCase } from "src/app/useCases/authentication/getAuthenticationPayload";
import { SigninUseCase } from "src/app/useCases/authentication/signin";
import { UsingRefreshTokenUseCase } from "src/app/useCases/authentication/usingRefreshToken";
import { PrismaRepositoriesModule } from "src/infra/implementations/repositories/prisma/prisma.module";
import { PrismaUserRepository } from "src/infra/implementations/repositories/prisma/userRepository";
import { BcryptService } from "src/infra/services/bcrypt/bcrypt.service";
import { EnvironmentConfigService } from "src/infra/services/envConfig/environment-config.service";
import { ExceptionsService } from "src/infra/services/exceptions/exceptions.service";
import { JwtTokenService } from "src/infra/services/jwt/jwt.service";
import { LoggerService } from "src/infra/services/logger/logger.service";

@Module({
  imports: [PrismaRepositoriesModule],
  providers: [
    {
      provide: SigninUseCase,
      useFactory: (
        logger: LoggerService,
        exceptions: ExceptionsService,
        userRepo: PrismaUserRepository,
        jwt: JwtTokenService,
        bcrypt: BcryptService,
        config: EnvironmentConfigService,
      ) => new SigninUseCase(logger, exceptions, userRepo, bcrypt, jwt, config),
      inject: [
        LoggerService,
        ExceptionsService,
        PrismaUserRepository,
        JwtTokenService,
        BcryptService,
        EnvironmentConfigService,
      ],
    },
    {
      provide: UsingRefreshTokenUseCase,
      useFactory: (
        logger: LoggerService,
        exceptions: ExceptionsService,
        userRepo: PrismaUserRepository,
        jwt: JwtTokenService,
        bcrypt: BcryptService,
        config: EnvironmentConfigService,
      ) => new UsingRefreshTokenUseCase(logger, exceptions, userRepo, bcrypt, jwt, config),
      inject: [
        LoggerService,
        ExceptionsService,
        PrismaUserRepository,
        JwtTokenService,
        BcryptService,
        EnvironmentConfigService,
      ],
    },

    //AuthenticationPayload
    {
      provide: GetAuthenticationPayloadUseCase,
      useFactory: (
        logger: LoggerService,
        exceptions: ExceptionsService,
        userRepo: PrismaUserRepository,

      ) => new GetAuthenticationPayloadUseCase(logger, exceptions, userRepo),
      inject: [
        LoggerService,
        ExceptionsService,
        PrismaUserRepository,
      ],
    },
  ],
  exports: [SigninUseCase, UsingRefreshTokenUseCase, GetAuthenticationPayloadUseCase], // 👈 ESSENCIAL
})
export class AuthUseCaseProxyModule {}
