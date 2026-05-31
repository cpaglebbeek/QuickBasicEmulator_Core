/**
 * AST types for QuickBasicEmulator.
 *
 * v0.0.2-Allen — uitgebreid van Gates-skeleton naar reëel werkbare AST.
 *
 * Conventies:
 * - Discriminated unions via `kind` veld
 * - Locatie-info via `loc` (regel + kolom) waar relevant voor diagnostics
 * - Dialect-info reist mee op Program-niveau, niet per node
 */

export type Dialect = 'gwbasic' | 'qbasic' | 'qb45';

export interface SourceLocation {
  line: number;
  col: number;
  /** GW-BASIC line number, when present */
  lineNumber?: number;
}

export interface Program {
  kind: 'Program';
  dialect: Dialect;
  /** Top-level statements (excludes SUB/FUNCTION bodies) */
  statements: Statement[];
  /** Sub/Function procedures (QBasic + QB45 only) */
  procedures: Procedure[];
  /** Label table: label name → statement index */
  labels: Record<string, number>;
}

// ---------- Statements ----------

export type Statement =
  | PrintStatement
  | InputStatement
  | LetStatement
  | IfStatement
  | ForStatement
  | NextStatement
  | DoStatement
  | LoopStatement
  | WhileStatement
  | WendStatement
  | ExitStatement
  | GotoStatement
  | GosubStatement
  | ReturnStatement
  | SelectStatement
  | DimStatement
  | RedimStatement
  | DataStatement
  | ReadStatement
  | RestoreStatement
  | OpenStatement
  | CloseStatement
  | PrintFileStatement
  | InputFileStatement
  | LineInputStatement
  | CallStatement
  | CommentStatement
  | LabelStatement
  | ClsStatement
  | ColorStatement
  | LocateStatement
  | ScreenStatement
  | SleepStatement
  | RandomizeStatement
  | EndStatement
  | StopStatement
  | RemStatement;

export interface PrintStatement {
  kind: 'Print';
  args: Expression[];
  /** true if line ends with ; (no newline) */
  trailing: 'newline' | 'semicolon' | 'comma';
  loc: SourceLocation;
}

export interface InputStatement {
  kind: 'Input';
  prompt?: StringLiteral;
  targets: Variable[];
  loc: SourceLocation;
}

export interface LetStatement {
  kind: 'Let';
  /** Variable or array-index target */
  target: Variable | ArrayIndex;
  value: Expression;
  /** false when 'LET' keyword omitted (default in QBasic/QB45) */
  explicit: boolean;
  loc: SourceLocation;
}

export interface IfStatement {
  kind: 'If';
  condition: Expression;
  thenBranch: Statement[];
  elseifBranches: { condition: Expression; body: Statement[] }[];
  elseBranch?: Statement[];
  /** GW-BASIC: single-line IF ... THEN <stmt> [ELSE <stmt>]; QBasic/QB45 also support multi-line */
  inline: boolean;
  loc: SourceLocation;
}

export interface ForStatement {
  kind: 'For';
  counter: Variable;
  start: Expression;
  end: Expression;
  step?: Expression;
  loc: SourceLocation;
}

export interface NextStatement {
  kind: 'Next';
  counter?: Variable;
  loc: SourceLocation;
}

export interface DoStatement {
  kind: 'Do';
  test?: { kind: 'WHILE' | 'UNTIL'; condition: Expression };
  loc: SourceLocation;
}

export interface LoopStatement {
  kind: 'Loop';
  test?: { kind: 'WHILE' | 'UNTIL'; condition: Expression };
  loc: SourceLocation;
}

export interface WhileStatement {
  kind: 'While';
  condition: Expression;
  loc: SourceLocation;
}

export interface WendStatement {
  kind: 'Wend';
  loc: SourceLocation;
}

export interface ExitStatement {
  kind: 'Exit';
  target: 'FOR' | 'DO' | 'SUB' | 'FUNCTION';
  loc: SourceLocation;
}

export interface GotoStatement {
  kind: 'Goto';
  target: string | number;
  loc: SourceLocation;
}

export interface GosubStatement {
  kind: 'Gosub';
  target: string | number;
  loc: SourceLocation;
}

export interface ReturnStatement {
  kind: 'Return';
  target?: string | number;
  loc: SourceLocation;
}

export interface SelectStatement {
  kind: 'Select';
  selector: Expression;
  cases: { matchers: CaseMatcher[]; body: Statement[] }[];
  elseCase?: Statement[];
  loc: SourceLocation;
}

export type CaseMatcher =
  | { kind: 'value'; value: Expression }
  | { kind: 'range'; from: Expression; to: Expression }
  | { kind: 'is'; op: ComparisonOp; value: Expression };

export interface DimStatement {
  kind: 'Dim';
  declarations: { name: string; dimensions: Expression[]; typeHint?: TypeHint }[];
  shared: boolean;
  loc: SourceLocation;
}

export interface RedimStatement {
  kind: 'Redim';
  declarations: { name: string; dimensions: Expression[]; typeHint?: TypeHint }[];
  preserve: boolean;
  loc: SourceLocation;
}

export interface DataStatement {
  kind: 'Data';
  values: Literal[];
  loc: SourceLocation;
}

export interface ReadStatement {
  kind: 'Read';
  targets: (Variable | ArrayIndex)[];
  loc: SourceLocation;
}

export interface RestoreStatement {
  kind: 'Restore';
  target?: string | number;
  loc: SourceLocation;
}

export interface OpenStatement {
  kind: 'Open';
  filename: Expression;
  mode: 'INPUT' | 'OUTPUT' | 'APPEND' | 'RANDOM' | 'BINARY';
  fileNumber: Expression;
  recordLength?: Expression;
  loc: SourceLocation;
}

