import { BasicUseCase, type IUCRequest } from '@commit-tech/system-shared';
import type { ExceptionAdapter } from '@commit-tech/system-shared/src/domain/adapters/exceptions.adapter';
import type { LoggerAdapter } from '@commit-tech/system-shared/src/domain/adapters/logger.adapter';
import { createAccessToken, createRefreshToken } from 'src/app/utils/authentication/tokensFactory';
import type { BcryptAdapter } from 'src/domain/adapters/bcrypt.adapter';
import type { ConfigEnvAdapter } from 'src/domain/adapters/configEnv.adapter';
import type { JwtAdapter } from 'src/domain/adapters/jwt.adapter';
import type { UserRepository } from 'src/domain/repositories/user.repo';

export interface UsingRefreshTokenUseCaseRequest {
  refreshToken: string;
}

type request = UsingRefreshTokenUseCaseRequest;

export class UsingRefreshTokenUseCase extends BasicUseCase<request, any> {
  constructor(
    readonly logger: LoggerAdapter,
    readonly exception: ExceptionAdapter,
    readonly userRepo: UserRepository,
    readonly bcrypt: BcryptAdapter,
    readonly jwt: JwtAdapter,
    readonly config: ConfigEnvAdapter,
  ) {
    super(logger, exception);
  }
  async execute(input: IUCRequest<request>) {
    const { data } = input;

    const secret = this.config.refreshJwtSecret();
    const tokenPayload = await this.jwt.verify(data.refreshToken, secret);

    const user = await this.userRepo.searchOne({
      id: tokenPayload.userId,
    });

    if (!user) {
      this.exception.UnauthorizedException(
        'Invalid refresh token. Please login again to continue.',
      );
    }

    if (user.getRefreshToken() !== data.refreshToken) {
      this.exception.UnauthorizedException(
        'Refresh token has been revoked. Please login again to continue.',
      );
    }

    const accessToken = createAccessToken(user.id, this.jwt, this.config);
    const refreshToken = createRefreshToken(user.id, this.jwt, this.config);

    user.updateProperties({
      refreshToken,
    });

    await this.userRepo.update(user);

    return {
      token: accessToken,
      refreshToken: refreshToken,
    };
  }
}