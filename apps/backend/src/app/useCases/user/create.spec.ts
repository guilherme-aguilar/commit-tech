import { IUCRequest } from '@commit-tech/system-shared';
import { generateBasicRepositoryMock } from 'src/app/utils/tests/generateBasicRepositoryMock';
import { generateExceptionMock } from 'src/app/utils/tests/generateExceptionMock';
import { generateLoggerMock } from 'src/app/utils/tests/generateLoggerMock';
import { UserEntity } from 'src/domain/entities/user.entity';
import { UserCreateUseCase, UserCreateUseCaseRequest } from './create';
import e from 'express';

// Mock do UserEntity
jest.mock('src/domain/entities/user.entity');

describe('UserCreateUseCase - Testes de criação de usuários', () => {
  // Mocks dos adaptadores e repositórios
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

  // Declaração de variáveis para o teste
  let useCase: UserCreateUseCase;
  let request: IUCRequest<UserCreateUseCaseRequest[]>;
  let mockUserEntity: any;

  beforeEach(() => {
    // Inicialização do caso de uso
    useCase = new UserCreateUseCase(
      loggerMock,
      exceptionMock,
      bcryptMock,
      jwtMock,
      configMock,
      userRepoMock, // UserRepo
      userRepoMock, // userRepo (duplicado na classe original)
    );

    // Reset dos mocks antes de cada teste
    jest.clearAllMocks();

    // Reset do mock de UserEntity
    (UserEntity as jest.Mock).mockClear();

    // Criação do mock do UserEntity
    mockUserEntity = {
      id: 'user-id-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashed-password-123',
    };

    // Configuração do mock do UserEntity constructor
    (UserEntity as jest.Mock).mockImplementation(() => mockUserEntity);

    // Configuração do request de entrada para um único usuário
    request = {
      data: [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'senha123',
        },
      ],
    };

    // Configuração padrão dos mocks
    userRepoMock.searchMany.mockResolvedValue([]);
    bcryptMock.hash.mockResolvedValue('hashed-password-123');
    userRepoMock.insertMany.mockResolvedValue(undefined);
  });

  it('deve criar um usuário com sucesso quando os dados são válidos', async () => {
    // Act
    await useCase.execute(request);

    // Assert
    expect(userRepoMock.searchMany).toHaveBeenCalledWith({
      where: {
        address: {},
        email: 'john.doe@example.com',
      },
    });

    expect(bcryptMock.hash).toHaveBeenCalledWith('senha123');

    expect(UserEntity).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',

      email: 'john.doe@example.com',

      password: 'hashed-password-123',
    });

    expect(userRepoMock.insertMany).toHaveBeenCalledWith([mockUserEntity]);
  });

  it('deve criar múltiplos usuários com sucesso quando os dados são válidos', async () => {
    // Arrange
    const mockUserEntity2 = {
      id: 'user-id-456',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: 'hashed-password-456',
    };

    // Mock do UserEntity constructor para retornar diferentes instâncias
    (UserEntity as jest.Mock)
      .mockImplementationOnce(() => mockUserEntity)
      .mockImplementationOnce(() => mockUserEntity2);

    // Request com múltiplos usuários
    request = {
      data: [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'senha123',
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          password: 'senha456',
        },
      ],
    };

    bcryptMock.hash
      .mockResolvedValueOnce('hashed-password-123')
      .mockResolvedValueOnce('hashed-password-456');

    // Act
    await useCase.execute(request);

    // Assert
    expect(userRepoMock.searchMany).toHaveBeenCalledTimes(2);
    expect(bcryptMock.hash).toHaveBeenCalledTimes(2);
    expect(UserEntity).toHaveBeenCalledTimes(2);

    expect(userRepoMock.insertMany).toHaveBeenCalledWith([
      mockUserEntity,
      mockUserEntity2,
    ]);
  });

  it('deve criar um usuário sem senha quando o password não é fornecido', async () => {
    // Arrange
    request = {
      data: [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          // password não fornecido
        },
      ],
    };

    // Act
    await useCase.execute(request);

    // Assert
    expect(bcryptMock.hash).not.toHaveBeenCalled();

    expect(UserEntity).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: null,
    });

    expect(userRepoMock.insertMany).toHaveBeenCalledWith([mockUserEntity]);
  });

  it('deve criar um usuário sem senha quando o password é null', async () => {
    // Arrange
    request = {
      data: [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: null,
        },
      ],
    };

    // Act
    await useCase.execute(request);

    // Assert
    expect(bcryptMock.hash).not.toHaveBeenCalled();

    expect(UserEntity).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: null,
    });
  });

  it('não deve criar usuário quando o email já existe', async () => {
    // Arrange
    const existingUser = {
      id: 'existing-user-id',
      firstName: 'Existing',
      lastName: 'User',
      email: 'john.doe@example.com',
    };

    userRepoMock.searchMany.mockResolvedValue([existingUser]);

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(/already exists/i);

    expect(exceptionMock.NotFoundException).toHaveBeenCalledWith(
      'User email: john.doe@example.com - already exists',
    );

    expect(bcryptMock.hash).not.toHaveBeenCalled();
    expect(UserEntity).not.toHaveBeenCalled();
    expect(userRepoMock.insertMany).not.toHaveBeenCalled();
  });

  it('deve verificar a existência do email para cada usuário independentemente', async () => {
    // Arrange
    request = {
      data: [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'senha123',
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          password: 'senha456',
        },
      ],
    };

    // Simula que o segundo email já existe
    userRepoMock.searchMany
      .mockResolvedValueOnce([]) // primeiro email não existe
      .mockResolvedValueOnce([{ id: 'existing-user' }]); // segundo email existe

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(
      /jane.smith@example.com - already exists/i,
    );

    expect(userRepoMock.searchMany).toHaveBeenCalledTimes(2);
    expect(bcryptMock.hash).toHaveBeenCalledTimes(1); // Só deve hash a senha do primeiro usuário
    expect(UserEntity).toHaveBeenCalledTimes(1); // Só deve criar o primeiro usuário
    expect(userRepoMock.insertMany).not.toHaveBeenCalled(); // Não deve inserir nenhum usuário
  });
});
