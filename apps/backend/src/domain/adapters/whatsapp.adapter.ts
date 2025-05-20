export interface WhatsappAdapter {
  createInstance(instance: { name: string }): Promise<{
    id: string;
    name: string;
    integration: string;
    token: string;
  }>;

  deleteInstance(instance: { name: string }): Promise<void>;

  findInstances(instancesId: string[]): Promise<any>;

  connectInstance(instance: { name: string }): Promise<{
    pairingCode: number | null;
    code: string | null;
    base64: string | null;
    count: 11;
  }>;

  disconnectInstance(instance: { name: string }): Promise<void>;

  // ================

  //Messages Actions

  //===============
  sendMessage(messageContent: {
    name: string;
    to: string;
    message: string;
  }): Promise<void>;

  // =============
  // chat actions
  // ============
  getChatsRegistered(name: string): Promise<
    {
      id: string;
      remoteJid: string;
      pushName: string;
      profilePicUrl: string;
    }[]
  >;

  readMessagesToChat(data : {
    name: string;
    chatId?: string;
    fromMe?: boolean;
  }
  ): Promise<{
    total: number;
    pages: number;
    currentPage: number;
    records: {
      id: string;
      key: {
        id: string;
        fromMe: boolean;
        remoteJid: string;
      };
      pushName: string;
      messageType: string;
      message: {
        conversation: string;
      };
      messageTimestamp: string;
      instanceId: string;
      source: any;
      contextInfo: {
        expiration: number;
      };
      MessageUpdate: [];
    };
  }>;
}
