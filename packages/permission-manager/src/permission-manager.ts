// Tipos básicos para o sistema de permissões
export type Action = string
export type Subject = string

// Operadores de condição suportados
export type ConditionOperator = "eq" | "ne" | "in" | "contains" | "gt" | "lt" | "gte" | "lte"

// Definição de uma condição compatível com o formato original
export interface Condition {
  field: string // Campo no recurso a ser verificado
  operator: ConditionOperator
  value: string // Caminho no objeto de usuário para obter o valor de comparação
  valueField?: string // Campo alternativo para compatibilidade com novas implementações
}

// Definição de uma permissão
export interface Permission {
  action: Action
  subject: Subject
  conditions?: Condition[]
}

// Interface para adapter de tenant
export interface TenantAdapter<UserData, ResourceType> {
  // Recupera todas as permissões do usuário
  getPermissions(userData: UserData): Permission[]

  // Função para extrair um valor de um caminho no objeto de usuário
  getNestedValue(userData: UserData, path: string): any

  // Função para verificar se um tenant tem acesso a um recurso
  checkTenantAccess(userData: UserData, resource: ResourceType): boolean
}

// Classe principal de gerenciamento de permissões
export class PermissionManager<UserData = any, ResourceType = any> {
  private tenantAdapters: TenantAdapter<UserData, ResourceType>[]

  constructor(adapters: TenantAdapter<UserData, ResourceType>[]) {
    this.tenantAdapters = adapters
  }

  // Adiciona um novo tenant adapter
  public addTenantAdapter(adapter: TenantAdapter<UserData, ResourceType>): void {
    this.tenantAdapters.push(adapter)
  }

  // Método principal para verificar permissões
  public can(userData: UserData, action: Action, subject: Subject, resource?: ResourceType | ResourceType[]): boolean {
    // Se não houver recurso, apenas verificamos se o usuário tem a permissão
    if (!resource) {
      return this.checkBasePermission(userData, action, subject)
    }

    // Se for um array de recursos, todos devem passar na verificação
    if (Array.isArray(resource)) {
      return resource.every((item) => this.checkResourcePermission(userData, action, subject, item))
    }

    // Verifica permissão para um único recurso
    return this.checkResourcePermission(userData, action, subject, resource)
  }

  // Para compatibilidade com o nome do método original
  public canPerformAction(
    userData: UserData,
    action: Action,
    subject: Subject,
    resource?: ResourceType | ResourceType[],
  ): boolean {
    return this.can(userData, action, subject, resource)
  }

  // Verifica se o usuário tem a permissão básica
  private checkBasePermission(userData: UserData, action: Action, subject: Subject): boolean {
    // Verifica em todos os adapters se o usuário tem a permissão
    return this.tenantAdapters.some((adapter) => {
      const permissions = adapter.getPermissions(userData)
      return permissions.some(
        (perm) =>
          perm.action === action && perm.subject === subject && (!perm.conditions || perm.conditions.length === 0),
      )
    })
  }

  // Verifica permissão para um recurso específico
  private checkResourcePermission(
    userData: UserData,
    action: Action,
    subject: Subject,
    resource: ResourceType,
  ): boolean {
    // Primeiro verificamos se o tenant tem acesso ao recurso
    const hasAccess = this.tenantAdapters.some((adapter) => adapter.checkTenantAccess(userData, resource))

    if (!hasAccess) {
      return false
    }

    // Verifica em todos os adapters se o usuário tem a permissão
    return this.tenantAdapters.some((adapter) => {
      const permissions = adapter.getPermissions(userData)
      return permissions.some((perm) => {
        // Verifica se a permissão corresponde à ação e ao assunto
        if (perm.action !== action || perm.subject !== subject) {
          return false
        }

        // Se não houver condições, a permissão é válida
        if (!perm.conditions || perm.conditions.length === 0) {
          return true
        }

        // Verifica todas as condições
        return perm.conditions.every((condition) => this.evaluateCondition(condition, userData, resource, adapter))
      })
    })
  }

  // Avalia uma condição específica
  private evaluateCondition(
    condition: Condition,
    userData: UserData,
    resource: ResourceType,
    adapter: TenantAdapter<UserData, ResourceType>,
  ): boolean {
    // Use valueField se disponível, caso contrário use value (para compatibilidade com formato original)
    const valuePath = condition.valueField || condition.value
    const userValue = adapter.getNestedValue(userData, valuePath)
    const resourceValue = this.getResourceValue(resource, condition.field)

    switch (condition.operator) {
      case "eq":
        return resourceValue === userValue
      case "ne":
        return resourceValue !== userValue
      case "in":
        if (Array.isArray(userValue)) {
          return userValue.some((val) =>
            typeof val === "object" && val !== null && "id" in val ? val.id === resourceValue : val === resourceValue,
          )
        }
        return false
      case "contains":
        if (Array.isArray(resourceValue)) {
          return resourceValue.includes(userValue)
        }
        if (typeof resourceValue === "string" && typeof userValue === "string") {
          return resourceValue.includes(userValue)
        }
        return false
      case "gt":
        return resourceValue > userValue
      case "lt":
        return resourceValue < userValue
      case "gte":
        return resourceValue >= userValue
      case "lte":
        return resourceValue <= userValue
      default:
        return false
    }
  }

  // Obtem um valor de um recurso a partir de um caminho
  private getResourceValue(resource: ResourceType, path: string): any {
    if (!path.includes(".")) {
      return (resource as any)[path]
    }

    return path.split(".").reduce((acc, part) => acc && acc[part], resource as any)
  }
}

// Exemplo de adaptador para o formato de dados original
export class OriginalDataAdapter<ResourceType> implements TenantAdapter<IUserData, ResourceType> {
  getPermissions(userData: IUserData): Permission[] {
    const userPermissions = userData.userProfile?.permissions || []
    const customerPermissions = userData.customerProfile?.permissions || []
    return [...userPermissions, ...customerPermissions]
  }

  getNestedValue(userData: IUserData, path: string): any {
    return path.split(".").reduce((acc, part) => acc && acc[part], userData as any)
  }

  checkTenantAccess(userData: IUserData, resource: ResourceType): boolean {
    // Implementação baseada na lógica original
    // Aqui você pode adaptar conforme necessário para sua verificação específica de tenant
    return true // Exemplo simplificado
  }
}

// Interface original para compatibilidade
interface IUserData {
  userProfile?: {
    permissions: Permission[]
  }
  customerProfile?: {
    permissions: Permission[]
  }
}
