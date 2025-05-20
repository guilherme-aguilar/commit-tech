import { createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";

export const AuthenticationPayload = createParamDecorator( (data: unknown, ctx: ExecutionContextHost) => {
  const request = ctx.switchToHttp().getRequest()

  return request.user
})