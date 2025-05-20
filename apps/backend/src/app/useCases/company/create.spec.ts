import { IUCRequest } from '@commit-tech/system-shared';
import { generateBasicRepositoryMock } from 'src/app/utils/tests/generateBasicRepositoryMock';
import { generateExceptionMock } from 'src/app/utils/tests/generateExceptionMock';
import { generateLoggerMock } from 'src/app/utils/tests/generateLoggerMock';
import { CompanyCreateUseCase, CompanyCreateUseCaseRequest } from './create';

describe('CompanyCreateUseCase - Testes de criação de empresa', () => {
  const loggerMock = generateLoggerMock();
  const exceptionMock = generateExceptionMock();
  const companyRepoMock = generateBasicRepositoryMock();  
  const userRepoMock = generateBasicRepositoryMock();

  let useCase: CompanyCreateUseCase;
  let request: IUCRequest<CompanyCreateUseCaseRequest[]>;
  let mockCompany: any;

  beforeEach(() => {
    useCase = new CompanyCreateUseCase(
      loggerMock,
      exceptionMock,
      companyRepoMock,
      userRepoMock
    );

    jest.clearAllMocks();

    mockCompany = {
      name: 'Empresa Teste',
      fantasyName: 'Empresa Fantasia',
      identification: '12345678000190',
      personType: 'LEGAL',
      address: {
        street: 'Rua Teste',
        number: '123',
        complement: 'Sala 1',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        zipCode: '01234567'
      },
      contactInfo: {
        email: 'contato@empresa.com',
        phone: '11999998888',
        website: 'www.empresa.com'
      },
      agent: {
        firstName: 'João',
        lastName: 'Silva',
        identification: '12345678900',
        position: 'Diretor',
        contactInfo: {
          email: 'joao@empresa.com',
          phone: '11999997777'
        }
      }
    };

    companyRepoMock.searchMany.mockResolvedValue([]);
    companyRepoMock.insertMany.mockResolvedValue([]);

    request = {
      data: [mockCompany]
    };
  });

  it('deve ser possível criar uma empresa quando todos os dados são válidos', async () => {
    await useCase.execute(request);

    expect(companyRepoMock.searchMany).toHaveBeenCalledWith({
      where: {
        identification: {
          equals: '12345678000190'
        }
      }
    });

    expect(companyRepoMock.insertMany).toHaveBeenCalled();
    const insertedCompanies = companyRepoMock.insertMany.mock.calls[0][0];
    expect(insertedCompanies).toHaveLength(1);

    const company = JSON.parse(JSON.stringify(insertedCompanies[0]));
    expect(company).toMatchObject({
      name: 'Empresa Teste',
      fantasyName: 'Empresa Fantasia',
      identification: '12345678000190',
      personType: 'LEGAL'
    });
  });

  it('deve ser possível criar múltiplas empresas em uma única chamada', async () => {
    const secondCompany = {
      name: 'Segunda Empresa',
      identification: '98765432000199',
      personType: 'LEGAL',
      address: {
        street: 'Rua Dois',
        number: '456',
        district: 'Bairro',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'Brasil',
        zipCode: '22222333'
      },
      contactInfo: {
        email: 'contato@segunda.com',
        phone: '2199998888'
      }
    };

    request.data = [mockCompany, secondCompany];

    await useCase.execute(request);

    expect(companyRepoMock.searchMany).toHaveBeenCalledTimes(2);
    expect(companyRepoMock.insertMany).toHaveBeenCalled();

    const insertedCompanies = companyRepoMock.insertMany.mock.calls[0][0];
    expect(insertedCompanies).toHaveLength(2);

    const company1 = JSON.parse(JSON.stringify(insertedCompanies[0]));
    const company2 = JSON.parse(JSON.stringify(insertedCompanies[1]));

    expect(company1.name).toBe('Empresa Teste');
    expect(company2.name).toBe('Segunda Empresa');
  });

  it('não deve ser possível criar uma empresa com identificação duplicada', async () => {
    companyRepoMock.searchMany.mockResolvedValueOnce([{ id: 'existing-company' }]);

    await expect(useCase.execute(request))
      .rejects
      .toThrow(/already exists/i);

    expect(exceptionMock.NotFoundException).toHaveBeenCalled();
    expect(companyRepoMock.insertMany).not.toHaveBeenCalled();
  });

  it('deve validar se a criação de empresa acontece sem nome fantasia', async () => {
    const companyWithoutFantasyName = JSON.parse(JSON.stringify(mockCompany));
    delete companyWithoutFantasyName.fantasyName;
    request.data = [companyWithoutFantasyName];

    await useCase.execute(request);

    const insertedCompanies = companyRepoMock.insertMany.mock.calls[0][0];
    const plainCompany = JSON.parse(JSON.stringify(insertedCompanies[0]));

    expect(plainCompany.fantasyName).toBeNull();
    expect(plainCompany.name).toBe('Empresa Teste');
  });

  it('deve validar se a criação de empresa acontece sem agente responsável', async () => {
    const companyWithoutAgent = { ...mockCompany };
    delete companyWithoutAgent.agent;
    request.data = [companyWithoutAgent];

    await useCase.execute(request);

    const insertedCompanies = companyRepoMock.insertMany.mock.calls[0][0];
    const plainCompany = JSON.parse(JSON.stringify(insertedCompanies[0]));

    expect(plainCompany.agent).toBeNull();
  });

  it('deve processar corretamente quando receber um array vazio de empresas', async () => {
    request.data = [];

    await useCase.execute(request);

    expect(companyRepoMock.searchMany).not.toHaveBeenCalled();
    expect(companyRepoMock.insertMany).toHaveBeenCalledWith([]);
  });
});
