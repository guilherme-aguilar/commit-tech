import { BasicUseCase, type IUCRequest } from '@commit-tech/system-shared';
import type { ExceptionAdapter } from '@commit-tech/system-shared/src/domain/adapters/exceptions.adapter';
import type { LoggerAdapter } from '@commit-tech/system-shared/src/domain/adapters/logger.adapter';
import type { BcryptAdapter } from 'src/domain/adapters/bcrypt.adapter';
import type { ConfigEnvAdapter } from 'src/domain/adapters/configEnv.adapter';
import type { JwtAdapter } from 'src/domain/adapters/jwt.adapter';
import type { UserRepository } from 'src/domain/repositories/user.repo';

export interface GetAuthenticationPayloadUseCaseRequest {
  id: string;
}

type request = GetAuthenticationPayloadUseCaseRequest;

export class GetAuthenticationPayloadUseCase extends BasicUseCase<request, any> {
  constructor(
    readonly logger: LoggerAdapter,
    readonly exception: ExceptionAdapter,
    readonly userRepo: UserRepository,
  ) {
    super(logger, exception);
  }
  async execute(input: IUCRequest<request>) {
    const { data } = input;

    const user = await this.userRepo.searchOne({
      id: data.id,
    });

    if (!user) {
      this.exception.UnauthorizedException('Invalid credentials. Please login again to continue.');
    }

    const {
      firstName,
      lastName,
    } = user.toJSON();

    return {
      user: {
        id: user.id,
        name: `${firstName} ${lastName}`,
      },
      permissions: {
        user: null,
        company: null,  
      }
    }
  }
}
