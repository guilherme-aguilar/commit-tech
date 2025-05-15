import { BasicEntity, type BasicModel,  } from "./00_basic.entity";

export interface AddressModel extends BasicModel {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export class AddressEntity extends BasicEntity<AddressModel> {
  constructor(
    props: AddressModel, 
    id?: string) {
    super(props, id);
  }
}