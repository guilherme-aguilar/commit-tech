import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { WhatsappAdapter } from 'src/domain/adapters/whatsapp.adapter';
import { ExceptionsService } from '../exceptions/exceptions.service';
import { LoggerService } from '../logger/logger.service';

interface CreateInstanceResponse {
  instance: {
    instanceId: string;
    instanceName: string;
    integration: string;
  };
  hash: string;
  qrcode: {
    code: string;
    base64: string;
  };
}

interface getChatsResponse { id: string; remoteJid: string; pushName: string; profilePicUrl: string; }[]

@Injectable()
export class EvolutionApiService implements WhatsappAdapter {
  private readonly baseUrl = 'https://notifica.mirrorisp.com.br';
  private readonly globalApiKey = '429683C4C977415CAAFCCE10F7D57E11';
  private readonly headers = {
    'Content-Type': 'application/json',
    apikey: this.globalApiKey,
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: LoggerService,
    private readonly exception: ExceptionsService,
  ) {}


  async readMessagesToChat(data: { name: string; chatId?: string; fromMe?: boolean; }): Promise<{ total: number; pages: number; currentPage: number; records: { id: string; key: { id: string; fromMe: boolean; remoteJid: string; }; pushName: string; messageType: string; message: { conversation: string; }; messageTimestamp: string; instanceId: string; source: any; contextInfo: { expiration: number; }; MessageUpdate: []; }; }> {
    const url = `${this.baseUrl}/chat/findMessages/${data.name}`;

    try {

      const bodyRequest = {
        where: {
          key: {
              ...(data?.chatId? { remoteJid: data.chatId } : {}),
              ...(data?.fromMe? { fromMe: data.fromMe } : {}),
          }
        }
      }

      console.log(bodyRequest )
      const  response = await firstValueFrom(
        this.httpService.post(
          url,
          bodyRequest,
          {
            headers: this.headers,
          },
        ),
      );

      const responseData = response.data

      return responseData;

    } catch (error) {
      console.log(error);
      this.logger.error('Erro ao conectar-se a instância de servico', error);
      throw this.exception.InternalServerErrorException(
        'Falha ao conectar-se a instância de WhatsApp',
      );
    }
  }
  async getChatsRegistered(name: string): Promise<{ id: string; remoteJid: string; pushName: string; profilePicUrl: string; }[]> {
    const url = `${this.baseUrl}/chat/findChats/${name}`;

    try {
      const  response = await firstValueFrom(
        this.httpService.post<getChatsResponse[]>(
          url,
          {},
          {
            headers: this.headers,
          },
        ),
      );


      const data = response.data
      return data.map((chat) => ({
        id: chat.id,
        remoteJid: chat.remoteJid,
        pushName: chat.pushName,
        profilePicUrl: chat.profilePicUrl,
      }));

    } catch (error) {
      console.log(error);
      this.logger.error('Erro ao conectar-se a instância de servico', error);
      throw this.exception.InternalServerErrorException(
        'Falha ao conectar-se a instância de WhatsApp',
      );
    }
  }

  async sendMessage(messageContent: {
    name: string;
    to: string;
    message: string;
  }): Promise<void> {
    const url = `${this.baseUrl}/message/sendText/${messageContent.name}`;

    try {
      await firstValueFrom(
        this.httpService.post(
          url,
          {
            number: messageContent.to,
            text: messageContent.message,
          },
          {
            headers: this.headers,
          },
        ),
      );
    } catch (error) {
      console.log(error);
      this.logger.error('Erro ao conectar-se a instância de servico', error);
      throw this.exception.InternalServerErrorException(
        'Falha ao conectar-se a instância de WhatsApp',
      );
    }
  }

  async disconnectInstance(instance: { name: string }): Promise<void> {
    const url = `${this.baseUrl}/instance/logout/${instance.name}`;

    try {
      const response = await firstValueFrom(
        this.httpService.delete(url, {
          headers: this.headers,
        }),
      );
    } catch (error) {
      this.logger.error('Erro ao deletar instância de servico', error);
      throw this.exception.InternalServerErrorException(
        'Falha ao criar instância de WhatsApp',
      );
    }
  }

  async connectInstance(instance: {
    name: string;
  }): Promise<{
    pairingCode: number | null;
    code: string | null;
    base64: string | null;
    count: 11;
  }> {
    const url = `${this.baseUrl}/instance/connect/${instance.name}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.headers,
        }),
      );

      const data = response.data;

      return {
        pairingCode: data.pairingCode || null,
        code: data.code || null,
        base64: data.base64 || null,
        count: data.count || 0,
      };
    } catch (error) {
      console.log(error);
      this.logger.error('Erro ao conectar-se a instância de servico', error);
      throw this.exception.InternalServerErrorException(
        'Falha ao conectar-se a instância de WhatsApp',
      );
    }
  }
  async findInstances(instancesId: string[]): Promise<any> {
    const url = `${this.baseUrl}/instance/fetchInstances`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.headers,
        }),
      );

      const data = response.data;

      return data.map((instance) => ({
        integrationId: instance.id,
        connectionStatus: instance.connectionStatus,
        name: instance.instanceName,
      }));
    } catch (error) {
      this.logger.error('Erro ao deletar instância de servico', error);
      throw this.exception.InternalServerErrorException(
        'Falha ao deletar instância de WhatsApp',
      );
    }
  }

  async deleteInstance(instance: { name: string }): Promise<void> {
    const url = `${this.baseUrl}/instance/delete/${instance.name}`;

    try {
      const response = await firstValueFrom(
        this.httpService.delete(url, {
          headers: this.headers,
        }),
      );
    } catch (error) {
      this.logger.error('Erro ao deletar instância de servico', error);
      throw this.exception.InternalServerErrorException(
        'Falha ao criar instância de WhatsApp',
      );
    }
  }

  async createInstance(instance: { name: string }): Promise<{
    id: string;
    name: string;
    integration: string;
    token: string;
  }> {
    const url = `${this.baseUrl}/instance/create`;

    try {
      const response = await firstValueFrom(
        this.httpService.post<CreateInstanceResponse>(
          url,
          {
            instanceName: instance.name, // <-- CORREÇÃO AQUI
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS',
          },
          {
            headers: this.headers,
          },
        ),
      );

      const data = response.data;

      return {
        id: data.instance.instanceId,
        name: data.instance.instanceName,
        integration: data.instance.integration,
        token: data.hash,
      };
    } catch (error) {
      this.logger.error('Erro ao criar instância de servico', error);
      throw this.exception.InternalServerErrorException(
        'Falha ao criar instância de WhatsApp',
      );
    }
  }
}
