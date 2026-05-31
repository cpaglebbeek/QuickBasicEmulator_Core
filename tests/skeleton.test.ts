import { describe, it, expect } from 'vitest';
import gwSpec from '../src/spec/dialect_gwbasic.json';
import qbSpec from '../src/spec/dialect_qbasic.json';
import qb45Spec from '../src/spec/dialect_qb45.json';

describe('dialect specs load', () => {
  it('GW-BASIC spec has correct dialect tag', () => {
    expect(gwSpec.dialect).toBe('gwbasic');
  });

  it('QBasic spec has correct dialect tag', () => {
    expect(qbSpec.dialect).toBe('qbasic');
  });

  it('QuickBASIC 4.5 spec has correct dialect tag', () => {
    expect(qb45Spec.dialect).toBe('qb45');
  });

  it('GW-BASIC requires line numbers', () => {
    expect(gwSpec.features.line_numbers).toBe('required');
  });

  it('QBasic supports SUB/FUNCTION procedures', () => {
    expect(qbSpec.features.sub_function_procedures).toBe('supported');
  });
});
