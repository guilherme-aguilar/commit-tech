import { BasicModel, ContactInfoModel, AddressModel} from "@commit-tech/system-shared";

export interface UserModel extends BasicModel {
  firstName: string;
  lastName: string;
  contactInfo: ContactInfoModel;
  address: AddressModel;
}