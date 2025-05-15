import { BasicEntity, type BasicModel } from "./00_basic.entity";

export interface ContactInfoModel extends BasicModel {
  phone: string[];
  email: string[];
  whatsapp?: string;
  other?: {
    name: string;
    url: string;
  }[];
}

export class ContactInfoEntity extends BasicEntity<ContactInfoModel> {
  constructor(props: ContactInfoModel, id?: string) {
    super(props, id);
  }
  
}