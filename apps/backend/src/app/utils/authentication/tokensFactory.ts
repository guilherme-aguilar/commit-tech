import type { JwtAdapter } from 'src/domain/adapters/jwt.adapter';
import type { ConfigEnvAdapter } from 'src/domain/adapters/configEnv.adapter';

export function createAccessToken(userId: string, jwt: JwtAdapter, config: ConfigEnvAdapter): string {
  return jwt.createToken(
    { userId },
    'access',
    config.jwtSecret(),
    config.jwtExpirationTime()
  );
}

export function createRefreshToken(userId: string, jwt: JwtAdapter, config: ConfigEnvAdapter): string {
  return jwt.createToken(
    { userId },
    'refresh',
    config.refreshJwtSecret(),
    config.refreshJwtExpirationTime()
  );
}
