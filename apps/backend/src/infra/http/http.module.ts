import { Module } from "@nestjs/common";
import { AuthUseCaseProxyModule } from "../proxy/modules/auth.module";
import { AuthenticationController } from "./auth/controller";
import { LoggerService } from "../services/logger/logger.service";
import { NotificationsWhatsappInstanceController } from "./notification/whatsapp/instance.controller";
import { NotificationsWhatsappUseCaseProxyModule } from "../proxy/modules/notifications/whatsapp.module";
import { NotificationsWhatsappMessageController } from "./notification/whatsapp/message.controller";
import { AuthModule } from "../interceptors/auth/auth.module";


const controllers = [
  AuthenticationController,
  NotificationsWhatsappInstanceController,
  NotificationsWhatsappMessageController
];


@Module({
  imports: [
    AuthModule,
    AuthUseCaseProxyModule,
    NotificationsWhatsappUseCaseProxyModule
  ],
  controllers: [...controllers],
  providers: [LoggerService],
})
export class HttpControllersModule {}