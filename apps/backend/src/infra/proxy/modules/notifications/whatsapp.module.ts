import { Module } from '@nestjs/common';
import { WhatsappConnectInstanceUseCase } from 'src/app/useCases/notifications/whatsapp/instance/connect';
import { WhatsappCreateInstanceUseCase } from 'src/app/useCases/notifications/whatsapp/instance/create';
import { WhatsappDeleteInstanceUseCase } from 'src/app/useCases/notifications/whatsapp/instance/delete';
import { WhatsappDisconnectInstanceUseCase } from 'src/app/useCases/notifications/whatsapp/instance/disconnect';
import { WhatsappFindInstancesUseCase } from 'src/app/useCases/notifications/whatsapp/instance/find';
import { WhatsappGetChatsUseCase } from 'src/app/useCases/notifications/whatsapp/message/getChats';
import { WhatsappReadMessagesUseCase } from 'src/app/useCases/notifications/whatsapp/message/readMessages';
import { WhatsappSendMessageUseCase } from 'src/app/useCases/notifications/whatsapp/message/send';
import { PrismaRepositoriesModule } from 'src/infra/implementations/repositories/prisma/prisma.module';
import { PrismaUserRepository } from 'src/infra/implementations/repositories/prisma/userRepository';
import { PrismaWhatsappRepository } from 'src/infra/implementations/repositories/prisma/whatsappRepository';
import { EvolutionApiModule } from 'src/infra/services/evolutionApi/evolutionApi.module';
import { EvolutionApiService } from 'src/infra/services/evolutionApi/evolutionApi.service';
import { ExceptionsService } from 'src/infra/services/exceptions/exceptions.service';
import { LoggerService } from 'src/infra/services/logger/logger.service';

@Module({
  imports: [PrismaRepositoriesModule, EvolutionApiModule],
  providers: [
    //WhatsappCreateInstanceUseCase
    {
      provide: WhatsappCreateInstanceUseCase,
      useFactory: (
        logger: LoggerService,
        exceptions: ExceptionsService,

        userRepo: PrismaUserRepository,
        whatsappRepo: PrismaWhatsappRepository,
        whatsappAdapter: EvolutionApiService,
      ) =>
        new WhatsappCreateInstanceUseCase(
          logger,
          exceptions,

          userRepo,
          whatsappRepo,
          whatsappAdapter,
        ),
      inject: [
        LoggerService,
        ExceptionsService,

        PrismaUserRepository,
        PrismaWhatsappRepository,
        EvolutionApiService,
      ],
    },
    //WhatsappDeleteInstanceUseCase
    {
      provide: WhatsappDeleteInstanceUseCase,
      useFactory: (
        logger: LoggerService,
        exceptions: ExceptionsService,

        whatsappRepo: PrismaWhatsappRepository,
        whatsappAdapter: EvolutionApiService,
      ) =>
        new WhatsappDeleteInstanceUseCase(
          logger,
          exceptions,

          whatsappRepo,
          whatsappAdapter,
        ),
      inject: [
        LoggerService,
        ExceptionsService,

        PrismaWhatsappRepository,
        EvolutionApiService,
      ],
    },
    //WhatsappFindInstancesUseCase
    {
      provide: WhatsappFindInstancesUseCase,
      useFactory: (
        logger: LoggerService,
        exceptions: ExceptionsService,

        whatsappRepo: PrismaWhatsappRepository,
        whatsappAdapter: EvolutionApiService,
      ) =>
        new WhatsappFindInstancesUseCase(
          logger,
          exceptions,

          whatsappRepo,
          whatsappAdapter,
        ),
      inject: [
        LoggerService,
        ExceptionsService,

        PrismaWhatsappRepository,
        EvolutionApiService,
      ],
    },
    //WhatsappConnectInstanceUseCase
    {
      provide: WhatsappConnectInstanceUseCase,
      useFactory: (
        logger: LoggerService,
        exceptions: ExceptionsService,

        whatsappRepo: PrismaWhatsappRepository,
        whatsappAdapter: EvolutionApiService,
      ) =>
        new WhatsappConnectInstanceUseCase(
          logger,
          exceptions,

          whatsappRepo,
          whatsappAdapter,
        ),
      inject: [
        LoggerService,
        ExceptionsService,

        PrismaWhatsappRepository,
        EvolutionApiService,
      ],
    },
    //WhatsappDisconnectInstanceUseCase
    {
      provide: WhatsappDisconnectInstanceUseCase,
      useFactory: (
        logger: LoggerService,
        exceptions: ExceptionsService,

        whatsappRepo: PrismaWhatsappRepository,
        whatsappAdapter: EvolutionApiService,
      ) =>
        new WhatsappDisconnectInstanceUseCase(
          logger,
          exceptions,

          whatsappRepo,
          whatsappAdapter,
        ),
      inject: [
        LoggerService,
        ExceptionsService,

        PrismaWhatsappRepository,
        EvolutionApiService,
      ],
    },


    //WhatsappSendMessageUseCase
    {
      provide: WhatsappSendMessageUseCase,
      useFactory: (
        logger: LoggerService,
        exceptions: ExceptionsService,

        whatsappRepo: PrismaWhatsappRepository,
        whatsappAdapter: EvolutionApiService,
      ) =>
        new WhatsappSendMessageUseCase(
          logger,
          exceptions,

          whatsappRepo,
          whatsappAdapter,
        ),
      inject: [
        LoggerService,
        ExceptionsService,

        PrismaWhatsappRepository,
        EvolutionApiService,
      ],
    },
    //WhatsappGetChatsUseCase
    {
      provide: WhatsappGetChatsUseCase,
      useFactory: (
        logger: LoggerService,
        exceptions: ExceptionsService,

        whatsappRepo: PrismaWhatsappRepository,
        whatsappAdapter: EvolutionApiService,
      ) =>
        new WhatsappGetChatsUseCase(
          logger,
          exceptions,

          whatsappRepo,
          whatsappAdapter,
        ),
      inject: [
        LoggerService,
        ExceptionsService,

        PrismaWhatsappRepository,
        EvolutionApiService,
      ],
    },
    //WhatsappReadMessagesUseCase
    {
      provide: WhatsappReadMessagesUseCase,
      useFactory: (
        logger: LoggerService,
        exceptions: ExceptionsService,

        whatsappRepo: PrismaWhatsappRepository,
        whatsappAdapter: EvolutionApiService,
      ) =>
        new WhatsappReadMessagesUseCase(
          logger,
          exceptions,

          whatsappRepo,
          whatsappAdapter,
        ),
      inject: [
        LoggerService,
        ExceptionsService,

        PrismaWhatsappRepository,
        EvolutionApiService,
      ],
    },
  ],
  exports: [
    WhatsappCreateInstanceUseCase,
    WhatsappDeleteInstanceUseCase,
    WhatsappFindInstancesUseCase,
    WhatsappConnectInstanceUseCase,
    WhatsappDisconnectInstanceUseCase,


    WhatsappSendMessageUseCase,
    WhatsappGetChatsUseCase,
    WhatsappReadMessagesUseCase
  ],
})
export class NotificationsWhatsappUseCaseProxyModule {}
