export interface ConfigEnvAdapter {
  jwtSecret: () => string;
  jwtExpirationTime: () => string;

  refreshJwtSecret: () => string;
  refreshJwtExpirationTime: () => string;
}