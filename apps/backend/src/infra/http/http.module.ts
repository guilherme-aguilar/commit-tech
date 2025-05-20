import { Module } from "@nestjs/common";
import { AuthUseCaseProxyModule } from "../proxy/modules/auth.module";
import { AuthenticationController } from "./auth/controller";
import { LoggerService } from "../services/logger/logger.service";


const controllers = [
  AuthenticationController,
];


@Module({
  imports: [
    AuthUseCaseProxyModule
  ],
  controllers: [...controllers],
  providers: [LoggerService],
})
export class HttpModule {}