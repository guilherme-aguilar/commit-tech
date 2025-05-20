import { Controller, Inject } from '@nestjs/common';
import type { SigninUseCase } from 'src/app/useCases/authentication/signin';
import type { UsingRefreshTokenUseCase } from 'src/app/useCases/authentication/usingRefreshToken';

@Controller('auth')
export class UserController {

  constructor(
   
    @Inject()
    private readonly _signinUseCase: SigninUseCase,

    @Inject()
    private readonly _refreshTokenUseCase: UsingRefreshTokenUseCase,
  ) { }

}