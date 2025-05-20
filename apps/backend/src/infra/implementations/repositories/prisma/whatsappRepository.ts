
import { ExceptionsService } from "src/infra/services/exceptions/exceptions.service";
import { LoggerService } from "src/infra/services/logger/logger.service";

import { PrismaBasicRepository } from "./basic";
import type { WhatsappEntity, WhatsappModel } from "src/domain/entities/whatsapp.entity";
import type { WhatsappRepository } from "src/domain/repositories/whatsapp.repo";
import { WhatsappMapper } from "../../mappers/whatsappMapper";

export class PrismaWhatsappRepository extends PrismaBasicRepository<WhatsappModel, WhatsappEntity, any > implements WhatsappRepository {
  
  constructor() {
    super(
      "whatsapp",
      new WhatsappMapper(),
      new ExceptionsService(),
    );
  }}
