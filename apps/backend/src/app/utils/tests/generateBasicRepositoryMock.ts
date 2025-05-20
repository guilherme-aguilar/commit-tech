export function generateBasicRepositoryMock(otherMethods: any = {}) {
  return {
    searchOne: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    delete: jest.fn(),
    insert: jest.fn(),
    insertMany: jest.fn(),
    searchMany: jest.fn(),
    ...otherMethods,
  }
}