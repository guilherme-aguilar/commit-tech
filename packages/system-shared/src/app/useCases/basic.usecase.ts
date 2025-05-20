import type { ExceptionAdapter } from "../../domain/adapters/exceptions.adapter";
import type { LoggerAdapter } from "../../domain/adapters/logger.adapter";



export interface IUCRequest<T> {
  data: T
  payloadAuth?: any
}

export interface IUseCase<TInput, TOutput> {
  execute(input: IUCRequest<TInput>): Promise<TOutput>;
}

export abstract class BasicUseCase<TInput, TOutput> implements IUseCase<TInput, TOutput> {
  protected logger: LoggerAdapter;
  protected exception: ExceptionAdapter;

  constructor(logger: LoggerAdapter, exception: ExceptionAdapter) {
    this.logger = logger;
    this.exception = exception;
  }

  abstract execute(input: IUCRequest<TInput>): Promise<TOutput>

}
