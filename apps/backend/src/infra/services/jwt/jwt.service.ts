
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtAdapter } from 'src/domain/adapters/jwt.adapter';


export interface jwtContent {
  userId: string;
  type: 'access' | 'refresh';
  expiresIn: string;
}

@Injectable()
export class JwtTokenService implements JwtAdapter {
  constructor(private readonly jwtService: JwtService) {}
 
  createToken(payload: { userId: string; }, type: 'access' | 'refresh', secret: string, expiresIn: string): string {
    return this.jwtService.sign({
      ...payload,
      type
    }, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  verify(token: string, secret: string) {
    const decode : jwtContent = this.jwtService.verify(token, {
      secret: secret
    });
    return decode;
  }

 
}

