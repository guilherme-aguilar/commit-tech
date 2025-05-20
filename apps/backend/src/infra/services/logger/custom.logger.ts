import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { LoggerService } from "@nestjs/common";

export class CustomLogger implements LoggerService {

  constructor(
    @InjectPinoLogger()
    private readonly logger: PinoLogger
  ){}

  
  verbose(message: string, context?: string): void {
    this.logger.trace({context}, message)
  }

  debug(message: string, context?: string): void {
    this.logger.debug({context}, message)
  }

  log(message: string, context?: string): void {
    this.logger.info({context}, message)
  }

  warn(message: string, context?: string): void {
    this.logger.warn({context}, message)
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error({context, trace}, message)
  }

}