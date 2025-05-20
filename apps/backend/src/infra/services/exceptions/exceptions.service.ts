import type { ExceptionAdapter } from '@commit-tech/system-shared/src/domain/adapters/exceptions.adapter';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';


@Injectable()
export class ExceptionsService implements ExceptionAdapter  {

  NotFoundException(message?: string): void {
    throw new NotFoundException(message);
  }
  BadRequestException(message?: string): void {
    throw new BadRequestException(message);
  }
  InternalServerErrorException(message?: string): void {
    throw new InternalServerErrorException(message);
  }
  ForbiddenException(message?: string): void {
    throw new ForbiddenException(message);
  }
  UnauthorizedException(message?: string): void {
    throw new UnauthorizedException(message);
  }

  ConflictException(message?: string): void {
    throw new ConflictException(message);
  }
}