


import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GetAuthenticationPayloadUseCase } from 'src/app/useCases/authentication/getAuthenticationPayload';
import { EnvironmentConfigService } from 'src/infra/services/envConfig/environment-config.service';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _getUserData : GetAuthenticationPayloadUseCase,

    @Inject(EnvironmentConfigService)
    private readonly config: EnvironmentConfigService
  ) {
    super({
      secretOrKey: config.jwtSecret(),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false
    });
  }


  async validate(payload: any) {

    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    const userData = this._getUserData.execute({
      data: {
        id: payload.id
      }
    })
 
    return userData;
  }
}
