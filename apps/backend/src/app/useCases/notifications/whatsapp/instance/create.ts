import { BasicUseCase, type IUCRequest } from '@commit-tech/system-shared';
import type { ExceptionAdapter } from '@commit-tech/system-shared/src/domain/adapters/exceptions.adapter';
import type { LoggerAdapter } from '@commit-tech/system-shared/src/domain/adapters/logger.adapter';
import type { WhatsappAdapter } from 'src/domain/adapters/whatsapp.adapter';
import { WhatsappEntity } from 'src/domain/entities/whatsapp.entity';
import type { UserRepository } from 'src/domain/repositories/user.repo';
import type { WhatsappRepository } from 'src/domain/repositories/whatsapp.repo';

export interface CompanyCreateUseCaseRequest {
  name: string;
  userId: string;
};

type request = CompanyCreateUseCaseRequest;

export class WhatsappCreateInstanceUseCase extends BasicUseCase<request, any> {
  constructor(
    readonly logger: LoggerAdapter,
    readonly exception: ExceptionAdapter,

    readonly userRepo: UserRepository,
    readonly whatsappRepo: WhatsappRepository,
    readonly whatsappAdapter: WhatsappAdapter
  ) {
    super(logger, exception);
  }
  async execute(input: IUCRequest<request>) {
    const data = input.data;

    const user = await this.userRepo.searchOne({
      id: data.userId,
    });

    if (!user) {
      this.exception.NotFoundException('User not found');
    }

    const userInstances = await this.whatsappRepo.count({
      where: {
        userId: data.userId,
      }
    });

    if (userInstances >= 3) {
      this.exception.BadRequestException('User can only have a maximum of 3 WhatsApp instances');
    }

    const response = await this.whatsappAdapter.createInstance({
      name: data.name,
    });

    const entity = new WhatsappEntity({
      name: data.name,
      integrationToken: response.token,
      integrationId: response.id,
      userId: data.userId,
    })

    await this.whatsappRepo.insert(entity);
  }
}