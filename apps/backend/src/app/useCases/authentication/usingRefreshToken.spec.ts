import { IUCRequest } from '@commit-tech/system-shared';
import { generateBasicRepositoryMock } from 'src/app/utils/tests/generateBasicRepositoryMock';
import { generateExceptionMock } from 'src/app/utils/tests/generateExceptionMock';
import { generateLoggerMock } from 'src/app/utils/tests/generateLoggerMock';
import { UsingRefreshTokenUseCase, UsingRefreshTokenUseCaseRequest } from './usingRefreshToken';

describe('UsingRefreshTokenUseCase - Testes de renovação de token', () => {
  const loggerMock = generateLoggerMock();
  const exceptionMock = generateExceptionMock();
  const userRepoMock = generateBasicRepositoryMock();

  const bcryptMock = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const jwtMock = {
    createToken: jest.fn(),
    verify: jest.fn(),
  };

  const configMock = {
    jwtSecret: jest.fn(),
    jwtExpirationTime: jest.fn(),
    refreshJwtSecret: jest.fn(),
    refreshJwtExpirationTime: jest.fn(),
  };

  let useCase: UsingRefreshTokenUseCase;
  let request: IUCRequest<UsingRefreshTokenUseCaseRequest>;
  let mockUser: any;
  let tokenPayload: any;

  beforeEach(() => {
    useCase = new UsingRefreshTokenUseCase(
      loggerMock,
      exceptionMock,
      userRepoMock,
      bcryptMock,
      jwtMock,
      configMock
    );

    jest.clearAllMocks();

    mockUser = {
      id: 'user-id-123',
      name: 'Usuario Teste',
      updateProperties: jest.fn(),
      getRefreshToken: jest.fn().mockReturnValue('valid-refresh-token-123'),
    };

    tokenPayload = {
      userId: 'user-id-123',
      type: 'refresh',
    };

    request = {
      data: {
        refreshToken: 'valid-refresh-token-123',
      },
    };

    jwtMock.verify.mockResolvedValue(tokenPayload);
    userRepoMock.searchOne.mockResolvedValue(mockUser);

    jwtMock.createToken
      .mockReturnValueOnce('new-access-token-mock')
      .mockReturnValueOnce('new-refresh-token-mock');

    configMock.jwtSecret.mockReturnValue('jwt-secret');
    configMock.jwtExpirationTime.mockReturnValue('1h');
    configMock.refreshJwtSecret.mockReturnValue('refresh-jwt-secret');
    configMock.refreshJwtExpirationTime.mockReturnValue('7d');
  });

  it('deve renovar os tokens quando o refresh token é válido', async () => {
    const result = await useCase.execute(request);

    expect(configMock.refreshJwtSecret).toHaveBeenCalled();
    expect(jwtMock.verify).toHaveBeenCalledWith('valid-refresh-token-123', 'refresh-jwt-secret');
    expect(userRepoMock.searchOne).toHaveBeenCalledWith({ id: 'user-id-123' });

    expect(jwtMock.createToken).toHaveBeenCalledTimes(2);
    expect(jwtMock.createToken).toHaveBeenNthCalledWith(
      1,
      { userId: 'user-id-123' },
      'access',
      'jwt-secret',
      '1h'
    );
    expect(jwtMock.createToken).toHaveBeenNthCalledWith(
      2,
      { userId: 'user-id-123' },
      'refresh',
      'refresh-jwt-secret',
      '7d'
    );

    expect(mockUser.updateProperties).toHaveBeenCalledWith({
      refreshToken: 'new-refresh-token-mock',
    });
    expect(userRepoMock.update).toHaveBeenCalledWith(mockUser);

    expect(result).toEqual({
      token: 'new-access-token-mock',
      refreshToken: 'new-refresh-token-mock',
    });
  });

  it('deve lançar exceção quando o refresh token é inválido', async () => {
    jwtMock.verify.mockRejectedValue(new Error('Invalid token'));

    await expect(useCase.execute(request)).rejects.toThrow();
  });

  it('deve lançar exceção quando o usuário não existe mais', async () => {
    userRepoMock.searchOne.mockResolvedValue(null);

    await expect(useCase.execute(request)).rejects.toThrow(/Invalid refresh token/i);

    expect(exceptionMock.UnauthorizedException).toHaveBeenCalledWith(
      'Invalid refresh token. Please login again to continue.',
    );
  });

  it('deve lançar exceção quando o refresh token está revogado (diferente do salvo no usuário)', async () => {
    mockUser.getRefreshToken = jest.fn().mockReturnValue('different-refresh-token');
    userRepoMock.searchOne.mockResolvedValue(mockUser);

    await expect(useCase.execute(request)).rejects.toThrow(/revoked/i);

    expect(exceptionMock.UnauthorizedException).toHaveBeenCalledWith(
      'Refresh token has been revoked. Please login again to continue.',
    );
  });

  it('deve verificar o refresh token com o secret correto', async () => {
    await useCase.execute(request);

    expect(configMock.refreshJwtSecret).toHaveBeenCalled();
    expect(jwtMock.verify).toHaveBeenCalledWith('valid-refresh-token-123', 'refresh-jwt-secret');
  });

  it('deve criar um novo access token e refresh token', async () => {
    await useCase.execute(request);

    expect(jwtMock.createToken).toHaveBeenCalledTimes(2);
    expect(jwtMock.createToken).toHaveBeenNthCalledWith(
      1,
      { userId: 'user-id-123' },
      'access',
      'jwt-secret',
      '1h'
    );
    expect(jwtMock.createToken).toHaveBeenNthCalledWith(
      2,
      { userId: 'user-id-123' },
      'refresh',
      'refresh-jwt-secret',
      '7d'
    );
  });

  it('deve atualizar o refreshToken no usuário e salvar no repositório', async () => {
    await useCase.execute(request);

    expect(mockUser.updateProperties).toHaveBeenCalledWith({
      refreshToken: 'new-refresh-token-mock',
    });
    expect(userRepoMock.update).toHaveBeenCalledWith(mockUser);
  });
});
