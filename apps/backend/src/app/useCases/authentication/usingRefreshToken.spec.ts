
import type { JwtAdapter } from 'src/domain/adapters/jwt.adapter';
import type { ConfigEnvAdapter } from 'src/domain/adapters/configEnv.adapter';
import { createAccessToken, createRefreshToken } from 'src/app/utils/authentication/tokensFactory';

describe('tokensFactory - Funções de geração de token', () => {
  const jwtMock: jest.Mocked<JwtAdapter> = {
    createToken: jest.fn(),
    verify: jest.fn(),
  };

  const configMock: jest.Mocked<ConfigEnvAdapter> = {
    jwtSecret: jest.fn(),
    jwtExpirationTime: jest.fn(),
    refreshJwtSecret: jest.fn(),
    refreshJwtExpirationTime: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jwtMock.createToken
      .mockReturnValueOnce('access-token-mock')
      .mockReturnValueOnce('refresh-token-mock');

    configMock.jwtSecret.mockReturnValue('jwt-secret');
    configMock.jwtExpirationTime.mockReturnValue('1h');
    configMock.refreshJwtSecret.mockReturnValue('refresh-jwt-secret');
    configMock.refreshJwtExpirationTime.mockReturnValue('7d');
  });

  it('deve criar um token de acesso com os parâmetros corretos', () => {
    const token = createAccessToken('user-id-test', jwtMock, configMock);

    expect(jwtMock.createToken).toHaveBeenCalledWith(
      { userId: 'user-id-test' },
      'access',
      'jwt-secret',
      '1h'
    );
    expect(token).toBe('access-token-mock');
  });

  it('deve criar um token de refresh com os parâmetros corretos', () => {
    const token = createRefreshToken('user-id-test', jwtMock, configMock);

    expect(jwtMock.createToken).toHaveBeenCalledWith(
      { userId: 'user-id-test' },
      'refresh',
      'refresh-jwt-secret',
      '7d'
    );
    expect(token).toBe('refresh-token-mock');
  });
});
