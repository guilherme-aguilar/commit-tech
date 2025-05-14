import { EAddress } from "./entities/address.entity";

// Dados iniciais para AddressEntity
const defaultProps = {
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  neighborhood: 'neighborhood',
  street: 'street',
  number: '123',
};

describe('EAddress', () => {
  let entity : EAddress;

  beforeEach(() => {
    entity = new EAddress(defaultProps);
  });

  it('deve inicializar id e timestamps corretamente', () => {
    // Arrange
    const entity = new EAddress(defaultProps);

    // Act
    const json = entity.toJSON();

    // Assert
    expect(json.id).toBeDefined();
    expect(json.createdAt).toBeInstanceOf(Date);
    expect(json.updatedAt).toBeNull();
    expect(json.disabledAt).toBeNull();
  });

  it('deve ser possivel desativar um registro corretamente', () => {
    // Arrange
    const entity = new EAddress(defaultProps);

    // Act
    entity.disable();
    const json = entity.toJSON();

    // Assert
    expect(json.disabledAt).toBeInstanceOf(Date);
  });

  it('deve ser possivel atualizar um registro corretamente', () => {
    // Arrange
    const entity = new EAddress(defaultProps);
    const newProps = {
      city: 'newCity',
      state: 'newState',
      neighborhood: 'newNeighborhood',
      street: 'newStreet',
      number: '456',
    };

    // Act
    entity.updateProperties(newProps);
    const json = entity.toJSON();

    // Assert
    expect(json.city).toBe(newProps.city);
    expect(json.state).toBe(newProps.state);
    expect(json.zipCode).toBe("zipCode");
    expect(json.neighborhood).toBe(newProps.neighborhood);
    expect(json.street).toBe(newProps.street);
    expect(json.number).toBe(newProps.number);
  })

  it('deve ser possivel ativar um registro corretamente', () => {
    // Arrange
    const entity = new EAddress(defaultProps);

    // Act
    entity.disable();
    entity.enable();
    const json = entity.toJSON();

    // Assert
    expect(json.disabledAt).toBeNull();
  });
});