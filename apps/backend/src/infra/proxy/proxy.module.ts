import { DynamicModule, Module } from "@nestjs/common";
import { AuthUseCaseProxyModule } from "./modules/auth.module";



@Module({
  imports: [
  ],
})

export class UseCasesProxyModule {

  static register(): DynamicModule {
    return {
      imports: [
        AuthUseCaseProxyModule,
      ],
      module: UseCasesProxyModule,

    };
  }
}