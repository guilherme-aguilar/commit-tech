export type LogicalOperator = 'OR' | 'AND' | 'NOT';

export type Operator =
  | 'equals'
  | 'not'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'null'
  | 'between';

export type Condition = {
  [key in Operator]?: any; // Usando o operador como chave
};

// Agora LogicalFilter será um whereFilter
export type LogicalFilter<T> = {
  OR?: montedFilter<T>[]; // Permite um array de whereFilter
  AND?: montedFilter<T>[]; // Permite um array de whereFilter
  NOT?: montedFilter<T>; // Um único whereFilter
};


 export type montedFilter<T> = {
  [K in keyof T]?: Condition; // Chaves de T recebem Condition
} & LogicalFilter<T>; // Chaves de LogicalFilter recebem whereFilter


export type IWhereFilter<T> = montedFilter<T>