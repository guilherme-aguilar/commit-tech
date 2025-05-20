import type { BasicMapper } from './basic';
import { AddressEntity, ContactInfoEntity } from '@commit-tech/system-shared';
import type { Prisma } from '@prisma/client';
import { WhatsappEntity } from 'src/domain/entities/whatsapp.entity';

type getDatabaseFormat = Prisma.WhatsappGetPayload<{
  include: {user: true;};
}>;

type create = Prisma.WhatsappCreateInput;
type update = Prisma.WhatsappUpdateInput;


type toDatabase = create | update;

export class WhatsappMapper implements BasicMapper<WhatsappEntity, getDatabaseFormat> {
  toEntity(data: getDatabaseFormat): WhatsappEntity {
    return new WhatsappEntity({
      name: data.name,
      integrationId: data.integrationId,
      userId: data.userId,
      integrationToken: data.integrationToken,
    }, data.id)
  }

  toDatabase(
    data: WhatsappEntity,
    type: 'update' | 'create' = 'create',
  ): toDatabase {
    const {
     id,
      name,
      integrationId,
      userId,
      integrationToken,

    } = data.toJSON();

    if (type === 'update') {
      const data: update = {
        id: id,
       integrationId: integrationId,
       integrationToken: integrationToken,
       name: name,
      };

      return data;
    }

    const createData: create = {
      integrationId: integrationId,
      integrationToken: integrationToken,
      name: name,
      user: {
        connect: {
          id: userId,
        },
      },
      id: id,
    };

    return createData;
  }
}
