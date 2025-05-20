
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtLocalModule as JwtServiceModule } from '../../services/jwt/jwt.module';
import { LocalLoggerModule } from '../../services/logger/logger.module';
import { ExceptionsModule } from '../../services/exceptions/exceptions.module';

import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { AuthUseCaseProxyModule } from 'src/infra/proxy/modules/auth.module';

@Module({
  imports: [
    AuthUseCaseProxyModule,
    LocalLoggerModule,
    BcryptModule,
    ExceptionsModule,
    PassportModule,
    JwtModule.register({
      secret: "teste",
      signOptions: { expiresIn: '24h' },
    }),
    BcryptModule,
    JwtServiceModule,
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
