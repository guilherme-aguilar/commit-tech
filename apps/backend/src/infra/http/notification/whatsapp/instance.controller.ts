import { Body, Controller, Delete, Get, Param, Patch, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { WhatsappConnectInstanceUseCase } from 'src/app/useCases/notifications/whatsapp/instance/connect';
import { WhatsappCreateInstanceUseCase } from 'src/app/useCases/notifications/whatsapp/instance/create';
import { WhatsappDeleteInstanceUseCase } from 'src/app/useCases/notifications/whatsapp/instance/delete';
import { WhatsappDisconnectInstanceUseCase } from 'src/app/useCases/notifications/whatsapp/instance/disconnect';
import { WhatsappFindInstancesUseCase } from 'src/app/useCases/notifications/whatsapp/instance/find';

@Controller('whatsapp')
export class NotificationsWhatsappInstanceController {
  constructor(
    private readonly whatsappCreateInstanceUseCase: WhatsappCreateInstanceUseCase,
    private readonly whatsappDeleteInstanceUseCase: WhatsappDeleteInstanceUseCase,
    private readonly whatsappFindInstancesUseCase: WhatsappFindInstancesUseCase,
    private readonly whatsappConnectInstanceUseCase: WhatsappConnectInstanceUseCase,
    private readonly whatsappDisconnectInstanceUseCase: WhatsappDisconnectInstanceUseCase,
  ) {}

  @Post('instance')
  async createNewInstance(@Body() body: { name: string; userId: string }) {
    await this.whatsappCreateInstanceUseCase.execute({
      data: {
        name: body.name,
        userId: body.userId,
      },
    });
  }

  @Delete('instance')
  async deleteInstance(@Body() body: { id: string; userId: string }) {
    await this.whatsappDeleteInstanceUseCase.execute({
      data: {
        id: body.id,
        userId: body.userId,
      },
    });
  }

  @Get('instances')
  async findInstances(@Body() body: { userId: string }) {
    const instances = await this.whatsappFindInstancesUseCase.execute({
      data: {
        userId: body.userId,
      },
    });

    return instances;
  }

  @Get('instance/connect')
  async connectInstance(
    @Body() body: { id: string; userId: string }
  ) {
    return await this.whatsappConnectInstanceUseCase.execute({
      data: {
        id: body.id,
        userId: body.userId,
      },
    });
  }

  @Get('instance/connect/qrcode')
  async connectInstanceQrcode(
    @Body() body: { id: string; userId: string },
    @Res() res: Response
  ) {
    const data = await this.whatsappConnectInstanceUseCase.execute({
      data: {
        id: body.id,
        userId: body.userId,
      },
    });


    const base64 = data.connectCredentials.base64 as string;

    // Detecta o tipo MIME do base64 (se tiver prefixo)
    const matches = base64.match(/^data:(.+);base64,(.+)$/);

    if (!matches) {
      throw new Error('Invalid base64 format');
    }
    
    const mimeType = matches[1];
    const imageBuffer = Buffer.from(matches[2], 'base64');

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', 'inline; filename="qrcode.png"');
    res.send(imageBuffer);
  }

  @Patch('instance/disconnect/:id')
  async disconnectInstance(
    @Body() body: {userId: string },

    @Param('id') id: string,
  ) {
    await this.whatsappDisconnectInstanceUseCase.execute({
      data: {
        id: id,
        userId: body.userId,
      },
    });
  }
}