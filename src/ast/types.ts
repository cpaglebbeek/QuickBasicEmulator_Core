/**
 * AST types for QuickBasicEmulator.
 *
 * Skeleton — v0.0.1-Gates. Detailed schema in v0.0.2-Allen.
 */

export type Dialect = 'gwbasic' | 'qbasic' | 'qb45';

export interface Program {
  kind: 'Program';
  dialect: Dialect;
  statements: Statement[];
}

export type Statement =
  | { kind: 'Print'; args: Expression[] }
  | { kind: 'Let'; target: string; value: Expression }
  | { kind: 'Comment'; text: string }
  | { kind: 'Placeholder'; raw: string };

export type Expression =
  | { kind: 'NumberLiteral'; value: number }
  | { kind: 'StringLiteral'; value: string }
  | { kind: 'Variable'; name: string };
