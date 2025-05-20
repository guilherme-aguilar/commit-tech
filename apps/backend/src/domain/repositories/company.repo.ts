import { BasicRepository } from "@commit-tech/system-shared";
import type { CompanyEntity, CompanyModel } from "../entities/company.entity";


export abstract class CompanyRepository extends BasicRepository<CompanyModel, CompanyEntity> {
 
}