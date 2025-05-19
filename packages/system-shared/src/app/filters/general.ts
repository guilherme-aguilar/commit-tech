
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
  [key in Operator]?: any;
};

// Tipo auxiliar para obter todos os caminhos possíveis em um objeto, incluindo aninhados
export type PathsToStringProps<T> = T extends object
  ? {
      [K in keyof T & (string | number)]:
        | K
        | `${K}.${PathsToStringProps<T[K]>}`;
    }[keyof T & (string | number)]
  : never;

// Tipo auxiliar para obter o tipo de uma propriedade através de um caminho
export type PropertyType<T, Path extends string> = Path extends keyof T
  ? T[Path]
  : Path extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PropertyType<T[K], R>
    : never
  : never;

// Definição de LogicalFilter modificada para suportar objetos aninhados
export type LogicalFilter<T> = {
  OR?: MontedFilter<T>[]; 
  AND?: MontedFilter<T>[];
  NOT?: MontedFilter<T>;
};

// Tipo MontedFilter melhorado para suportar propriedades aninhadas
export type MontedFilter<T> = {
  [P in PathsToStringProps<T>]?: Condition;
} & LogicalFilter<T>;

// Exportação do tipo principal para uso
export type IWhereFilter<T> = MontedFilter<T>;
