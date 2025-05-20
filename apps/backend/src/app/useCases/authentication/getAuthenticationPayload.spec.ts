import { IUCRequest } from '@commit-tech/system-shared';
import { generateBasicRepositoryMock } from 'src/app/utils/tests/generateBasicRepositoryMock';
import { generateExceptionMock } from 'src/app/utils/tests/generateExceptionMock';
import { generateLoggerMock } from 'src/app/utils/tests/generateLoggerMock';
import { GetAuthenticationPayloadUseCase, GetAuthenticationPayloadUseCaseRequest } from './getAuthenticationPayload';

describe('GetAuthenticationPayloadUseCase - Testes de payload de autenticação', () => {
  const loggerMock = generateLoggerMock();
  const exceptionMock = generateExceptionMock();
  const userRepoMock = generateBasicRepositoryMock();

  let useCase: GetAuthenticationPayloadUseCase;
  let request: IUCRequest<GetAuthenticationPayloadUseCaseRequest>;

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new GetAuthenticationPayloadUseCase(
      loggerMock,
      exceptionMock,
      userRepoMock,
    );

    request = {
      data: {
        id: 'user-123',
      }
    };
  });

  it('deve retornar o payload corretamente quando o usuário existe', async () => {
    const mockUser = {
      id: 'user-123',
      toJSON: () => ({
        id: 'user-123',
        firstName: 'Maria',
        lastName: 'Silva'
      })
    };

    userRepoMock.searchOne.mockResolvedValue(mockUser);

    const result = await useCase.execute(request);

    expect(userRepoMock.searchOne).toHaveBeenCalledWith({ id: 'user-123' });
    expect(result).toEqual({
      user: {
        id: 'user-123',
        name: 'Maria Silva'
      },
      permissions: {
        user: null,
        company: null
      }
    });
  });

  it('deve lançar UnauthorizedException quando o usuário não for encontrado', async () => {
    userRepoMock.searchOne.mockResolvedValue(null);

    await expect(useCase.execute(request)).rejects.toThrow();

    expect(exceptionMock.UnauthorizedException).toHaveBeenCalledWith(
      'Invalid credentials. Please login again to continue.'
    );

    expect(userRepoMock.searchOne).toHaveBeenCalledWith({ id: 'user-123' });
  });
});