export interface CloseStatement {
  kind: 'Close';
  /** empty array = close all */
  fileNumbers: Expression[];
  loc: SourceLocation;
}

export interface PrintFileStatement {
  kind: 'PrintFile';
  fileNumber: Expression;
  args: Expression[];
  loc: SourceLocation;
}

export interface InputFileStatement {
  kind: 'InputFile';
  fileNumber: Expression;
  targets: Variable[];
  loc: SourceLocation;
}

export interface LineInputStatement {
  kind: 'LineInput';
  fileNumber?: Expression;
  prompt?: StringLiteral;
  target: Variable;
  loc: SourceLocation;
}

export interface CallStatement {
  kind: 'Call';
  procName: string;
  args: Expression[];
  /** true when CALL keyword used; false when implicit (QBasic/QB45) */
  explicit: boolean;
  loc: SourceLocation;
}

export interface CommentStatement {
  kind: 'Comment';
  /** Apostrophe-style comment (QBasic/QB45 preferred) */
  text: string;
  loc: SourceLocation;
}

export interface RemStatement {
  kind: 'Rem';
  /** REM keyword-style comment (GW-BASIC required, others optional) */
  text: string;
  loc: SourceLocation;
}

export interface LabelStatement {
  kind: 'Label';
  name: string;
  loc: SourceLocation;
}

export interface ClsStatement {
  kind: 'Cls';
  /** optional clear-mode: 0=all, 1=graphics, 2=text (QB+) */
  mode?: Expression;
  loc: SourceLocation;
}

export interface ColorStatement {
  kind: 'Color';
  foreground?: Expression;
  background?: Expression;
  border?: Expression;
  loc: SourceLocation;
}

export interface LocateStatement {
  kind: 'Locate';
  row?: Expression;
  col?: Expression;
  cursor?: Expression;
  loc: SourceLocation;
}

export interface ScreenStatement {
  kind: 'Screen';
  mode: Expression;
  colorSwitch?: Expression;
  activePage?: Expression;
  visualPage?: Expression;
  loc: SourceLocation;
}

export interface SleepStatement {
  kind: 'Sleep';
  seconds?: Expression;
  loc: SourceLocation;
}

export interface RandomizeStatement {
  kind: 'Randomize';
  seed?: Expression;
  /** true when RANDOMIZE TIMER used */
  fromTimer: boolean;
  loc: SourceLocation;
}

export interface EndStatement {
  kind: 'End';
  loc: SourceLocation;
}

export interface StopStatement {
  kind: 'Stop';
  loc: SourceLocation;
}

// ---------- Procedures ----------

export interface Procedure {
  kind: 'Sub' | 'Function';
  name: string;
  parameters: Parameter[];
  /** For FUNCTION: return-type-hint */
  returnTypeHint?: TypeHint;
  body: Statement[];
  loc: SourceLocation;
}

export interface Parameter {
  name: string;
  typeHint?: TypeHint;
  byValue: boolean;
}

// ---------- Expressions ----------

export type Expression =
  | NumberLiteral
  | StringLiteral
  | Variable
  | ArrayIndex
  | BinaryOp
  | UnaryOp
  | FunctionCall
  | ParenExpr;

export interface NumberLiteral {
  kind: 'NumberLiteral';
  value: number;
  /** QB45: I=Integer, L=Long, S=Single, D=Double */
  suffix?: 'I' | 'L' | 'S' | 'D';
}

export interface StringLiteral {
  kind: 'StringLiteral';
  value: string;
}

export type Literal = NumberLiteral | StringLiteral;

export interface Variable {
  kind: 'Variable';
  name: string;
  typeHint?: TypeHint;
}

export interface ArrayIndex {
  kind: 'ArrayIndex';
  name: string;
  indices: Expression[];
  typeHint?: TypeHint;
}

export interface BinaryOp {
  kind: 'BinaryOp';
  op: BinaryOperator;
  left: Expression;
  right: Expression;
}

export type BinaryOperator =
  | '+' | '-' | '*' | '/' | '\\' | '^' | 'MOD'
  | '=' | '<>' | '<' | '>' | '<=' | '>='
  | 'AND' | 'OR' | 'XOR' | 'EQV' | 'IMP';

export type ComparisonOp = '=' | '<>' | '<' | '>' | '<=' | '>=';

export interface UnaryOp {
  kind: 'UnaryOp';
  op: 'NOT' | '-' | '+';
  operand: Expression;
}

export interface FunctionCall {
  kind: 'FunctionCall';
  /** Built-in name (RND, LEN, MID$, ...) or user-defined FUNCTION name */
  name: string;
  args: Expression[];
}

export interface ParenExpr {
  kind: 'ParenExpr';
  inner: Expression;
}

// ---------- Type system ----------

/** Type-suffix tradition: $=String, %=Integer, &=Long, !=Single, #=Double */
export type TypeHint =
  | { kind: 'suffix'; suffix: '$' | '%' | '&' | '!' | '#' }
  | { kind: 'as'; typeName: 'STRING' | 'INTEGER' | 'LONG' | 'SINGLE' | 'DOUBLE' | string };

// ---------- Visitor helper ----------

export function isStatement(node: { kind: string }): node is Statement {
  return /^(Print|Input|Let|If|For|Next|Do|Loop|While|Wend|Exit|Goto|Gosub|Return|Select|Dim|Redim|Data|Read|Restore|Open|Close|PrintFile|InputFile|LineInput|Call|Comment|Rem|Label|Cls|Color|Locate|Screen|Sleep|Randomize|End|Stop)$/.test(node.kind);
}
