import { BasicUseCase, type IUCRequest } from '@commit-tech/system-shared';
import type { ExceptionAdapter } from '@commit-tech/system-shared/src/domain/adapters/exceptions.adapter';
import type { LoggerAdapter } from '@commit-tech/system-shared/src/domain/adapters/logger.adapter';
import type { WhatsappAdapter } from 'src/domain/adapters/whatsapp.adapter';
import type { WhatsappRepository } from 'src/domain/repositories/whatsapp.repo';

export interface FindInstancesRequest {
  userId: string;
};

type request = FindInstancesRequest;

export class WhatsappFindInstancesUseCase extends BasicUseCase<request, any> {
  constructor(
    readonly logger: LoggerAdapter,
    readonly exception: ExceptionAdapter,

    readonly whatsappRepo: WhatsappRepository,
    readonly whatsappAdapter: WhatsappAdapter
  ) {
    super(logger, exception);
  }

  async execute(input: IUCRequest<request>) {
    const data = input.data;

    const instances = await this.whatsappRepo.searchMany({
      where: {
        userId: data.userId,
      }
    });

    if (!instances) {
      this.exception.NotFoundException('WhatsApp instance not found');
    }

    const instanceData = instances.map(i => i.toJSON());

    const instancesFeachData = await this.whatsappAdapter.findInstances(
      instanceData.map(i => i.integrationId)
    );

    console.log(instancesFeachData)

    return instanceData.map(i => ({
      id: i.id,
      name: i.name,
      integrationToken: i.integrationToken,
      integrationId: i.integrationId,
      connectionStatus: instancesFeachData.find(d => d.integrationId === i.integrationId)?.connectionStatus,
    }));
  }
}