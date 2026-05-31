/**
 * Spec-consistency tests — v0.0.2-Allen
 *
 * Garandeert dat de drie dialect-specs:
 * - geen "skeleton:true" markeringen meer hebben
 * - elk minimaal 30 statements bevatten (top-50 doel inclusief functies+operators)
 * - elk dezelfde basis-set kernstatements ondersteunen (PRINT/INPUT/IF/FOR/...)
 * - dialect-specifieke features correct gemarkeerd zijn
 */

import { describe, it, expect } from 'vitest';
import gwSpec from '../src/spec/dialect_gwbasic.json';
import qbSpec from '../src/spec/dialect_qbasic.json';
import qb45Spec from '../src/spec/dialect_qb45.json';

const dialects = [
  { name: 'GW-BASIC', spec: gwSpec },
  { name: 'QBasic', spec: qbSpec },
  { name: 'QuickBASIC 4.5', spec: qb45Spec },
] as const;

describe('dialect specs are no longer skeletons', () => {
  for (const { name, spec } of dialects) {
    it(`${name} has zero skeleton:true markers in statements`, () => {
      const statements = (spec as any).statements as Record<string, any>;
      const skeletons = Object.entries(statements).filter(
        ([, v]) => v?.skeleton === true
      );
      expect(skeletons).toEqual([]);
    });
  }
});

describe('dialect specs reach minimum statement count', () => {
  for (const { name, spec } of dialects) {
    it(`${name} has >=30 statements`, () => {
      const count = Object.keys((spec as any).statements).length;
      expect(count).toBeGreaterThanOrEqual(30);
    });
    it(`${name} has >=20 builtin functions`, () => {
      const count = Object.keys((spec as any).builtin_functions).length;
      expect(count).toBeGreaterThanOrEqual(20);
    });
  }
});

describe('core statements present in all dialects', () => {
  const core = ['PRINT', 'INPUT', 'IF', 'FOR', 'NEXT', 'GOTO', 'GOSUB', 'RETURN', 'DIM', 'DATA', 'READ', 'END'];
  for (const { name, spec } of dialects) {
    it(`${name} supports core statements`, () => {
      const statements = (spec as any).statements as Record<string, any>;
      for (const kw of core) {
        expect(statements, `${name} missing ${kw}`).toHaveProperty(kw);
      }
    });
  }
});

describe('dialect-specific feature flags', () => {
  it('GW-BASIC requires line numbers', () => {
    expect((gwSpec as any).features.line_numbers).toBe('required');
  });
  it('QBasic + QB45 optional line numbers', () => {
    expect((qbSpec as any).features.line_numbers).toBe('optional');
    expect((qb45Spec as any).features.line_numbers).toBe('optional');
  });
  it('GW-BASIC does NOT support SUB/FUNCTION', () => {
    expect((gwSpec as any).features.sub_function_procedures).toBe('not_supported');
    expect((gwSpec as any).statements).not.toHaveProperty('SUB');
  });
  it('QBasic + QB45 support SUB/FUNCTION', () => {
    expect((qbSpec as any).features.sub_function_procedures).toBe('supported');
    expect((qbSpec as any).statements).toHaveProperty('SUB');
    expect((qb45Spec as any).statements).toHaveProperty('FUNCTION');
  });
  it('Only QB45 supports compile_to_exe + user_defined_types', () => {
    expect((qb45Spec as any).features.compile_to_exe).toBe('supported');
    expect((qb45Spec as any).features.user_defined_types).toBe('supported');
    expect((qb45Spec as any).statements).toHaveProperty('TYPE');
    expect((qbSpec as any).features.compile_to_exe).toBe('not_supported');
    expect((gwSpec as any).features.compile_to_exe).toBe('not_supported');
  });
  it('GW-BASIC has no SELECT CASE or DO/LOOP', () => {
    expect((gwSpec as any).features.select_case).toBe('not_supported');
    expect((gwSpec as any).features.do_loop).toBe('not_supported');
    expect((gwSpec as any).statements).not.toHaveProperty('SELECT CASE');
    expect((gwSpec as any).statements).not.toHaveProperty('DO');
  });
  it('Only QB45 has REDIM PRESERVE', () => {
    expect(((qb45Spec as any).statements.REDIM.args as string)).toContain('PRESERVE');
    expect(((qbSpec as any).statements.REDIM.args as string)).not.toContain('PRESERVE');
  });
});

describe('all dialects share operator set', () => {
  it('arithmetic operators consistent', () => {
    const ar = ['+', '-', '*', '/', '\\', '^', 'MOD'];
    for (const { spec } of dialects) {
      expect((spec as any).operators.arithmetic).toEqual(ar);
    }
  });
  it('comparison operators consistent', () => {
    const cmp = ['=', '<>', '<', '>', '<=', '>='];
    for (const { spec } of dialects) {
      expect((spec as any).operators.comparison).toEqual(cmp);
    }
  });
});

describe('type suffixes match dialect lineage', () => {
  it('GW-BASIC has 4 suffixes (no LONG)', () => {
    expect(Object.keys((gwSpec as any).type_suffixes).sort()).toEqual(['!', '#', '$', '%']);
  });
  it('QBasic + QB45 add LONG (&)', () => {
    expect((qbSpec as any).type_suffixes['&']).toBe('LONG');
    expect((qb45Spec as any).type_suffixes['&']).toBe('LONG');
  });
});
