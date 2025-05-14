import { EBasic, type MBasic } from "../basic.entity";

export interface MContactInfo extends MBasic {
  phone: string[];
  email: string[];
  whatsapp?: string;
  other?: {
    name: string;
    url: string;
  }[];
}

export class EContactInfo extends EBasic<MContactInfo> {
  constructor(props: MContactInfo, id?: string) {
    super(props, id);
  }
  
}