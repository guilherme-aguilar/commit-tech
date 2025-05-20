import { BasicUseCase, type AddressModel, type ContactInfoModel, type IUCRequest } from '@commit-tech/system-shared';
import type { ExceptionAdapter } from '@commit-tech/system-shared/src/domain/adapters/exceptions.adapter';
import type { LoggerAdapter } from '@commit-tech/system-shared/src/domain/adapters/logger.adapter';
import { CompanyEntity } from 'src/domain/entities/company.entity';
import type { CompanyRepository } from 'src/domain/repositories/company.repo';
import type { UserRepository } from 'src/domain/repositories/user.repo';

export interface CompanyCreateUseCaseRequest {
  name: string;
  fantasyName?: string;
  identification: string;
  personType: string,
  agent?: {
    firstName: string;
    lastName: string;
    contactInfo: ContactInfoModel;
    identification: string;
    position?: string;
  }
  address: AddressModel;
  contactInfo: ContactInfoModel;
};

type request = CompanyCreateUseCaseRequest[];

export class CompanyCreateUseCase extends BasicUseCase<request, any> {
  constructor(
    readonly logger: LoggerAdapter,
    readonly exception: ExceptionAdapter,

    readonly companyRepo: CompanyRepository,
    readonly userRepo: UserRepository,
  ) {
    super(logger, exception);
  }
  async execute(input: IUCRequest<request>) {
    const data = input.data;

    const companyEntities: CompanyEntity[] = [];

    for (const companyData of data) {
      const { name, identification, personType, address, contactInfo, agent, fantasyName } = companyData;

      const existingCompany = await this.companyRepo.searchMany({
        where: {
          identification: {
            equals: identification,
          },
        },
      });

      if (existingCompany.length > 0) {
        this.exception.NotFoundException(`Company identification:${identification} - already exists`);
      }

      const companyEntity = new CompanyEntity({
        name,
        identification,
        personType,
        address,
        contactInfo,
        fantasyName,
        agent,
      });

      companyEntities.push(companyEntity);
    }

    await this.companyRepo.insertMany(companyEntities);
  }
}