export function generateExceptionMock() {
  return {
    UnauthorizedException: jest.fn().mockImplementation((message) => {
      throw new Error(`Unauthorized: ${message}`);
    }),
    BadRequestException: jest.fn().mockImplementation((message) => {
      throw new Error(`BadRequest: ${message}`);
    }),
    NotFoundException: jest.fn().mockImplementation((message) => {
      throw new Error(`NotFound: ${message}`);
    }),
    ForbiddenException: jest.fn().mockImplementation((message) => {
      throw new Error(`Forbidden: ${message}`);
    }),
    ConflictException: jest.fn().mockImplementation((message) => {
      throw new Error(`Conflict: ${message}`);
    }),
    InternalServerErrorException: jest.fn().mockImplementation((message) => {
      throw new Error(`InternalServerError: ${message}`);
    }),
  };
}