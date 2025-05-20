import { Body, Controller, Get, Post } from '@nestjs/common';
import { SigninUseCase } from 'src/app/useCases/authentication/signin';
import { UsingRefreshTokenUseCase } from 'src/app/useCases/authentication/usingRefreshToken';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly signinUseCase: SigninUseCase, // ✅ Nest injeta automaticamente
    private readonly usingRefreshTokenUseCase: UsingRefreshTokenUseCase, // ✅ Nest injeta automaticamente
  ) {}

  // exemplo de uso
  @Post('signin')
  async login(@Body() body: { email: string; password: string }) {
    return this.signinUseCase.execute({
      data: {
        email: body.email,
        password: body.password,
      },
    });
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.usingRefreshTokenUseCase.execute({
      data: {
        refreshToken: body.refreshToken,
      },
    });
  }
}
