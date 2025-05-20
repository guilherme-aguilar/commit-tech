import type { Condition, IWhereFilter } from '@commit-tech/system-shared';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  protected readonly logger = new LoggerService();
  private readonly maxRetries = 3;
  private readonly retryDelay = 2000; // em milissegundos
  private modelFieldsCache: Map<string, string[]> = new Map(); // Cache for valid fields per model
  private relationCache: Map<string, Map<string, string>> = new Map(); // Cache for model relations

  async onModuleInit() {
    await this.connectWithRetry();
    this.initializeModelCache();
  }

  private async connectWithRetry(retries = 0): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to the database', 'PrismaService');
    } catch (error) {
      if (retries < this.maxRetries) {
        this.logger.warn(`Database connection failed. Retrying... (${retries + 1}/${this.maxRetries})`, 'PrismaService');
        await new Promise(res => setTimeout(res, this.retryDelay));
        return this.connectWithRetry(retries + 1);
      }
      this.logger.error('Failed to connect to the database after multiple attempts', error, 'PrismaService');
      throw new Error('Could not connect to the database');
    }
  }

  private initializeModelCache(): void {
    // Access Prisma's DMMF (Data Model Meta Format) to get model metadata
    const dmmf = (Prisma as any).dmmf;
    if (!dmmf) {
      this.logger.error('Unable to access Prisma DMMF for model validation', 'PrismaService');
      return;
    }

    // Cache fields and relations for each model
    for (const model of dmmf.datamodel.models) {
      const modelName = model.name;
      const fields: string[] = [];
      const relations = new Map<string, string>();

      for (const field of model.fields) {
        fields.push(field.name);
        
        // If it's a relation, store the related model type
        if (field.relationName) {
          relations.set(field.name, field.type);
        }
      }

      this.modelFieldsCache.set(modelName, fields);
      this.relationCache.set(modelName, relations);
      
      this.logger.debug(`Initialized field cache for model ${modelName}: ${fields.join(', ')}`, 'PrismaService');
    }
  }

  
  async buildingWhereFilter<T>(filter: IWhereFilter<T>) {
    const prismaWhere: any = {};
  
    // Itera sobre as chaves do filtro
    for (const key in filter) {
      const value = filter[key];
  
      // Verifica se é uma condição lógica (OR, AND, NOT)
      if (key === 'OR' || key === 'AND' || key === 'NOT') {
        if (key === 'OR' && Array.isArray(value)) {
          prismaWhere.OR = value.map((subFilter) => this.buildingWhereFilter(subFilter));
        }
        if (key === 'AND' && Array.isArray(value)) {
          prismaWhere.AND = value.map((subFilter) => this.buildingWhereFilter(subFilter));
        }
        if (key === 'NOT' && value) {
          prismaWhere.NOT = this.buildingWhereFilter(value as IWhereFilter<T>);
        }
      } else if (typeof value !== 'object' || value === null) {
        // Caso não haja operador, atribui diretamente key: value
        prismaWhere[key] = value;
      } else {
        // Processa normalmente os operadores
        for (const operator in value) {
          if (!operator) continue; // Ignora se o operador é vazio ou indefinido
          const condition = value[operator as keyof Condition];
          prismaWhere[key] = prismaWhere[key] || {}; // Cria um objeto para as condições se não existir
  
          // Converte as condições para o formato Prisma
          switch (operator) {
            case 'equals':
              prismaWhere[key] = condition;
              break;
            case 'not':
              prismaWhere[key].not = condition;
              break;
            case 'gt':
              prismaWhere[key].gt = condition;
              break;
            case 'gte':
              prismaWhere[key].gte = condition;
              break;
            case 'lt':
              prismaWhere[key].lt = condition;
              break;
            case 'lte':
              prismaWhere[key].lte = condition;
              break;
            case 'in':
              prismaWhere[key].in = condition;
              break;
            case 'notIn':
              prismaWhere[key].notIn = condition;
              break;
            case 'contains':
              prismaWhere[key].contains = condition;
              break;
            case 'startsWith':
              prismaWhere[key].startsWith = condition;
              break;
            case 'endsWith':
              prismaWhere[key].endsWith = condition;
              break;
            case 'null':
              prismaWhere[key].equals = null; // Trata 'null' de forma especial
              break;
            case 'between':
              prismaWhere[key] = {
                gte: condition[0],
                lte: condition[1],
              };
              break;
          }
        }
      }
    }
  
    return prismaWhere;
  }
}

