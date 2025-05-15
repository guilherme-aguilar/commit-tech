export interface ExceptionAdapter {
  badRequestException(message?: string): void;
  internalServerErrorException(message?: string): void;
  forbiddenException(message?: string): void;
  UnauthorizedException(message?: string): void;
  NotFoundException(message?: string): void;
  ConflictException(message?: string): void;  
}
