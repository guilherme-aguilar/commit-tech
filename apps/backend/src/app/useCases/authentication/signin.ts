import { BasicUseCase, type IUCRequest } from '@commit-tech/system-shared';
import type { ExceptionAdapter } from '@commit-tech/system-shared/src/domain/adapters/exceptions.adapter';
import type { LoggerAdapter } from '@commit-tech/system-shared/src/domain/adapters/logger.adapter';
import { Injectable } from '@nestjs/common';
import { createAccessToken, createRefreshToken } from 'src/app/utils/authentication/tokensFactory';
import type { BcryptAdapter } from 'src/domain/adapters/bcrypt.adapter';
import type { ConfigEnvAdapter } from 'src/domain/adapters/configEnv.adapter';
import type { JwtAdapter } from 'src/domain/adapters/jwt.adapter';
import type { UserRepository } from 'src/domain/repositories/user.repo';

export interface SigninUseCaseRequest {
  email: string;
  password: string;
}

type request = SigninUseCaseRequest;

@Injectable()
export class SigninUseCase extends BasicUseCase<request, any> {
  constructor(
    readonly logger: LoggerAdapter,
    readonly exception: ExceptionAdapter,
    readonly userRepo: UserRepository,
    readonly bcrypt: BcryptAdapter,
    readonly jwt: JwtAdapter,
    readonly config: ConfigEnvAdapter
  ) {
    super(logger, exception);
  }
  async execute(input: IUCRequest<request>){
    const { data } = input;

    const user = await this.userRepo.searchOne({
    email: data.email,
    })

    if (!user) {
      this.exception.UnauthorizedException('invalid credentials, check your email and password');
    }

    const password = user.getPassword();

    if (
      !password || !(await this.bcrypt.compare(data.password, password))
    ) {
      this.exception.UnauthorizedException('invalid credentials, check your email and password');
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
    }
  }
}
