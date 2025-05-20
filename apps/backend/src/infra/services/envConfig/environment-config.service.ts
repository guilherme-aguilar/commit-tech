import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ConfigEnvAdapter } from 'src/domain/adapters/configEnv.adapter';

@Injectable()
export class EnvironmentConfigService implements ConfigEnvAdapter {
  constructor(private configService: ConfigService) {}
  
  jwtSecret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  jwtExpirationTime(): string {
    return this.configService.getOrThrow<string>('JWT_EXPIRATION_TIME');
  }

  refreshJwtSecret(): string {
    return this.configService.getOrThrow<string>('REFRESH_JWT_SECRET');
  }

  refreshJwtExpirationTime(): string {
    return this.configService.getOrThrow<string>('REFRESH_JWT_EXPIRATION_TIME');
  }
}
