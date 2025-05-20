import type { BasicMapper } from './basic';
import { UserEntity } from 'src/domain/entities/user.entity';
import { AddressEntity, ContactInfoEntity } from '@commit-tech/system-shared';
import type { Prisma } from '@prisma/client';

type getDatabaseFormat = Prisma.UserGetPayload<{
  include: { phones: true; address: true };
}>;

type create = Prisma.UserCreateInput;
type update = Prisma.UserUpdateInput;


type toDatabase = create | update;

export class UserMapper implements BasicMapper<UserEntity, getDatabaseFormat> {
  toEntity(data: getDatabaseFormat): UserEntity {
    const address = data.address
      ? new AddressEntity(
          {
            street: data.address.street,
            number: data.address.number,
            complement: data.address.complement as string | undefined, // Handle nullable complement
            neighborhood: data.address.neighborhood,
            city: data.address.city,
            state: data.address.state,
            zipCode: data.address.zipCode,
          },
          data.address.id,
        )
      : undefined;

    return new UserEntity(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address: address?.toJSON(),
        password: data.password ?? null,
        refreshToken: data.refreshToken ?? null,
      },
      data.id,
    );
  }

  toDatabase(
    data: UserEntity,
    type: 'update' | 'create' = 'create',
  ): toDatabase {
    const {
      email,
      firstName,
      id,
      lastName,
      address,
      password,
      phone,
      refreshToken,
    } = data.toJSON();

    if (type === 'update') {
      const data: update = {
        id: id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password as string | null,
        refreshToken: refreshToken as string | null,
      };

      return data;
    }

    const createData: create = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password as string | null,
      refreshToken: refreshToken as string | null,
    };

    return createData;
  }
}
