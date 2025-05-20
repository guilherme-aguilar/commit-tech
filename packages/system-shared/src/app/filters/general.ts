import type { AddressModel } from "../../domain/entities/address.entity";

// Generic helper types for building the filter
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

// Utility types to extract non-function properties from a type
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

// Recursive type for nested condition structures
export type NestedFilter<T> = {
  [K in keyof NonFunctionProperties<T>]?: T[K] extends object
    ? NestedFilter<T[K]> | Condition
    : Condition;
};

// Type for filters that can use logical operators
export interface LogicalFilter<T> {
  OR?: IWhereFilter<T>[];
  AND?: IWhereFilter<T>[];
  NOT?: IWhereFilter<T>;
}

// Main filter type that supports nested objects with proper typing
export type IWhereFilter<T> = NestedFilter<T> & LogicalFilter<T>;


// interface modelExemple {
//   name: string;
//   age: number;
//   address: AddressModel
// }

// const exempleFilter: IWhereFilter<modelExemple> = {
//   name: {
//     equals: 'John',
//   },
//   age: {
//     gt: 30,
//   },
//   address: {
   
//   },
// };