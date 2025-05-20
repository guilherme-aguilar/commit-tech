import { BasicUseCase, type IUCRequest } from '@commit-tech/system-shared';
import type { ExceptionAdapter } from '@commit-tech/system-shared/src/domain/adapters/exceptions.adapter';
import type { LoggerAdapter } from '@commit-tech/system-shared/src/domain/adapters/logger.adapter';
import type { WhatsappAdapter } from 'src/domain/adapters/whatsapp.adapter';
import type { WhatsappRepository } from 'src/domain/repositories/whatsapp.repo';

export interface SendMessageRequest {
  id: string;
  to: string;
  message: string;
};

type request = SendMessageRequest;

export class WhatsappSendMessageUseCase extends BasicUseCase<request, any> {
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

    const instance = await this.whatsappRepo.searchOne({
       id: data.id, 
    });

    if (!instance) {
      this.exception.NotFoundException('WhatsApp instance not found');
    }

    const instanceData = instance.toJSON();

    await this.whatsappAdapter.sendMessage({
      to: data.to,
      message: data.message,
      name: instanceData.name,
    })
  }
}