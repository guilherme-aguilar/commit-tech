import { BasicModel, ContactInfoModel, AddressModel, BasicEntity} from "@commit-tech/system-shared";

export interface WhatsappModel extends BasicModel {
  name: string
  integrationId: string
  integrationToken: string
  userId: string
}

type model = WhatsappModel;

export class WhatsappEntity extends BasicEntity<model> {
  constructor(
    props: model, 
    id?: string) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get token(): string {
    return this.props.integrationToken;
  }

  get integrationId(): string {
    return this.props.integrationId;
  }
}