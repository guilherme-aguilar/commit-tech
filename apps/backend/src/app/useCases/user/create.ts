import {
  BasicUseCase,
  type AddressModel,
  type ContactInfoModel,
  type IUCRequest,
} from '@commit-tech/system-shared';
import type { ExceptionAdapter } from '@commit-tech/system-shared/src/domain/adapters/exceptions.adapter';
import type { LoggerAdapter } from '@commit-tech/system-shared/src/domain/adapters/logger.adapter';
import type { BcryptAdapter } from 'src/domain/adapters/bcrypt.adapter';
import type { ConfigEnvAdapter } from 'src/domain/adapters/configEnv.adapter';
import type { JwtAdapter } from 'src/domain/adapters/jwt.adapter';
import { UserEntity } from 'src/domain/entities/user.entity';
import type { UserRepository } from 'src/domain/repositories/user.repo';

export interface UserCreateUseCaseRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string | null;
}

type request = UserCreateUseCaseRequest[];

export class UserCreateUseCase extends BasicUseCase<request, any> {
  constructor(
    readonly logger: LoggerAdapter,
    readonly exception: ExceptionAdapter,
    readonly bcrypt: BcryptAdapter,
    readonly jwt: JwtAdapter,
    readonly config: ConfigEnvAdapter,
    readonly UserRepo: UserRepository,
    readonly userRepo: UserRepository,
  ) {
    super(logger, exception);
  }

  async execute(input: IUCRequest<request>) {
    const data = input.data;

    const userEntities: UserEntity[] = [];

    for (const userData of data) {
      const { firstName, lastName, email, password } = userData;
      const existingUser = await this.userRepo.searchMany({
        where: {
          email: email,
          address: {
            
          }
        },
      });

      if (existingUser.length > 0) {
        this.exception.NotFoundException(
          `User email: ${email} - already exists`,
        );
      }
      let passwordHash: string | null = null;

      if (password && password !== null) {
        passwordHash = await this.bcrypt.hash(password);
      }

      const userEntity = new UserEntity({
        firstName,
        lastName,
        email: email,
        password: passwordHash,
      });

      userEntities.push(userEntity);
    }

    await this.userRepo.insertMany(userEntities);
  }
}
