import { EBasic, MBasic } from "../basic.entity";

export interface MAddress extends MBasic {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export class EAddress extends EBasic<MAddress> {
  constructor(
    props: MAddress, 
    id?: string) {
    super(props, id);
  }
}