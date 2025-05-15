import { BasicModel, ContactInfoModel, AddressModel, BasicEntity} from "@commit-tech/system-shared";

export interface UserModel extends BasicModel {
  firstName: string;
  lastName: string;
  contactInfo: ContactInfoModel;
  address: AddressModel;
}

type model = UserModel;

export class UserEntity extends BasicEntity<model> {
  constructor(
    props: model, 
    id?: string) {
    super(props, id);
  }
}