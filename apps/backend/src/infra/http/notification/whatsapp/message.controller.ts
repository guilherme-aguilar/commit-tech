import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { WhatsappGetChatsUseCase } from 'src/app/useCases/notifications/whatsapp/message/getChats';
import { WhatsappReadMessagesUseCase } from 'src/app/useCases/notifications/whatsapp/message/readMessages';
import { WhatsappSendMessageUseCase } from 'src/app/useCases/notifications/whatsapp/message/send';

@Controller('whatsapp')
export class NotificationsWhatsappMessageController {
  constructor(
    private readonly whatsappSendMessageUseCase: WhatsappSendMessageUseCase,
    private readonly whatsappGetChatsUseCase: WhatsappGetChatsUseCase,
    private readonly whatsappReadMessagesUseCase: WhatsappReadMessagesUseCase
  ) {}

  @Post('message/send/:id')
  async createNewInstance(
    @Body() body: { message: string; to: string },
    @Param('id') id: string
  ) {
    await this.whatsappSendMessageUseCase.execute({
      data: {
        id,
        message: body.message,
        to: body.to,
      },
    });
  }

  @Get('message/chats/:id')
  async getChats(
    @Param('id') id: string) {
    return await this.whatsappGetChatsUseCase.execute({
      data: {
        id
      },
    });
  }

  @Get('message/read/:id')
  async readMessages(
    @Param('id') id: string,
    @Query() query: { to?: string, fromMe?: string }
  ) {
    return await this.whatsappReadMessagesUseCase.execute({
      data: {
        id,
        to: query.to,
        fromMe: query.fromMe ? (query.fromMe === "true" ? true : false) : undefined
      }
    })

  }
}