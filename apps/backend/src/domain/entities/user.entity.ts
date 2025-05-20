import { BasicModel, ContactInfoModel, AddressModel, BasicEntity} from "@commit-tech/system-shared";

export interface UserModel extends BasicModel {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string[];
  address?: AddressModel;
  password?: string | null;
  refreshToken?: string | null;
}

type model = UserModel;

export class UserEntity extends BasicEntity<model> {
  constructor(
    props: model, 
    id?: string) {
    super(props, id);
  }

  getEmail(): string {
    return this.props.email;
  }

  getPassword(): string | null {
    return this.props.password ?? null;
  }

  getRefreshToken(): string | null {
    return this.props.refreshToken ?? null;
  }

  hasPassword(): boolean {
    return !!this.props.password;
  }

}