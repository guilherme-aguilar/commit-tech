

import { IUCRequest } from '@commit-tech/system-shared';
import { SigninUseCase, SigninUseCaseRequest } from './signin';

describe('SigninUseCase - Testes de autenticação de usuário', () => {
  // Mocks dos adaptadores e repositórios
  const loggerMock = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };
  
  const exceptionMock = {
    UnauthorizedException: jest.fn().mockImplementation((message) => {
      throw new Error(`Unauthorized: ${message}`);
    }),
    BadRequestException: jest.fn().mockImplementation((message) => {
      throw new Error(`BadRequest: ${message}`);
    }),
    NotFoundException: jest.fn().mockImplementation((message) => {
      throw new Error(`NotFound: ${message}`);
    }),
    ForbiddenException: jest.fn().mockImplementation((message) => {
      throw new Error(`Forbidden: ${message}`);
    }),
    ConflictException: jest.fn().mockImplementation((message) => {
      throw new Error(`Conflict: ${message}`);
    }),
    InternalServerErrorException: jest.fn().mockImplementation((message) => {
      throw new Error(`InternalServerError: ${message}`);
    }),
  };
  
  const userRepoMock = {
    searchOne: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
    insert: jest.fn(),
    searchMany: jest.fn(),
  };
  
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
  
  // Declaração de variáveis para o teste
  let useCase: SigninUseCase;
  let request: IUCRequest<SigninUseCaseRequest>;
  let mockUser: any;
  
  beforeEach(() => {
    // Inicialização do caso de uso
    useCase = new SigninUseCase(
      loggerMock,
      exceptionMock,
      userRepoMock,
      bcryptMock,
      jwtMock,
      configMock
    );
    
    // Reset dos mocks antes de cada teste
    jest.clearAllMocks();
    
    // Criação do mock de usuário
    mockUser = {
      id: 'user-id-123',
      name: 'Usuario Teste',
      getPassword: jest.fn().mockReturnValue('hashed-password-123'),
      updateProperties: jest.fn(),
    };
    
    // Configuração do request de entrada
    request = {
      data: {
        email: 'usuario@teste.com',
        password: 'senha123'
      },
    };
    
    // Configuração padrão dos mocks
    userRepoMock.searchOne.mockResolvedValue(mockUser);
    bcryptMock.compare.mockResolvedValue(true);
    
    jwtMock.createToken
      .mockReturnValueOnce('access-token-mock')
      .mockReturnValueOnce('refresh-token-mock');
    
    configMock.jwtSecret.mockReturnValue('jwt-secret');
    configMock.jwtExpirationTime.mockReturnValue('1h');
    configMock.refreshJwtSecret.mockReturnValue('refresh-jwt-secret');
    configMock.refreshJwtExpirationTime.mockReturnValue('7d');
  });
  

  it('deve ser possível fazer login quando as credenciais são válidas', async () => {
    // Act
    const result = await useCase.execute(request);
    
    // Assert
    expect(userRepoMock.searchOne).toHaveBeenCalledWith({
      "contactInfo.email": 'usuario@teste.com'
    });
    expect(mockUser.getPassword).toHaveBeenCalled();
    expect(bcryptMock.compare).toHaveBeenCalledWith('senha123', 'hashed-password-123');
    
    // Verificação da criação dos tokens
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
    
    // Verificação da atualização do usuário com o refresh token
    expect(mockUser.updateProperties).toHaveBeenCalledWith({
      refreshToken: 'refresh-token-mock'
    });
    expect(userRepoMock.update).toHaveBeenCalledWith(mockUser);
    
    // Verificação do resultado final
    expect(result).toEqual({
      token: 'access-token-mock',
      refreshToken: 'refresh-token-mock'
    });
  });
  
  it('não deve ser possível fazer login quando o usuário não existe', async () => {
    // Arrange
    userRepoMock.searchOne.mockResolvedValue(null);
    
    // Act & Assert
    await expect(useCase.execute(request))
      .rejects
      .toThrow();
    
    expect(exceptionMock.UnauthorizedException).toHaveBeenCalled();    
  });
  
  it('não deve ser possível fazer login quando a senha está incorreta', async () => {
    // Arrange
    bcryptMock.compare.mockResolvedValue(false);
    
    // Act & Assert
    await expect(useCase.execute(request))
      .rejects
      .toThrow(/unauthorized/i);
    
    expect(exceptionMock.UnauthorizedException).toHaveBeenCalled()
  });
  
  it('não deve ser possível fazer login quando o usuário não tem senha cadastrada', async () => {
    // Arrange
    mockUser.getPassword.mockReturnValue(null);
    
    // Act & Assert
    await expect(useCase.execute(request))
      .rejects
      .toThrow(/unauthorized/i);
    
    expect(exceptionMock.UnauthorizedException).toHaveBeenCalled();
  });

});