import { BasicModel, ContactInfoModel, AddressModel, BasicEntity} from "@commit-tech/system-shared";

export interface CompanyModel extends BasicModel {
  name: string;
  fantasyName?: string;
  identification: string;
  personType: string,
  agent?: {
    firstName: string;
    lastName: string;
    contactInfo: ContactInfoModel;
    identification: string;
    position?: string;
  }
  address: AddressModel;
  contactInfo: ContactInfoModel;
}

type model = CompanyModel;

export class CompanyEntity extends BasicEntity<model> {
  constructor(
    props: model, 
    id?: string) {
    super(props, id);
  }

  getEmail(): string[] {
    return this.props.contactInfo.email;
  }

}